import client from '$lib/client';
import type { Completion } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export async function post({
	body
}: ServerRequest<
	unknown,
	{ completion: Completion; missionName: string }
>): Promise<EndpointOutput> {
	const { completion, missionName } = body;

	const mission = await client.mission.findFirst({
		where: { name: missionName },
		select: {
			id: true
		}
	});

	if (mission === undefined) {
		return {
			status: 406
		};
	}

	await client.completion.create({
		data: {
			...completion,
			mission: {
				connect: {
					id: mission.id
				}
			},
			first: false, // This will be set to the correct value once the completion is verified.
			verified: false
		}
	});

	return {
		status: 200
	};
}
