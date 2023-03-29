import * as core from '@actions/core'
import * as github from '@actions/github'
import { BaseGithubClient } from './utils/github-client';

export class PullRequestReporter extends BaseGithubClient {
	createPullRequest(idOriginalPullRequest: number, baseBranchName: string): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.rest.pulls.create({
				owner: github.context.repo.owner,
				repo: github.context.repo.repo,
				base: baseBranchName,
				title: `Report Pull Request ${idOriginalPullRequest}`,
				
			})
		});
	}
}