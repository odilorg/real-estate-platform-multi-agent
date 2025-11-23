GIT INSTRUCTIONS FOR CLAUDE AND SUBAGENTS
=========================================

This file defines how you (Claude and all subagents) must use Git in this project.

Goal:
- You manage Git yourself: create branches, commit, and push as needed.
- Use a clean, standard workflow: one feature/phase per branch, small commits, frequent pushes.
- Keep history safe: no destructive commands unless the user explicitly asks.


1. GENERAL PRINCIPLES
=====================

1.1 Single workspace
- All agents share the same working directory and the same .git repository.
- Only ONE branch is active at any time.
- You MUST NOT try to work on multiple branches in parallel in this workspace.

1.2 One feature/phase per branch
- Every significant feature or phase of work must be done on its own branch.
- A branch should correspond to a clear goal like:
  - phase-1-monorepo-setup
  - phase-2-auth-and-users
  - feature/listing-crud
  - fix/login-bug

1.3 Autonomous Git usage
- You ARE allowed to:
  - create new branches
  - commit changes
  - push branches to the remote
  without waiting for explicit commands from the user for each step.
- You MUST keep the user informed about:
  - which branch you created
  - which commits you made
  - when you pushed.

1.4 Safety first
- Do NOT rewrite history (no rebase/reset/force-push) unless the user explicitly asks.
- Do NOT delete branches (local or remote) unless the user explicitly asks.
- Do NOT modify .git internals.


2. BRANCHING MODEL
==================

2.1 Base branch
- Assume "main" is the stable base branch unless the repository clearly defines another convention.
- Before starting new work:
  - Check out main
  - Pull latest changes

  Example:
    git checkout main
    git pull

2.2 Creating feature/phase branches
- When starting a new phase or feature, create a branch from main:

  Example:
    git checkout main
    git pull
    git checkout -b phase-1-monorepo-setup

- Naming rules:
  - Use descriptive kebab-case.
  - Prefix suggestions:
    - "phase-" for large phases linked to the project plan.
    - "feature/" for new features.
    - "fix/" for bug fixes.
    - "chore/" for refactors or infrastructure changes.

Examples:
  phase-1-monorepo-setup
  phase-2-auth-and-users
  feature/listing-crud
  fix/login-redirect
  chore/update-deps


3. WORKFLOW PER BRANCH
======================

For each new branch you create, follow this sequence:

3.1 Plan the work
- Use the project-architect subagent (if available) to:
  - read the project guide (CLAUDE.md or similar)
  - break down the phase/feature into small tasks
  - assign tasks to backend, frontend, db, devops, etc. subagents.

3.2 Implement tasks sequentially
- Execute tasks one by one, NOT in parallel.
- All tasks for this branch must be completed on this branch only.
- Do not switch branches while in the middle of a task.

Typical order:
  1) devops or setup work (if needed)
  2) db schema changes (if needed)
  3) backend implementation
  4) frontend implementation
  5) tests and fixes
  6) code review and cleanup

3.3 Commit frequently
- After each logical step, make a commit:
  - Example: after scaffolding backend
  - Example: after adding a new API endpoint
  - Example: after implementing a UI page

Steps:
  - Check the diff to ensure the expected files are changed.
  - Stage only the relevant files.
  - Commit with a clear message.

Example:
  git add apps/api/src apps/api/package.json
  git commit -m "feat(api): scaffold NestJS app with health check"

3.4 Push regularly
- Push the branch to remote once there is a meaningful unit of work completed.
- First push:

  git push --set-upstream origin <branch-name>

- Subsequent pushes:

  git push

- Push after:
  - finishing a phase of work on the branch
  - completing several commits
  - before stopping work for a while

3.5 Summarize to the user
- After finishing the planned work on a branch:
  - Summarize what you did.
  - Mention the branch name.
  - Mention any follow-up tasks or remaining work.
  - Inform the user that the branch is ready for review or PR.


4. COMMIT RULES
===============

4.1 Small, coherent commits
- Each commit should represent a clear, self-contained change:
  - Adding a feature
  - Fixing a bug
  - Refactoring a module
  - Updating configuration

4.2 Commit message style
- Use short, descriptive messages with prefixes when helpful:
  - feat(api): ...
  - feat(web): ...
  - chore: ...
  - fix: ...
  - refactor: ...

Examples:
  feat(api): add login endpoint and user service
  feat(web): add login page and form validation
  chore: configure root npm workspace
  fix(api): correct auth guard for protected routes

4.3 Stage intentionally
- Do not blindly run "git add .".
- Prefer adding only the necessary paths:
  - git add apps/api/src
  - git add apps/web/app

4.4 Test before committing (when tests exist)
- When there is a test suite relevant to your changes:
  - Run tests.
  - If tests fail, fix them or clearly explain why they are failing.
- Do not ignore failing tests on a feature branch unless the user approves.


5. PUSHING RULES
================

5.1 When to push
- Push when:
  - A significant part of the feature or phase is complete.
  - You have multiple commits and the branch is in a consistent state.
  - You are about to stop working for a while.

5.2 How to push
- Initial push:

  git push --set-upstream origin <branch-name>

- Subsequent pushes:

  git push

5.3 What NOT to do
- Do not push obviously broken work without telling the user it is WIP.
- Do not use "git push --force" unless the user explicitly instructs you to.


6. PROHIBITED GIT ACTIONS (UNLESS USER EXPLICITLY ASKS)
=======================================================

You must NOT do the following unless the user clearly approves:

- git reset --hard
- git rebase (any form)
- git push --force or git push -f
- git clean -fd
- Deleting branches (local or remote)
- Editing or removing the .git directory

If you think such an action is needed:
- Explain why.
- Ask the user for permission.
- Only proceed if clearly approved.


7. MULTI-AGENT RULES IN ONE REPO
================================

7.1 Shared workspace
- All subagents operate on the same repo and branch at a given time.
- You MUST NOT assume isolation between subagents.

7.2 Sequential execution
- project-architect may plan and orchestrate work.
- backend, frontend, db, devops, test-runner, and code-reviewer must execute tasks one after another on the SAME branch.
- Avoid concurrent edits by different subagents on the same files at the same time.

7.3 No branch switching in the middle of work
- Once you start working on a feature branch, stay on it until:
  - the task list for that branch is completed, or
  - the user tells you to stop or switch.


8. EXAMPLE WORKFLOW FOR A PHASE
===============================

Example: "Phase 2 – Auth & Users"

1) Ensure main is up to date:
   git checkout main
   git pull

2) Create branch:
   git checkout -b phase-2-auth-and-users

3) Plan (with project-architect):
   - Design User model and auth API contract.
   - Define tasks for db-schema-designer, backend-engineer, frontend-engineer, test-runner.

4) Execute tasks sequentially on this branch:
   - db-schema-designer: add User model to Prisma
   - backend-engineer: implement /auth/register and /auth/login
   - frontend-engineer: build login and signup pages
   - test-runner: run tests, fix failures
   - code-reviewer: review and suggest improvements

5) Commit along the way:
   git add prisma/schema.prisma
   git commit -m "feat(db): add User model"

   git add apps/api/src
   git commit -m "feat(api): implement email/password auth"

   git add apps/web
   git commit -m "feat(web): add login and signup pages"

6) Push branch:
   git push --set-upstream origin phase-2-auth-and-users

7) Summarize:
   - Describe what was implemented.
   - State that "phase-2-auth-and-users" is ready for review/PR.


9. FINAL SUMMARY OF RULES (FOR CLAUDE)
======================================

- Always work in a Git branch.
- Create a new branch from main for each phase or major feature.
- Perform all work for that feature on that branch only.
- Use small, coherent commits with clear messages.
- Push branches regularly so work is backed up and visible.
- Do NOT rewrite history or force-push unless the user explicitly requests it.
- Do NOT delete branches or use destructive git commands without explicit approval.
- Execute subagents sequentially on the same branch; no parallel branch work.
- Keep the user informed about branches, commits, pushes, and remaining work.

Follow these instructions strictly for all Git operations in this project.
