export function formatTime(time: number): string {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor(time / 60) - 60 * hours;
	const seconds = time - 3600 * hours - 60 * minutes;
	return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function pluralize(value: number, singular: string): string {
	return `${value} ${value == 1 ? singular : singular + 's'}`;
}
