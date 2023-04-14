import * as core from '@actions/core'
import { PullRequestTagger } from './pull-request-tagger'

async function run(): Promise<void> {
	try {
		new PullRequestTagger().tagPullRequest()
		.then(() => {})
		.catch((err) => {
			throw new Error(err)
		});

	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message)
		}
	}
}

run()
