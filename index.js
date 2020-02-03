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
  const branch = execute('git branch | grep "* feature/"');
  console.log(branch);

  if (!branch) return;

  const match = regexpr.exec(branch.toString());

  if (!match) return;

  const issueNumber = match[0];

  console.log(issueNumber);
})().then(() => {
  process.exit(2);
});
