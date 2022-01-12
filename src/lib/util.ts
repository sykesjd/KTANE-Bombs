import type * as client from '@prisma/client';
import type { Bomb, FrontendUser, Permission, Pool } from './types';

export function formatTime(time: number): string {
	const hours = Math.floor(time / 3600);
	const minutes = Math.floor(time / 60) - 60 * hours;
	const seconds = time - 3600 * hours - 60 * minutes;
	return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function pluralize(value: number, singular: string): string {
	return `${value} ${value == 1 ? singular : singular + 's'}`;
}

export function hasPermission(user: FrontendUser, permission: Permission): boolean {
	return user !== null && user.permissions.includes(permission);
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
