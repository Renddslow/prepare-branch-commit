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

  console.log(issueNumber);
})()
  .then(() => {
    process.exit(2);
  })
  .catch((e) => {
    console.log(e);
    process.exit(2);
  });
