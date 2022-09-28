import client from '$lib/client';
import { getData } from '$lib/repo';
import { Completion, Permission, type ID } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';
import type { EditMission } from './_types';

export async function load({ params, locals }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return forbidden(locals);
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
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return {
			status: 404
		};
	}

	const packs = await client.missionPack.findMany({
		select: {
			name: true
		}
	});

	if (!missionResult.verified && !hasPermission(locals.user, Permission.VerifyMission)) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return forbidden(locals);
	}

	return {
		mission: missionResult,
		packs,
		modules: await getData()
	};
}

export async function POST({ locals, request }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return forbidden(locals);
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

	throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
	return {
		status: 200
	};
}

export async function DELETE({ locals, request }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyCompletion)) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return forbidden(locals);
	}

	const completion: ID<Completion> = await request.json();

	await client.completion.delete({
		where: {
			id: completion.id
		}
	});

	throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
	return {
		status: 200
	};
}
