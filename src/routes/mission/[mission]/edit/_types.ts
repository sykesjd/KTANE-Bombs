import type { ID, Mission, Completion, MissionPack } from '$lib/types';

export type EditMission = Omit<ID<Mission>, 'completions'> & {
	completions: ID<Completion>[];
	missionPack: Pick<ID<MissionPack>, 'id' | 'name'>;
};
