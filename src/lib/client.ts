// Fix for `npm run build` not working.
// See: https://github.com/prisma/prisma/pull/4920#issuecomment-927334909
import pkg from '@prisma/client';
import { withExclude } from 'prisma-exclude';

let client: pkg.PrismaClient;

if (process.env.NODE_ENV === 'production') {
	const { PrismaClient: PrismaClientProd } = pkg;
	client = new PrismaClientProd();
} else {
	client = new pkg.PrismaClient();
}

export default withExclude(client);
