export const dynamic = 'force-dynamic';
import config from '@/datocms.config';
import { draft } from 'next-dato-utils/route-handlers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export const GET = async (req: NextRequest, params: any) => {
	const searchParams = new URLSearchParams(new URL(req.url).search);

	console.log(searchParams.forEach((value, key) => console.log(key, value)));
	return draft(req, req.nextUrl.searchParams);
};
