
import client from '$lib/client';
import { Permission } from '$lib/types';
import type { QueueItem } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async function ({ locals, request }) {
	const { accept, item }: { accept: boolean; item: QueueItem } = await request.json();
	switch (item.type) {
		case 'mission':
			if (!hasPermission(locals.user, Permission.VerifyMission)) {
				throw forbidden(locals);
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
				throw forbidden(locals);
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
				await client.completion.delete({ where: { id: item.completion.id } });
			}

			break;
		case 'missionpack':
			if (!hasPermission(locals.user, Permission.VerifyMissionPack)) {
				throw forbidden(locals);
			}
			if (accept) {
				await client.missionPack.update({
					where: {
						id: item.pack.id
					},
					data: {
						verified: true
					}
				});
			} else {
				await client.missionPack.delete({ where: { id: item.pack.id } });
			}

			break;
	}

	return new Response(undefined);
};
