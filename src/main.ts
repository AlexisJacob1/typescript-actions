import * as core from '@actions/core';
import { PullRequestTagger } from './pull-request-tagger';

async function run(): Promise<void> {
	try {
		await new PullRequestTagger().tagPullRequest();
		core.info('Job completed successfully');
	} catch (error) {
		if (error instanceof Error) {
			core.setFailed(error.message);
		}
	}
}

run();
