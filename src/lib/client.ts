// Fix for `npm run build` not working.
// See: https://github.com/prisma/prisma/pull/4920#issuecomment-927334909
import pkg, { PrismaClient } from '@prisma/client';

let client;

if (process.env.NODE_ENV === 'production') {
	const { PrismaClient: PrismaClientProd } = pkg;
	client = new PrismaClientProd();
} else {
	client = new PrismaClient();
}

export default client;
