export type RepoModule = {
	ModuleID: string;
	Name: string;
	X: number;
	Y: number;
};

let modules: RepoModule[] | null = null;

export async function getData(): Promise<RepoModule[] | null> {
	if (modules === null) {
		const repo = await fetch('https://ktane.timwi.de/json/raw');
		if (!repo.ok) return null;

		modules = (await repo.json()).KtaneModules;
	}

	return modules;
}
