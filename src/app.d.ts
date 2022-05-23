/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		user: import('$lib/types').FrontendUser | null;
	}

	// interface Platform {}

	interface Session {
		user: import('$lib/types').FrontendUser | null;
	}

	// interface Stuff {}
}
