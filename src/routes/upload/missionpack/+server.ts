import client from '$lib/client';
import type { MissionPack } from '$lib/types';
import type { RequestEvent } from '@sveltejs/kit';

export async function POST({ request }: RequestEvent) {
	const pack: MissionPack = await request.json();
	await client.missionPack.create({
		data: {
			...pack,
			verified: false
		}
	});

	return new Response(undefined);
}
