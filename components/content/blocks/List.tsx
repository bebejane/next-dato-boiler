import s from './List.module.scss';
import Content from '@/components/content/Content';
import { stripStega } from '@datocms/content-link';

export type ListProps = {
	data: ListRecord;
};

export default function List({ data }: ListProps) {
	return (
		<div
			className={s.list}
			data-datocms-content-link-group
			data-datocms-content-link-source={data.title}
		>
			{data.title && <h3 className={s.title}>{data.title}</h3>}
			<ul className={s.list}>
				{data.items.map((item, i) => (
					<li key={i}>
						<div className={s.label}>{item.label}</div>
						<div className={s.value}>{item.value}</div>
						<div className={s.content}>
							<Content content={item.content} />
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}
