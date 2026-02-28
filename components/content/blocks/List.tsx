import Content from '@/components/content/Content';
import s from './List.module.scss';
import Link from 'next/link';
import { Image } from 'react-datocms';

export type ListProps = {
	data: ListRecord;
};

export default function List({ data }: ListProps) {
	return (
		<>
			{data.title && <h3 className={s.title}>{data.title}</h3>}
			<ul className={s.list}>
				{data.items.map((item, i) => (
					<li key={i} data-datocms-content-link-group>
						<div className={s.label}>{item.label}</div>
						<div className={s.value}>{item.value}</div>
						<div className={s.content}>
							<Content content={item.content} />
						</div>
					</li>
				))}
			</ul>
		</>
	);
}
