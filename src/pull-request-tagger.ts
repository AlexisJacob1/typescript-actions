import * as core from '@actions/core'
import * as github from '@actions/github'

export class PullRequestTagger {

	private client: ReturnType<typeof github.getOctokit>;

	/**
	 *
	 */
	constructor() {

		const token: string | undefined = core.getInput('repo-token');

		if (!token) {
			throw new Error("Invalid token");
		}

		this.client = github.getOctokit(token);
	}

	tagPullRequest(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const currentPullRequest = github.context.payload.pull_request;	
			if (!currentPullRequest) {
				reject();
				throw new Error("No pull request");
			}

			this.client.rest.pulls.get({
				owner: github.context.repo.owner,
				repo: github.context.repo.repo,
				pull_number: currentPullRequest.number
			}).then((pullRequest) => {

				let actionToExecute: Promise<void>;

				if(new RegExp(/prod.*/gi).test(pullRequest.data.base.label)) {
					actionToExecute = this.addTagToPullRequest(currentPullRequest.number);
				} else {
					actionToExecute = this.removeTagFromPullRequest(currentPullRequest.number);
				}

				actionToExecute
				.then(() => resolve())
				.catch((err) => {
					reject(err);
				})
			})
			.catch((err) => {
				reject(err);
			});
			
			resolve();
		})
	}

	private addTagToPullRequest(idPullRequest: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.rest.issues.addLabels({
				owner: github.context.repo.owner,
				repo: github.context.repo.repo,
				issue_number: idPullRequest,
				labels: ['report-to-develop']
			}).then(() => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			})
		})
	}

	private removeTagFromPullRequest(idPullRequest: number): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.rest.issues.removeLabel({
				owner: github.context.repo.owner,
				repo: github.context.repo.repo,
				issue_number: idPullRequest,
				name: 'report-to-develop'
			}).then(() => {
				resolve();
			})
			.catch((err) => {
				reject(err);
			})
		})
	}
}