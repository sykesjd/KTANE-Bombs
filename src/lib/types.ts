export class ChallengeBomb {
	Name: string;
	Bombs: Bomb[];
	Completions: Completion[];
	FirstCompletion: number;
}

export class Bomb {
	Modules: number;
	Time: number;
	Strikes: number;
	Widgets: number;
	Pools: Pool[];
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
