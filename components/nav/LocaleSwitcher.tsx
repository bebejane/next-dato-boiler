'use client';

import s from './LocaleSwitcher.module.scss';
import { useLocale } from 'next-intl';
import { Link, locales, usePathname } from '@/i18n/routing';
import { useEffect, useState } from 'react';

export function LocaleSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;
	console.log({ locale, pathname });
	return (
		<nav className={s.locales} key={locale}>
			<ul>
				{locales.map((l, i) => (
					<li key={i} className={locale === l ? s.selected : undefined}>
						<Link href={'/'} locale={l}>
							{l}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}
