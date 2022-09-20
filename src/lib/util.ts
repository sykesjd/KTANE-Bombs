import type * as client from '@prisma/client';
import type { Bomb, FrontendUser, Mission, Permission, Pool } from './types';

export function formatTime(seconds: number, milliseconds = false): string {
	let timeParts = [];

	seconds = Math.round(seconds * 100) / 100;

	for (const part of [3600, 60, 1]) {
		timeParts.push(Math.floor(seconds / part).toString());
		seconds -= Math.floor(seconds / part) * part;
	}

	timeParts = timeParts.map((value, index) => (index == 0 ? value : value.padStart(2, '0')));

	return milliseconds
		? `${timeParts.join(':')}.${Math.round(seconds * 100)
				.toString()
				.padStart(2, '0')}`
		: timeParts.join(':');
}

export function parseTime(time: string): number | null {
	const match = time.match(
		/^(?:(?<hours>\d+:)?(?<minutes>\d{1,2}:))?(?<seconds>\d{1,2}(?:.\d{1,2})?)$/
	);
	if (match === null) {
		return null;
	}

	const groups = match.groups;
	if (groups === undefined) {
		return null;
	}

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

export function listify(list: string[]): string {
	switch (list.length) {
		case 1:
			return list[0];

		case 2:
			return `${list[0]} and ${list[1]}`;

		default:
			return listify([list.slice(0, -1).join(', ') + ',', list[list.length - 1]]);
	}
}

export function hasPermission(user: FrontendUser | null, permission: Permission): boolean {
	return user !== null && user.permissions.includes(permission);
}

export function hasAnyPermission(user: FrontendUser | null, ...permissions: Permission[]): boolean {
	return permissions.some((permission) => hasPermission(user, permission));
}

export function forbidden(locals: App.Locals) {
	// If the user is not logged in, they might just need to login.
	if (locals.user === null)
		return {
			status: 302,
			redirect: '/login'
		};

	return {
		status: 403
	};
}

export function fixPools<T>(mission: T & { bombs: client.Bomb[] }): T & { bombs: Bomb[] } {
	return {
		...mission,
		bombs: mission.bombs.map((bomb) => {
			return {
				...bomb,
				pools: bomb.pools as unknown as Pool[]
			};
		})
	};
}

export function getSolveTypes(mission: Mission) {
	return {
		normalSolve: mission.completions.some((completion) => completion.team.length >= 2),
		efmSolve: mission.completions.some((completion) => completion.team.length == 1),
		soloSolve: mission.completions.some((completion) => completion.solo)
	};
}

export function parseList(value: string) {
	return value
		.split(',')
		.map((name) => name.trim())
		.filter((name) => name.length !== 0);
}

function findMatchingBrackets(str:string, searchWhat:string): number[] {
	let lPar = str.indexOf("[[");
	let lPar2 = str.indexOf("[[", lPar + 2);
	let rPar = str.indexOf("]]", lPar + 2);
	while (lPar >= 0 && lPar2 >= 0 && rPar >= 0 && lPar2 < rPar) {
		lPar2 = str.indexOf("[[", rPar + 2);
		rPar = str.indexOf("]]", rPar + 2);
	}

	return [lPar, rPar];
}

// logical operators supported: &&(and), ||(or), !!(not)
// example: thing one && aaa || bbb && !!ccc
// which means: ("thing one" and "aaa") or ("bbb" and not "ccc")
// brackets are supported too: [[ thing one || aaa ]] && [[ bbb || !!ccc ]]
export function evaluateLogicalStringSearch(expression:string, searchWhat:string): boolean {
	let expr = expression.trim();
	let exprAfter = expr;

	let br = findMatchingBrackets(expr, searchWhat);
	while (br[0] >= 0 && br[1] >= 0 && br[1] > br[0]) {		//valid parentheses found
		let stripped = exprAfter.slice(br[0] + 2, br[1]);
		let val = evaluateLogicalStringSearch(stripped, searchWhat);
		exprAfter = exprAfter.slice(0, br[0]) + (val ? " " : "!@#%^&*)(*&#@!") + exprAfter.slice(br[1] + 2);
		br = findMatchingBrackets(exprAfter, searchWhat);
	}

	let searchParamOr = exprAfter.split("||").map(x => x.trim());
	let matches = false;
	for (let oo = 0; !matches && oo < searchParamOr.length; oo++) {
		let searchParamAnd = searchParamOr[oo].split("&&").map(x => x.trim());
		matches = true;
		for (let aa = 0; matches && aa < searchParamAnd.length; aa++) {
			let notThis = searchParamAnd[aa].indexOf("!!") == 0;
			if (notThis) {
				let stripped = searchParamAnd[aa].slice(2).trim();
				if (searchWhat.includes(stripped)) {
					matches = false;
					break;
				}
			}
			else if (!searchWhat.includes(searchParamAnd[aa])) {
				matches = false;
				break;
			}
		}
	}
	return matches;
}
