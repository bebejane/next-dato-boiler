export type SpaceProps = {
	data: SpaceRecord;
};

export default function Space({ data }: SpaceProps) {
	const insideIframe = typeof window === 'undefined' || window.parent !== window;
	console.log({ insideIframe });
	return (
		<>
			<div
				style={{ height: `${data.height}vh`, width: '100%' }}
				data-datocms-content-link-source={data.id}
			/>
		</>
	);
}
