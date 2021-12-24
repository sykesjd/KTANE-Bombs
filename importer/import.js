import { readFileSync } from 'fs';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

(async function () {
	const client = new PrismaClient();

	const missions = JSON.parse(readFileSync('bombs.json').toString());
	for (const mission of missions) {
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
	}
})();
