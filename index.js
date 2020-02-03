const fs = require('fs');
const { promisify } = require('util');
const { exec } = require('child_process');

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);
const execute = promisify(exec);

(async () => {
  const [msgFile] = process.env.HUSKY_GIT_PARAMS.split(' ');
  const msg = (await read(msgFile)).toString();

  const regexpr = /((?<!([A-Z]{1,10})-?)[A-Z]+-\d+)/g;
  const out = await execute('git branch');
  const [branch] = out.stdout.split('\n').filter((b) => b.includes('*'));

  if (!branch) return;

  const match = regexpr.exec(branch.toString());

  if (!match) return;

  const issueNumber = match[0];
  const newMsg = `[${issueNumber}] ${msg}`;

  await write(msgFile, newMsg);
})().catch((e) => {
  console.error('There was an issue getting your branch name.', e);
  process.exit(1);
});
