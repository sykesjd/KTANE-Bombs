export class FrontendUser {
	id: string;
	username: string;
	avatar: string;
	permissions: Permission[];
}

// Be careful when changing this enum.
// User's permissions are stored by integer.
export enum Permission {
	ModifyPermissions = 0,
}

export class Mission {
	name: string;
	bombs: Bomb[];
	completions: Completion[];
}

export class Bomb {
	modules: number;
	time: number;
	strikes: number;
	widgets: number;
	pools: Pool[];
}

export class Pool {
	modules: string[];
	count: number;

	constructor(modules: string[], count: number) {
		this.modules = modules;
		this.count = count;
	}
}

export class Completion {
	proof: string;
	time: number;
	team: string[];
	first: boolean;
}
