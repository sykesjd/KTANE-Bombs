import client from '$lib/client';
import { Permission } from "$lib/types";
import type { CompletionQueueItem, MissionQueueItem, QueueItem } from '$lib/types';
import { fixPools, hasPermission, hasAnyPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async function ({ locals }) {
	if (!hasAnyPermission(locals.user, Permission.VerifyMission, Permission.VerifyCompletion)) {
		return {
			status: 403
		};
	}

	const queue: QueueItem[] = [];

	// Missions
	if (hasPermission(locals.user, Permission.VerifyMission)) {
		const missions = await client.mission.findMany({
			where: {
				verified: false
			},
			select: {
				id: true,
				name: true,
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
	if (hasPermission(locals.user, Permission.VerifyCompletion)) {
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

	return {
		body: JSON.stringify(queue)
	};
};
