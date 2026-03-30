import { buildClient, uploadLocalFileAndReturnPath } from '@datocms/cma-client-node';
import { basicAuth } from 'next-dato-utils/route-handlers';
import fs from 'fs';
import sharp from 'sharp';

const MAX_WIDTH = 3000;
const MAX_HEIGHT = 3000;
const MAX_SIZE = 1024 * 1024 * 5;

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

			let message: string = '';
			let size = asset.size;

			const { filename, is_image, width, height } = asset;

			if (!is_image || filename.endsWith('.svg')) message = 'Asset is not an image';
			else if (size <= MAX_SIZE) message = 'Asset size is below limit';
			else if (width <= MAX_WIDTH) message = 'Asset width is below limit';
			else {
				console.log('fetch image');
				const response = await fetch(asset.url);
				console.log('image to buffer');
				const imageBuffer = Buffer.from(await response.arrayBuffer());
				console.log('resize image');
				const buffer = await sharp(imageBuffer)
					.resize({
						width: width > height ? MAX_WIDTH : undefined,
						height: height > width ? MAX_HEIGHT : undefined,
					})
					.toBuffer();
				console.log('write file');
				const filePath = `/tmp/${filename}`;
				fs.writeFileSync(filePath, buffer);

				const newFilePath = await uploadLocalFileAndReturnPath(client, filePath, {
					filename,
				});
				size = buffer.byteLength;
				console.log('upload image', size);
				await client.uploads.update(id, { path: newFilePath }, { replace_strategy: 'keep_url' });
				message = 'Image resized and uploaded';
			}
			console.log('done', filename);
			return new Response(JSON.stringify({ success: true, id, message, size, filename }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			});
		} catch (error) {
			const message = (error as Error).message;
			return new Response(
				JSON.stringify({ success: false, message, error: JSON.stringify(error) }),
				{
					status: 500,
					headers: { 'content-type': 'application/json' },
				},
			);
		}
	});
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
		attributes: {
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
