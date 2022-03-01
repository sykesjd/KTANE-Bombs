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
	VerifyMission = 1,
	VerifyCompletion = 2
}

export type ID<T> = T & { id: number };

export class Mission {
	name: string;
	bombs: Bomb[];
	completions: Completion[];
	tpSolve: boolean;
	factory: string | null;
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
	proofs: string[];
	time: number;
	team: string[];
	first: boolean;
	old: boolean;
}

export type QueueItem = MissionQueueItem | CompletionQueueItem;

export interface MissionQueueItem {
	type: 'mission';
	mission: ID<Mission>;
}

export interface CompletionQueueItem {
	type: 'completion';
	completion: ID<Completion>;
	mission: ID<Mission>;
}

export interface Completer {
	name: string;
	distinct: number;
	defuser: number;
	expert: number;
	efm: number;
}
