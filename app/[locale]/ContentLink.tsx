'use client';

import { ContentLink as DatoContentLink } from 'react-datocms';
import { useRouter, usePathname } from 'next/navigation';

export function ContentLink({ enabled }: { enabled: boolean }) {
	const router = useRouter();
	const pathname = usePathname();

	if (!enabled) return null;
	return (
		<DatoContentLink
			onNavigateTo={(path) => router.push(path)}
			currentPath={pathname}
			enableClickToEdit={{ hoverOnly: true }}
		/>
	);
}
