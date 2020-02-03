const fs = require('fs');
const { promisify } = require('util');
const { execSync } = require('child_process');

const read = promisify(fs.readFile);
const write = promisify(fs.writeFile);

(async () => {
  const [msgFile] = process.env.HUSKY_GIT_PARAMS.split(' ');
  const msg = (await read(msgFile)).toString();

  const regexpr = /((?<!([A-Z]{1,10})-?)[A-Z]+-\d+)/g;
  const branch = execSync('git branch | grep "* feature/"').toString();
  console.log(branch);
  const match = regexpr.exec(branch);

  if (!match) return;

  const issueNumber = match[0];

  console.log(issueNumber);
})().then(() => {
  process.exit(2);
});
