import client from '$lib/client';
import { Permission } from '$lib/types';
import type { QueueItem } from '$lib/types';
import { hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const post: RequestHandler = async function ({ locals, request }) {
	const { accept, item }: { accept: boolean; item: QueueItem } = await request.json();
	switch (item.type) {
		case 'mission':
			if (!hasPermission(locals.user, Permission.VerifyMission)) {
				return {
					status: 403
				};
			}

			if (accept) {
				await client.mission.update({
					where: {
						id: item.mission.id
					},
					data: {
						verified: true
					}
				});
			} else {
				await client.bomb.deleteMany({ where: { missionId: item.mission.id } });
				await client.mission.delete({ where: { id: item.mission.id } });
			}

			break;
		case 'completion':
			if (!hasPermission(locals.user, Permission.VerifyCompletion)) {
				return {
					status: 403
				};
			}

			if (accept) {
				const first =
					(await client.completion.findFirst({
						where: {
							missionId: item.mission.id,
							verified: true,
							first: true
						}
					})) === null;

				await client.completion.update({
					where: {
						id: item.completion.id
					},
					data: {
						verified: true,
						first
					}
				});
			} else {
				client.completion.delete({ where: { id: item.completion.id } });
			}

			break;
	}

	return { status: 200 };
};
