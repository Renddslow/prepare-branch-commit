import core from '@actions/core';
import { extractTicketLabels } from './index.js';

const runAction = () => {
  try {
    const branchName = core.getInput('branch-name');

    const issueTags = extractTicketLabels(branchName);

    if (!issueTags) {
      console.log('Did not find any issue tags.');
      return;
    }

    const tagsCSV = issueTags.join(',');

    core.setOutput('issue-tags', tagsCSV);
  } catch (error) {
    core.setFailed((error as Error).message);
  }
};

if (require.main === module) {
  runAction();
}
