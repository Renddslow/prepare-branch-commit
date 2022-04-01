import { getInput, setFailed, setOutput } from '@actions/core';
import { extractTicketLabels } from './index.js';

const runAction = () => {
  try {
    const branchName = getInput('branch-name');

    const issueTags = extractTicketLabels(branchName);

    if (!issueTags) {
      console.log('Did not find any issue tags.');
      return;
    }

    const tagsCSV = issueTags.join(',');

    setOutput('issue-tags', tagsCSV);
  } catch (error) {
    setFailed((error as Error).message);
  }
};

if (require.main === module) {
  runAction();
}
