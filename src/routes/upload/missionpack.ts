import client from '$lib/client';
import type { MissionPack } from '$lib/types';
import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';

export async function post({ request }: RequestEvent): Promise<RequestHandlerOutput> {
	const pack: MissionPack = await request.json();
	await client.missionPack.create({
		data: {
			...pack,
			verified: false
		}
	});

	return {
		status: 200
	};
}
