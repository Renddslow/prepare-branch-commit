const core = require('@actions/core');
const { extractTicketLabels } = required('./index.js');

try {
  const branchName = core.getInput('branch-name');

  const issueTags = extractTicketLabels(branchName);

  const tagsCSV = issueTags.join(',');

  console.log(tagsCSV);

  core.setOutput('issue-tags', tagsCSV);
} catch (error) {
  core.setFailed(error.message);
}
