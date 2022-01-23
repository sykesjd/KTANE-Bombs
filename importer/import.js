import { readFileSync } from 'fs';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

(async function () {
	const client = new PrismaClient();

	const packs = JSON.parse(readFileSync('bombs.json').toString());
	for (const pack of packs) {
		for (const mission of pack.missions) {
			const existingMission = await client.mission.findFirst({
				where: {
					name: mission.name
				}
			});

			if (existingMission === null) {
				await client.mission.create({
					data: {
						name: mission.name,
						bombs: {
							create: mission.bombs
						},
						completions: {
							create: mission.completions
						}
					}
				});
			} else {
				await client.mission.update({
					where: {
						name: mission.name,
					},
					data: {
						tpSolve: mission.tpsolve,
					}
				})
			}
		}
	}
})();
