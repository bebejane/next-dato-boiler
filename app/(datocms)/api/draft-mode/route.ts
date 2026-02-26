export const dynamic = 'force-dynamic';
import config from '@/datocms.config';
import { draft } from 'next-dato-utils/route-handlers';

export const GET = async (req: Request, params: any) => {
	return draft(req, params);
};
