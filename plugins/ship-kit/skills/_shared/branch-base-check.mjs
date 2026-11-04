#!/usr/bin/env node
// branch-base-check — refuses (or warns about) a branch cut from another
// branch instead of from origin/<base>: one whose oldest commit ahead of the
// base is also on another remote branch.
//
// Catches the failure mode where you branch from another open PR's tip. Your
// PR then carries that PR's commits, and when the upstream squash-merges,
// your branch points at commits that no longer exist on the base, so the
// next rebase becomes per-file conflict resolution.
//
// Work that needs several PRs uses ONE feature branch instead (feat/<name>):
// each piece is cut from it and checked with --base=feat/<name>.
//
// Usage:
//   node scripts/branch-base-check.mjs              # warn-only (exit 0)
//   node scripts/branch-base-check.mjs --strict     # fail on bad base (exit 1)
//   node scripts/branch-base-check.mjs --base=main  # override base branch
//
// Env:
//   ALLOW_STACKED=1   # bypass entirely (intentional, coordinated stacks)
//
// Skip-on-integration-branch: if HEAD is main/develop/staging, exit 0.

import { execFileSync } from 'node:child_process';

const INTEGRATION_BRANCHES = new Set(['main', 'develop', 'staging']);

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const baseArg = args.find((a) => a.startsWith('--base='));
const explicitBase = baseArg?.split('=')[1];

if (process.env.ALLOW_STACKED === '1') {
  process.exit(0);
}

// Arguments as arguments, never a command string: `execSync` runs it through a
// shell, which on Windows is cmd.exe with its own quoting and `%VAR%` expansion.
function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

function gitSilent(args) {
  try {
    return git(args);
  } catch {
    return null;
  }
}

// An ARRAY: `git()` uses execFileSync, which throws on a string argument list —
// and gitSilent swallowed that throw as "detached HEAD", so this check exited 0
// on every branch and never refused anything.
const head = gitSilent(['rev-parse', '--abbrev-ref', 'HEAD']);
if (!head || head === 'HEAD') {
  // Detached HEAD — nothing useful to check.
  process.exit(0);
}

if (INTEGRATION_BRANCHES.has(head)) {
  process.exit(0);
}

// Determine the base. Use --base if provided, else try develop, else main.
function resolveBase() {
  if (explicitBase) return explicitBase;
  for (const candidate of ['develop', 'main']) {
    if (gitSilent(['rev-parse', '--verify', '--quiet', `origin/${candidate}`])) {
      return candidate;
    }
  }
  return null;
}

const base = resolveBase();
if (!base) {
  // No origin/develop or origin/main — likely a fresh repo or no remote yet.
  process.exit(0);
}

const baseRef = `origin/${base}`;
const headSha = gitSilent(['rev-parse', 'HEAD']);
const mergeBase = gitSilent(['merge-base', baseRef, 'HEAD']);

if (!headSha || !mergeBase) {
  process.exit(0);
}

if (mergeBase === headSha) {
  // HEAD is on (or behind) the base — nothing to do.
  process.exit(0);
}

// THE TEST. Take the oldest commit this branch has that the base does not. If
// another branch on origin also carries it, this branch was cut from that one:
// it is stacked on it, and its PR would carry that branch's commits too.
//
// This catches the stack whether or not the PR underneath has merged. The old
// test — "is the merge-base on the base's first-parent trunk?" — could not: a
// branch cut from an open PR has an ordinary trunk commit as its merge-base
// until that PR merges, and after a SQUASH merge it still does, so it passed
// exactly the branches it existed to stop. (It also flagged the one harmless
// case: a parent merged with a merge commit, whose commits are on the base.)
//
// Branches built on top of this one carry its commits too; those are not what
// it was cut from, so a ref that contains HEAD itself is ignored.
//
// A commit that arrived through a merge isn't a stack either. A feature branch's
// final PR has only merge commits on its first-parent line, and its oldest commit
// is a piece's, still on that piece's branch: that's the convention below working,
// so only a commit on this branch's own first-parent line counts.
//
// History can't say which of two branches came first. If B was cut from A and A
// then moved on, each holds a commit the other lacks, so checking A reports B too.
// The message says "shares" rather than claiming a direction, and names the bypass.
const own = gitSilent(['rev-list', '--reverse', '--topo-order', `${baseRef}..HEAD`]);
const first = own?.split('\n')[0];
if (!first) {
  process.exit(0);
}
const firstParent = gitSilent(['rev-list', '--first-parent', `${baseRef}..HEAD`]);
if (!firstParent?.split('\n').includes(first)) {
  process.exit(0);
}

function sourceBranches() {
  const refs = gitSilent([
    'for-each-ref',
    '--contains',
    first,
    '--format=%(refname:short)',
    'refs/remotes/origin',
  ]);
  if (!refs) return [];
  return refs
    .split('\n')
    .filter(Boolean)
    .filter((ref) => ref !== baseRef && ref !== 'origin/HEAD' && ref !== 'origin')
    .filter((ref) => ref !== `origin/${head}`)
    .filter((ref) => {
      // Built on top of this branch, not underneath it.
      try {
        git(['merge-base', '--is-ancestor', 'HEAD', ref]);
        return false;
      } catch {
        return true;
      }
    });
}

const sources = sourceBranches();
if (sources.length === 0) {
  // Every commit ahead of the base is this branch's own.
  process.exit(0);
}
const guessed = sources[0];
const ahead = gitSilent(['rev-list', '--count', `${baseRef}..HEAD`]) ?? '?';
const behind = gitSilent(['rev-list', '--count', `HEAD..${baseRef}`]) ?? '?';

const lines = [
  '',
  `⚠ branch-base-check: this branch is not based on ${baseRef}`,
  '',
  `  Branch:         ${head}`,
  `  Shares with:    ${guessed} (both carry ${first.slice(0, 12)}, this branch's oldest commit)`,
  `  Ahead/behind:   ${ahead} / ${behind} commits`,
  '',
  'Why this matters:',
  '  Branches stacked on other open PRs cause cascading rebase failures',
  `  when the upstream PR squash-merges. Always branch from ${baseRef}`,
  '  unless you have an explicit reason (and have coordinated merge order).',
  '',
  'To fix:',
  `  1. git switch -c <new-branch> ${baseRef}`,
  '  2. git cherry-pick <your commits from this branch>',
  '  3. Open the PR from the new branch.',
  '',
  'Work that needs several PRs: do not stack PR on PR. Make one feature',
  `  branch from ${baseRef} (feat/<name>), branch each piece from it, open each`,
  '  PR INTO it, and open one final PR from feat/<name> to the default branch.',
  '  Run this check with --base=feat/<name> for the pieces.',
  '',
  `If ${guessed} was cut from this branch and this branch then moved on, this`,
  'is a false alarm: history alone cannot tell which came first.',
  '',
  'On a feature branch, this means a piece was fast-forwarded in or a commit was',
  'made on it directly. Merge pieces with merge commits, or use the override.',
  '',
  "To override (a false alarm, or you're intentionally stacking and have a plan):",
  '  ALLOW_STACKED=1 <your command>',
  '',
];

console.error(lines.join('\n'));

process.exit(strict ? 1 : 0);
