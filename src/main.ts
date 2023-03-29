import * as core from '@actions/core'
import * as github from '@actions/github'
import { PullRequestTagger } from './tag-pull-request'
import {wait} from './wait'

async function run(): Promise<void> {
	try {
		// const ms: string = core.getInput('milliseconds')
		// core.debug(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true
		
		// core.debug(new Date().toTimeString())
		// await wait(parseInt(ms, 10))
		// core.debug(new Date().toTimeString())
		
		// core.setOutput('time', new Date().toTimeString())
		
		// const payload = JSON.stringify(github.context.payload, undefined, 4)
		// console.log(`The event payload: ${payload}`);
		
		// const pullRequestInfos = JSON.stringify(github.context.payload.pull_request, undefined, 4)
		// console.log(`The PR payload: ${pullRequestInfos}`);
		
		// console.log("ended jobs");
		new PullRequestTagger().tagPullRequest()
		.then(() => {
			console.log("Finised job");
		})
		.catch((err) => {
			throw new Error(err)
		});
		
	} catch (error) {
		if (error instanceof Error) core.setFailed(error.message)
	}
}

run()
