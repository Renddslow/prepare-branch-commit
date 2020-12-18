# prepare-branch-commit

> Add text to commits based on Jira ticket numbers in the branch name.

## Install

```
$ yarn add --dev prepare-branch-commit
```

## Usage

prepare-branch-commit is meant to be run as a Husky hook:

```json
{
  // ...
  "husky": {
    "prepare-commit-msg": "prepare-branch-commit"
  }
  // ...
}
```

## Usage Examples
```
branch name: feature/ABC-123-new-screen
commit prefix: [ABC-123]

branch name: hotfix/FUN-456-ABC-123-bugfix-time
commit prefix: [ABC-123] [FUN-456]
```


