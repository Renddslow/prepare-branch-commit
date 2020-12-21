#!/usr/bin/env node

const regexpr = /([A-Z]{1,10}-\d+-?)+/;
const processBranchString = (branch, msg) => {
  const match = regexpr.exec(branch);

  if (!match) return;

  const issueTag = match[0]
    // Remove extra hyphen
    .replace(/-$/, '')
    // Divide to tag name and number
    .split('-')
    // Combine tag name and number
    .map((_, i, array) =>
      i % 2 === 0 ? `[${array[i]}-${array[i + 1] ? array[i + 1] : 'X'}]` : null,
    )
    // Only keep valid tags
    .filter((tag, i, array) => tag && tag.length > 0 && array.findIndex((val) => tag === val) === i)
    // Sort alphabetically
    .sort()
    // Combine to a single string
    .reduce((acc, val) => (val === null ? acc : `${acc} ${val}`), '')
    .trim();
  return (msg.startsWith(issueTag) ? msg : `${issueTag} ${msg.trim()}`).trim();
};

if (require.main === module) {
  const fs = require('fs');
  const { promisify } = require('util');
  const { exec } = require('child_process');

  const read = promisify(fs.readFile);
  const write = promisify(fs.writeFile);
  const execute = promisify(exec);
  (async () => {
    if (process.env.HUSKY_GIT_PARAMS) {
      const [msgFile] = process.env.HUSKY_GIT_PARAMS.split(' ');
      const msg = (await read(msgFile)).toString();

      const out = await execute('git branch');
      const [branch] = out.stdout.split('\n').filter((b) => b.includes('*'));

      if (!branch) return;

      const newMsg = processBranchString(branch.toString(), msg);
      if (newMsg) {
        await write(msgFile, newMsg);
      }
    }
  })().catch((e) => {
    console.error('There was an issue getting your branch name.', e);
    process.exit(1);
  });
}

exports.processBranchString = processBranchString;
