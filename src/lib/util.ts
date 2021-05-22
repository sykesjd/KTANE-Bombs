import { ChallengeBomb, Pool } from './types';

export function getSlug(bomb: ChallengeBomb): string {
	return bomb.Name.toLowerCase().replace(/[ /]/g, '-');
}

export function formatTime(time: number): string {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor(time / 60) - 60 * hours;
	const seconds = time - 3600 * hours - 60 * minutes;
	return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getPools(bomb: ChallengeBomb): Pool[] {
	return bomb.Pools.map((pool) => {
		const match = pool.match(/\[(.+)\] (?:\(.+\) )?Count: (\d+)/);
		if (match === null) console.error(pool);

		return new Pool(match[1].split(', '), parseInt(match[2]));
	});
}
