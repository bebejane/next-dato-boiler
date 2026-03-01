export type SpaceProps = {
	data: SpaceRecord;
};

export default function Space({ data }: SpaceProps) {
	return (
		<div
			data-datocms-content-link-url={data._editingUrl}
			style={{
				height: `${data.height}vh`,
				width: '100%',
			}}
		/>
	);
}
