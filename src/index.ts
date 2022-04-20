import { promisify } from 'util';
import { readFile, writeFile } from 'fs';
import { exec } from 'child_process';

const regexpr = /([A-Z]{1,10}-\d+-?)+/;

export const extractTicketLabels = (branch: string, prefix = '', suffix = '') => {
  const match = regexpr.exec(branch);

  if (!match) return;

  return (
    match[0]
      // Remove extra hyphen
      .replace(/-$/, '')
      // Divide to tag name and number
      .split('-')
      // Combine tag name and number
      .map((_, i, array) =>
        i % 2 === 0 ? `${prefix}${array[i]}-${array[i + 1] ? array[i + 1] : 'X'}${suffix}` : null,
      )
      // Only keep valid tags
      .filter(
        (tag, i, array): tag is string =>
          !!tag && tag.length > 0 && array.findIndex((val) => tag === val) === i,
      )
      // Sort alphabetically
      .sort()
  );
};

const prependTagToMessage = (issueTag: string, message: string) => {
  const splitMessage = message.split(/\n/);
  const firstNonCommentLine = splitMessage.findIndex((line) => !line.trimLeft().startsWith('#'));
  if (firstNonCommentLine < 0) {
    return message;
  }
  return [
    ...splitMessage.slice(0, firstNonCommentLine),
    `${issueTag} ${splitMessage[firstNonCommentLine].trim()}`,
    ...splitMessage.slice(firstNonCommentLine + 1),
  ].join('\n');
};

export const processBranchString = (branch: string, msg: string) => {
  const issueTags = extractTicketLabels(branch, '[', ']');

  if (!issueTags) {
    console.log('No issue tags found in branch name');
    return;
  }

  const issueTag = issueTags
    // Combine to a single string
    .reduce((acc, val) => (val === null ? acc : `${acc} ${val}`), '')
    .trim();

  return (msg.startsWith(issueTag) ? msg : prependTagToMessage(issueTag, msg)).trim();
};

const main = () => {
  const read = promisify(readFile);
  const write = promisify(writeFile);
  const execute = promisify(exec);
  return new Promise(async () => {
    const [msgFile] = process.env.HUSKY_GIT_PARAMS
      ? process.env.HUSKY_GIT_PARAMS.split(' ')
      : process.argv.slice(2);
    if (msgFile) {
      const msg = (await read(msgFile)).toString();

      const out = await execute('git branch');
      const [branch] = out.stdout.split('\n').filter((b) => b.includes('*'));

      if (!branch) {
        console.log('No current branch was found');
      }

      const newMsg = processBranchString(branch.toString(), msg);
      process.env.PBC_DEBUG && console.log(newMsg);
      if (newMsg) {
        await write(msgFile, newMsg);
      }
    }
  }).catch((e) => {
    console.error('There was an issue getting your branch name.', e);
    process.exit(1);
  });
};

if (require.main === module) {
  void main();
}
