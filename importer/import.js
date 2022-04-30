import { readFileSync } from 'fs';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

(async function () {
	const client = new PrismaClient();

	const packs = JSON.parse(readFileSync('bombs.json').toString());
	for (const pack of packs) {
		const missionPack = await client.missionPack.upsert({
			create: {
				name: pack.name,
				author: pack.author,
				steamId: pack.steamID,
			},
			update: {
				author: pack.author,
				steamId: pack.steamID,
			},
			where: {
				name: pack.name
			}
		});

		for (const mission of pack.missions) {
			await client.mission.upsert({
				create: {
					name: mission.name,
					bombs: {
						create: mission.bombs
					},
					completions: {
						// TODO: handle completions that don't have links
						create: mission.completions.filter(completion => completion.proofs !== null)
					},
					tpSolve: mission.tpsolve,
					factory: mission.factory,
					variant: mission.variant,
					missionPackId: missionPack.id
				},
				update: {
					tpSolve: mission.tpsolve,
					factory: mission.factory,
					variant: mission.variant,
					missionPackId: missionPack.id
				},
				where: {
					name: mission.name
				}
			});
		}
	}
})();
