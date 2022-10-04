import client from '$lib/client';
import { getData } from '$lib/repo';
import { Completion, Permission, type ID } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';
import type { EditMission } from './_types';
import {redirect, error} from '@sveltejs/kit'

export async function load({ params, locals }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		throw forbidden(locals);
	}

	const { mission } = params;
	const missionResult = await client.mission.findFirst({
		where: {
			name: mission
		},
		select: {
			id: true,
			name: true,
			authors: true,
			verified: true,
			bombs: true,
			completions: {
				where: {
					verified: true
				},
				select: client.$exclude('completion', ['missionId'])
			},
			tpSolve: true,
			factory: true,
			variant: true,
			missionPack: {
				select: {
					name: true,
					steamId: true
				}
			}
		}
	});

	if (missionResult === null) {
		throw error(404, "Mission not found.")
	}

	const packs = await client.missionPack.findMany({
		select: {
			name: true
		}
	});

	if (!missionResult.verified && !hasPermission(locals.user, Permission.VerifyMission)) {
		throw forbidden(locals);
	}

	return {
		mission: missionResult,
		packs,
		modules: await getData()
	};
}

/** @type {import('./$types').Actions} */
export const actions = {
	deleteMission : async ({locals, request}) => {
		if (!hasPermission(locals.user, Permission.VerifyMission)) {
			throw forbidden(locals);
		}
		const fData = await request.formData();
		const mission = JSON.parse(fData.get('mission'))
	
		await client.mission.delete({
			where: {
				name: mission.name
			}})
			
		throw redirect(303, "/")
	},
	deleteCompletion : async ({locals, request}) => {
		if (!hasPermission(locals.user, Permission.VerifyCompletion)) {
			throw forbidden(locals);
		}
		const fData = await request.formData();
		const completion: ID<Completion> = JSON.parse(fData.get('completion'));
	
		await client.completion.delete({
			where: {
				id: completion.id
			}
		});
		
		return {}
		
	},
	editMission : async ({locals, request}) => {
		if (!hasPermission(locals.user, Permission.VerifyMission)) {
			throw forbidden(locals);
		}
	
		const fData = await request.formData();
		const mission:EditMission = JSON.parse(fData.get('mission'))
	
		await client.mission.update({
			where: {
				id: mission.id
			},
			data: {
				completions: {
					update: mission.completions.map((completion) => ({
						where: {
							id: completion.id
						},
						data: completion
					}))
				},
				factory: mission.factory,
				missionPackId: mission.missionPack.id,
				name: mission.name,
				tpSolve: mission.tpSolve
			}
		});
		
		throw redirect(303, "/mission/" + mission.name)
	}
}

export async function POST({ locals, request }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		throw forbidden(locals);
	}

	const mission: EditMission = await request.json();

	await client.mission.update({
		where: {
			id: mission.id
		},
		data: {
			completions: {
				update: mission.completions.map((completion) => ({
					where: {
						id: completion.id
					},
					data: completion
				}))
			},
			factory: mission.factory,
			missionPackId: mission.missionPack.id,
			name: mission.name,
			tpSolve: mission.tpSolve
		}
	});

	return new Response(undefined)
}

export async function DELETE({ locals, request }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyCompletion)) {
		throw forbidden(locals);
	}

	const completion: ID<Completion> = await request.json();

	await client.completion.delete({
		where: {
			id: completion.id
		}
	});

	return new Response(undefined)
}
