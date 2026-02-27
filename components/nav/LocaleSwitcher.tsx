'use client';

import s from './LocaleSwitcher.module.scss';
import { useLocale } from 'next-intl';
import { Link, locales } from '@/i18n/routing';
import { usePathname } from 'next/navigation';

export function LocaleSwitcher() {
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<nav className={s.locales} key={locale}>
			<ul>
				<li>
					<a href={`/api/draft?secret=99E3GxyXr9pGy1QD&slug=${pathname}`}>
						<button>Draft</button>
					</a>
					<a href={`/api/draft?secret=99E3GxyXr9pGy1QD&exit=1&slug=${pathname}`}>
						<button>Exit Draft</button>
					</a>
				</li>
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
