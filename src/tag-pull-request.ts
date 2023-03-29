import * as core from '@actions/core'
import * as github from '@actions/github'

export class PullRequestTagger {

	tagPullRequest(): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			const currentPullRequest = github.context.payload.pull_request;	
			if (!currentPullRequest) {
				reject();
				throw new Error("No pull request");
			}

			console.log(JSON.stringify(currentPullRequest, undefined, 4));
		})
	}
}