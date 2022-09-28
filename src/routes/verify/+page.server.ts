
import client from '$lib/client';
import type { CompletionQueueItem, MissionQueueItem, QueueItem } from '$lib/types';
import { Permission, type MissionPackQueueItem } from '$lib/types';
import { fixPools, forbidden, hasAnyPermission, hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';
import {error} from '@sveltejs/kit'

export const load: RequestHandler<never, { queue: QueueItem[] }> = async function ({ parent }) {
	const {user} = await parent()
	if (
		!hasAnyPermission(
			user,
			Permission.VerifyMission,
			Permission.VerifyCompletion,
			Permission.VerifyMissionPack
		)
	) {
		throw error(403);
	}

	const queue: QueueItem[] = [];

	// Missions
	if (hasPermission(user, Permission.VerifyMission)) {
		const missions = await client.mission.findMany({
			where: {
				verified: false
			},
			select: {
				id: true,
				name: true,
				authors: true,
				bombs: true,
				factory: true
			}
		});

		queue.push(
			...missions.map((mission) => {
				return {
					type: 'mission',
					mission: {
						...fixPools(mission),
						completions: [],
						tpSolve: false
					}
				} as MissionQueueItem;
			})
		);
	}

	// Completions
	if (hasPermission(user, Permission.VerifyCompletion)) {
		const completions = await client.completion.findMany({
			where: {
				verified: false
			},
			include: {
				mission: {
					include: {
						bombs: true,
						completions: true
					}
				}
			}
		});

		queue.push(
			...completions.map((completion) => {
				return {
					type: 'completion',
					completion,
					mission: fixPools(completion.mission)
				} as CompletionQueueItem;
			})
		);
	}

	// Mission Pack
	if (hasPermission(user, Permission.VerifyMissionPack)) {
		const missionPacks = await client.missionPack.findMany({
			where: {
				verified: false
			}
		});

		queue.push(
			...missionPacks.map((pack) => {
				return {
					type: 'missionpack',
					pack
				} as MissionPackQueueItem;
			})
		);
	}

	return {
			queue
	};
};
