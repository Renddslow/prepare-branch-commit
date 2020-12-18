#!/usr/bin/env node
const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const execute = promisify(exec);

(async () => {
  const [msgFile] = process.env.HUSKY_GIT_PARAMS.split(' ');
  const msg = (await read(msgFile)).toString();

  const regexpr = /((?<!([A-Z]{1,10})-?)[A-Z]{1,10}-\d+-?)+/g;
  const out = await execute('git branch');
  const [branch] = out.stdout.split('\n').filter((b) => b.includes('*'));

  if (!branch) return;

  const match = regexpr.exec(branch.toString());

  if (!match) return;

  const issueTag = match[0]
    //Divide to tag name and number
    .split('-')
    // Combine tag name and number
    .map((_, i, array) =>
      i % 2 === 0 ? `[${array[i]}-${array[i + 1] ? array[i + 1] : 'X'}]` : null,
    )
    // Only keep valid tags
    .filter((tag, i, array) => tag.length > 0 && array.findIndex(tag) === i)
    // Sort alphabetically
    .sort()
    // Combine to a single string
    .reduce((acc, val) => (val === null ? acc : `${acc} ${val}`), '')
    .trim();
  const newMsg = msg.startsWith(issueTag) ? msg : `${issueTag} ${msg}`;

  await write(msgFile, newMsg);
})().catch((e) => {
  console.error('There was an issue getting your branch name.', e);
  process.exit(1);
});
