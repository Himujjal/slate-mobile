---
name: commit
description: Stage, commit and push changes with conventional commit format
license: MIT
compatibility: opencode
---

# Commit

Stages all changes, commits with a conventional commit message, and pushes to the remote branch.

## When to Use

Use this skill when you want to commit and push code changes with a properly formatted commit message. This skill handles the entire git workflow: stage, commit, push.

## Commit Message Format

Use commitlint-style format:

```
<type>(<scope>): <subject>

<body>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Formatting changes (Biome)
- `chore`: Maintenance, dependencies
- `docs`: Documentation
- `test`: Testing
- `perf`: Performance

### Examples

```
feat(auth): implement sign in flow

fix(auth): persist auth state across app restarts

refactor(ui): extract button component to shared library

style(biome): format all components with biome

chore(deps): add expo-web-browser dependency
```

## Steps

1. Run `git status` to see all changes
2. Run `git diff --staged` and `git diff` to understand what changed
3. Run `git log --oneline -5` for commit history context
4. Analyze the changes and determine the appropriate type and scope
5. Stage all changes: `git add -A`
6. Create commit with conventional format
7. Push to remote: `git push`

## Rules

- If there are no changes to commit, do not create an empty commit
- Do not commit secret files (.env, credentials.json, etc.)
- Write concise, descriptive messages that explain the "why" not the "what"
- Use present tense: "add" not "added"