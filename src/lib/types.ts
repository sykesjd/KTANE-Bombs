export class ChallengeBomb {
	Name: string;
	Modules: number;
	Time: number;
	Strikes: number;
	Widgets: number;
	Pools: string[];
	Completions: Completion[];
}

export class Pool {
	Modules: string[];
	Count: number;

	constructor(modules: string[], count: number) {
		this.Modules = modules;
		this.Count = count;
	}
}

export class Completion {
	Proof: string;
	Time: number;
	Team: string[];
}
