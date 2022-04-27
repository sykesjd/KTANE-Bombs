import client from '$lib/client';
import type { Completer } from '$lib/types';
import type { EndpointOutput } from '@sveltejs/kit';

export async function get(): Promise<EndpointOutput> {
	const completions = await client.completion.findMany({
		select: {
			mission: {
				select: {
					name: true
				}
			},
			team: true
		}
	});

	const completers: { [name: string]: Completer } = {};
	const distinctSolves: { [name: string]: Set<string> } = {};
	for (const completion of completions) {
		for (const [index, name] of completion.team.entries()) {
			let completer = completers[name];
			let solves = distinctSolves[name];
			if (completer === undefined) {
				completer = {
					name,
					distinct: 0,
					defuser: 0,
					expert: 0,
					efm: 0
				};

				solves = new Set();

				completers[name] = completer;
				distinctSolves[name] = solves;
			}

			if (completion.team.length === 1) {
				completer.efm++;
			} else if (index === 0) {
				completer.defuser++;
			} else {
				completer.expert++;
			}

			if (!solves.has(completion.mission.name)) {
				solves.add(completion.mission.name);
				completer.distinct++;
			}
		}
	}

	function total(completer: Completer) {
		return completer.defuser + completer.expert + completer.efm;
	}

	const sortedCompleters = Object.values(completers);
	sortedCompleters.sort((a, b) => {
		const distinct = b.distinct - a.distinct;
		if (distinct !== 0) return distinct;
		return total(b) - total(a);
	});
	return {
		body: JSON.stringify(sortedCompleters)
	};
}
