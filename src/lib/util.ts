import type { Mission } from './types';

export function getSlug(bomb: Mission): string {
	return getSlugValue(bomb.name);
}

export function getSlugValue(value: string): string {
	return value.toLowerCase().replace(/[ /]/g, '-');
}

export function formatTime(time: number): string {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor(time / 60) - 60 * hours;
	const seconds = time - 3600 * hours - 60 * minutes;
	return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function pluralize(value: number, singular: string): string {
	return `${value} ${value == 1 ? singular : singular + 's'}`;
}
