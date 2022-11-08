import client from '$lib/client';

export async function GET() {
	const missions = await client.mission.findMany({
		where: {
			verified: true
		},
		select: {
			name: true,
			authors: true,
			bombs: true,
			tpSolve: true,
			completions: true
		}
	});
	let result = JSON.stringify(
		missions
			.map(m => {
				return {
					name: m.name,
					authors: m.authors,
					bombs: m.bombs,
					tpSolve: m.tpSolve,
					completions: m.completions.length
				};
			})
			.sort((a, b) => {
				return a.name.localeCompare(b.name);
			})
	);

	return new Response(result);
}
