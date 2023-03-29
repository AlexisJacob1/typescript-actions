import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

export abstract class BaseGithubClient {
	protected client: ReturnType<typeof getOctokit>;

	constructor() {

		const token: string | undefined = getInput('repo-token');

		if (!token) {
			throw new Error("Invalid token");
		}

		this.client = getOctokit(token);
	}
}