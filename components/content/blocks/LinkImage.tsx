import s from './LinkImage.module.scss';
import Link from 'next/link';
import { Image } from 'react-datocms';

export type LinkImageProps = {
	data: LinkImageRecord;
};

export default function LinkImage({ data }: any) {
	if (!data?.url) return null;
	return (
		<Link href={data.url} className={s.image} data-datocms-content-link-boundary>
			{data.image.responsiveImage && <Image data={data.image.responsiveImage} />}
		</Link>
	);
}
