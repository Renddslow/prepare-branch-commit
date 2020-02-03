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
