import client from '$lib/client';
import { MissionQueueItem, Permission, QueueItem } from '$lib/types';
import { fixPools, hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async function ({ locals }) {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		return {
			status: 403
		};
	}

	const queue: QueueItem[] = [];

	const missions = await client.mission.findMany({
		where: {
			verified: false
		},
		select: {
			id: true,
			name: true,
			bombs: true
		}
	});

	queue.push(
		...missions.map((mission) => {
			return {
				type: 'mission',
				mission: {
					...fixPools(mission),
					completions: []
				}
			} as MissionQueueItem;
		})
	);

	return {
		body: JSON.stringify(queue)
	};
};
