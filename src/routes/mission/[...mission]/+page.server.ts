import client from '$lib/client';
import { getData } from '$lib/repo';
import { Permission } from '$lib/types';
import { forbidden, hasPermission } from '$lib/util';
import type { RequestHandlerOutput, RequestEvent } from '@sveltejs/kit';

export async function load({ params, locals }: RequestEvent): Promise<RequestHandlerOutput> {
	const { mission } = params;
	const missionResult = await client.mission.findFirst({
		where: {
			name: mission
		},
		select: {
			name: true,
			authors: true,
			verified: true,
			bombs: true,
			completions: {
				where: {
					verified: true
				}
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

	const variantId = missionResult.variant;
	const variants =
		variantId == null
			? null
			: await client.mission.findMany({
					where: {
						variant: variantId,
						name: { not: missionResult.name }
					},
					select: {
						name: true,
						completions: {
							where: {
								verified: true
							}
						},
						tpSolve: true
					}
			  });

	if (!missionResult.verified && !hasPermission(locals.user, Permission.VerifyMission)) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return forbidden(locals);
	}

	return {
		mission: missionResult,
		variants,
		modules: await getData()
	};
}

export async function DELETE({ locals, params }: RequestEvent): Promise<RequestHandlerOutput> {
	if (!hasPermission(locals.user, Permission.VerifyMission)) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
		return forbidden(locals);
	}

	await client.mission.delete({
		where: {
			name: params.mission
		}
	});

	throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292699)");
	return {
		status: 200
	};
}
