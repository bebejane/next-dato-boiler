'use client';

import s from './LocaleSwitcher.module.scss';
import { useLocale } from 'next-intl';
import { Link, locales } from '@/i18n/routing';

export function LocaleSwitcher() {
	const locale = useLocale();
	return (
		<nav className={s.locales}>
			<ul>
				{locales.map((l) => (
					<li key={l} className={locale === l ? s.selected : undefined}>
						<Link href={'/'} locale={l}>
							{l}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
