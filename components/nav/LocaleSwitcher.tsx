'use client';

import s from './LocaleSwitcher.module.scss';
import { useLocale } from 'next-intl';
import { Link, locales } from '@/i18n/routing';
import { usePathname, useRouter } from 'next/navigation';
import { useContentLink } from 'react-datocms';
import { useEffect, useState } from 'react';

export function LocaleSwitcher({ draft }: { draft: boolean }) {
	const locale = useLocale();
	const pathname = usePathname();
	const router = useRouter();
	const isDev = process.env.NODE_ENV === 'development';
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	if (!mounted) return null;

	return (
		<nav className={s.locales} key={locale}>
			<ul>
				<li>
					<a href={`/api/draft?secret=99E3GxyXr9pGy1QD&slug=${pathname}${draft ? '&exit=1' : ''}`}>
						<button aria-pressed={draft}>Draft</button>
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
