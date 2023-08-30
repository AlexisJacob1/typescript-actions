import * as core from '@actions/core';
import * as github from '@actions/github';

export class PullRequestTagger {
	private client: ReturnType<typeof github.getOctokit>;

	/**
	 *
	 */
	constructor() {
		const token: string | undefined = core.getInput('repo-token');

		if (!token) {
			throw new Error('Invalid token');
		}

		this.client = github.getOctokit(token);
	}

	async tagPullRequest(): Promise<void> {
		const currentPullRequest = github.context.payload.pull_request;
		if (!currentPullRequest) {
			throw new Error('No pull request');
		}

		const pullRequest = await this.client.rest.pulls.get({
			owner: github.context.repo.owner,
			repo: github.context.repo.repo,
			pull_number: currentPullRequest.number
		});
		let actionToExecute: Promise<void>;

		if (new RegExp(/prod.*/gi).test(pullRequest.data.base.label)) {
			actionToExecute = this.addTagToPullRequest(
				currentPullRequest.number
			);
		} else {
			actionToExecute = this.removeTagFromPullRequest(
				currentPullRequest.number
			);
		}

		await actionToExecute;
	}

	private async addTagToPullRequest(idPullRequest: number): Promise<void> {
		core.info('Adding label to pull request');
		await this.client.rest.issues.addLabels({
			owner: github.context.repo.owner,
			repo: github.context.repo.repo,
			issue_number: idPullRequest,
			labels: ['report-to-develop']
		});
	}

	private async removeTagFromPullRequest(
		idPullRequest: number
	): Promise<void> {
		core.info('Removing label from pull request');
		await this.client.rest.issues.removeLabel({
			owner: github.context.repo.owner,
			repo: github.context.repo.repo,
			issue_number: idPullRequest,
			name: 'report-to-develop'
		});
	}
}
