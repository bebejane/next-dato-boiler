import s from './page.module.scss';
import { getDatoCmsConfig } from 'next-dato-utils/config';

export default async function Home() {
	const config = await getDatoCmsConfig();

	return (
		<>
			<div className={s.page}>
				<p>Broiler</p>
				<p style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(config, null, 2)}</p>
			</div>
		</>
	);
}
