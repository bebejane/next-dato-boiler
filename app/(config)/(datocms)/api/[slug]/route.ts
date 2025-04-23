import { datoCmsRouteHandler } from 'next-dato-utils/config'
export const dynamic = "force-dynamic"
export const GET = async (req: Request, params: any) => datoCmsRouteHandler(req, params)
export const POST = async (req: Request, params: any) => datoCmsRouteHandler(req, params)