const core = require('@actions/core');
const { extractTicketLabels } = require('./index.js');

try {
  const branchName = core.getInput('branch-name');

  const issueTags = extractTicketLabels(branchName);

  if (!issueTags) return console.log('Did not find any issue tags.');

  const tagsCSV = issueTags.join(',');

  core.setOutput('issue-tags', tagsCSV);
} catch (error) {
  core.setFailed(error.message);
}
