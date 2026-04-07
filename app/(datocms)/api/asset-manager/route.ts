//import config from '@/datocms.config';
import { buildClient, uploadLocalFileAndReturnPath } from '@datocms/cma-client-node';
import { basicAuth } from 'next-dato-utils/route-handlers';
import fs from 'fs';
import sharp from 'sharp';
import { NextResponse } from 'next/server';

const config = {
	assets: {
		maxWidth: 3000,
		maxHeight: 3000,
		maxSize: 1024 * 1024 * 5,
	},
};

const formats = ['jpg', 'jpeg', 'tiff', 'tif'];

const client = buildClient({
	apiToken: process.env.DATOCMS_API_TOKEN!,
	environment: process.env.DATOCMS_ENVIRONMENT!,
});

export const maxDuration = 60;

export async function POST(req: Request) {
	return basicAuth(req, async (req: Request) => {
		try {
			const data = (await req.json()) as WebookEvent;
			const { entity, entity_type, event_type } = data;
			if (!entity || !entity_type || !event_type)
				throw new Error('Missing entity, entity_type or event_type');
			if (entity_type !== 'upload') throw new Error('Invalid entity type: ' + entity_type);
			const { id } = entity;
			const asset = entity.attributes;
			if (!asset || !id) throw new Error('Missing asset data');

			const start = Date.now();
			const newFilePath = await resize(asset);

			if (!newFilePath)
				return NextResponse.json({
					success: true,
					message: 'Asset below limit',
					duration: Date.now() - start,
				});

			const upload = await client.uploads.update(
				id,
				{ path: newFilePath },
				{ replace_strategy: 'keep_url' },
			);

			return NextResponse.json({
				success: true,
				id,
				size: formatBytes(upload.size),
				reduction: formatBytes(asset.size - upload.size),
				newFilePath,
				duration: Date.now() - start,
			});
		} catch (error) {
			const message = typeof error === 'string' ? error : (error as Error).message;
			return NextResponse.json({ success: false, message, error: JSON.stringify(error) });
		}
	});
}

async function resize(asset: Asset): Promise<string | null> {
	const { url, filename, is_image, width, height } = asset;
	if (!is_image || filename.endsWith('.svg')) return null;

	const response = await fetch(url);
	const imageBuffer = Buffer.from(await response.arrayBuffer());
	const buffer = await sharp(imageBuffer)
		.resize({
			width: width >= height ? config.assets.maxWidth : undefined,
			height: height >= width ? config.assets.maxHeight : undefined,
		})
		.toBuffer();

	const filePath = `/tmp/${filename}`;
	fs.writeFileSync(filePath, buffer);

	const newFilePath = await uploadLocalFileAndReturnPath(client, filePath, {
		filename,
	});
	fs.rmSync(filePath);
	return newFilePath;
}

export type WebookEvent = {
	webhook_call_id: string;
	event_triggered_at: string;
	attempted_auto_retries_count: number;
	webhook_id: string;
	site_id: string;
	environment: string;
	is_environment_primary: boolean;
	entity_type: string;
	event_type: string;
	entity: {
		id: string;
		type: string;
		attributes: Asset;
		relationships: {
			creator: {
				data: {
					id: string;
					type: string;
				};
			};
			upload_collection: {
				data: any;
			};
		};
	};
	related_entities: Array<any>;
};

export type Asset = {
	size: number;
	width: number;
	height: number;
	path: string;
	format: string;
	author: any;
	notes: any;
	copyright: any;
	default_field_metadata: {
		sv: {
			alt: any;
			title: string;
			custom_data: {};
			focal_point: any;
		};
		en: {
			alt: any;
			title: any;
			custom_data: {};
			focal_point: any;
		};
	};
	is_image: boolean;
	created_at: string;
	updated_at: string;
	url: string;
	tags: Array<any>;
	filename: string;
	basename: string;
	exif_info: {};
	mime_type: string;
	colors: Array<{
		red: number;
		green: number;
		blue: number;
		alpha: number;
	}>;
	smart_tags: Array<string>;
	duration: any;
	frame_rate: any;
	mux_playback_id: any;
	blurhash: string;
	thumbhash: string;
	mux_mp4_highest_res: any;
	md5: string;
};
