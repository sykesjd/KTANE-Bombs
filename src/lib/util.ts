import type * as client from '@prisma/client';
import type { Bomb, FrontendUser, Permission, Pool } from './types';

export function formatTime(time: number): string {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor(time / 60) - 60 * hours;
	const seconds = time - 3600 * hours - 60 * minutes;
	return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function parseTime(time: string): number | null {
	const match = time.match(
		/^(?:(?<hours>\d+:)?(?<minutes>\d{1,2}:))?(?<seconds>\d{1,2}(?:.\d{1,2})?)$/
	);
	if (match === null) {
		return null;
	}

	const groups = match.groups;
	const minutes = parseInt(groups.minutes ?? '0');
	const seconds = parseFloat(groups.seconds);
	if (minutes >= 60 || seconds >= 60) {
		return null;
	}

	return parseInt(groups.hours ?? '0') * 3600 + minutes * 60 + seconds;
}

export function pluralize(value: number, singular: string): string {
	return `${value} ${value == 1 ? singular : singular + 's'}`;
}

export function hasPermission(user: FrontendUser, permission: Permission): boolean {
	return user !== null && user.permissions.includes(permission);
}

export function hasAnyPermission(user: FrontendUser, ...permissions: Permission[]): boolean {
	return permissions.some((permission) => hasPermission(user, permission));
}

export function fixPools<T>(mission: T & { bombs: client.Bomb[] }): T & { bombs: Bomb[] } {
	return {
		...mission,
		bombs: mission.bombs.map((bomb) => {
			return {
				...bomb,
				pools: (bomb.pools as unknown) as Pool[]
			};
		})
	};
}
