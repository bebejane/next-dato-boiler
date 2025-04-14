import { datoCmsApiRoutes } from '@datocms-config'
export const runtime = "edge"
export const dynamic = "force-dynamic"
export const GET = async (req: Request, params) => datoCmsApiRoutes(req, params)
export const POST = async (req: Request, params) => datoCmsApiRoutes(req, params)