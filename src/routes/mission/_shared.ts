import type { RepoModule } from '$lib/repo';
import type { Mission } from '$lib/types';

export function getModule(moduleID: string, modules: RepoModule[] | null) {
	const module = modules?.filter((module) => module.ModuleID == moduleID);
	if (module?.length === 1) {
		return module[0];
	}

	return {
		Name: moduleID,
		ModuleID: moduleID,
		X: 0,
		Y: 0
	};
}

export function sortBombs(mission: Mission) {
	for (const pool of mission.bombs.flatMap((bomb) => bomb.pools)) {
		pool.modules.sort();
	}

	for (const bomb of mission.bombs) {
		bomb.pools.sort((a, b) => a.modules.join().localeCompare(b.modules.join()));
	}
}
