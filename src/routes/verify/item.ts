import client from '$lib/client';
import { FrontendUser, Permission, QueueItem } from '$lib/types';
import { hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler<
	Record<string, FrontendUser>,
	{ accept: boolean; item: QueueItem }
> = async function ({ locals, body }) {
	const { accept, item } = body;
	switch (item.type) {
		case 'mission':
			if (!hasPermission(locals.user, Permission.VerifyMission)) {
				return {
					status: 403
				};
			}

			if (accept) {
				client.mission.update({
					where: {
						id: item.mission.id
					},
					data: {
						verified: true
					}
				});
			} else {
				client.bomb.deleteMany({ where: { missionId: item.mission.id } });
				client.mission.delete({ where: { id: item.mission.id } });
			}

			break;
	}
};
