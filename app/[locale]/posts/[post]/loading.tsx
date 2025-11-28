import s from './loading.module.scss';

export default async function Loading() {
	return (
		<div className={s.loading}>
			<span>Loading...</span>
		</div>
	);
}
