import { Select } from '@/components/form/Select';

export default async function Test({ params }: PageProps<'/[locale]/test'>) {
	const items = [
		{ label: 'Baseball', value: 'baseball' },
		{ label: 'Basketball', value: 'basketball' },
		{ label: 'Football', value: 'football' },
		{ label: 'Hockey', value: 'hockey' },
		{ label: 'Soccer', value: 'soccer' },
	];
	return (
		<>
			<article>
				<Select items={items} multiple={false} />
			</article>
		</>
	);
}
