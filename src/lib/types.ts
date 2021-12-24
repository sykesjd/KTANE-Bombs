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
