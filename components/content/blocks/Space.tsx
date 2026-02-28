export type SpaceProps = {
	data: SpaceRecord;
};

export default function Space({ data }: SpaceProps) {
	const insideIframe = typeof window !== 'undefined' && window.parent !== window;
	console.log({ insideIframe });
	return (
		<div
			data-datocms-content-link-source={data.id}
			style={{
				height: `${data.height}vh`,
				width: '100%',
				backgroundColor: insideIframe ? 'rgba(0,0,0,0.4)' : 'transparent',
			}}
		/>
	);
}
