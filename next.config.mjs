/** @type {import('next').NextConfig} */
const nextConfig = {
	sassOptions: {
		includePaths: ["./components", "./pages"],
		prependData: `
    	@use "sass:math";
    	@import "./styles/mediaqueries"; 
    	@import "./styles/fonts";
  	`,
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	devIndicators: {
		buildActivity: false,
	},
	webpack: (config, ctx) => {
		config.module.rules.push({
			test: /\.(graphql|gql)$/,
			exclude: /node_modules/,
			loader: "graphql-tag/loader",
		});
		return config;
	},
	async headers() {
		return [
			{
				source: "/api/web-previews",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
					{ key: "Access-Control-Allow-Methods", value: "POST,OPTIONS" },
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
					},
				],
			},
			{
				source: "/api/backup",
				headers: [
					{ key: "Access-Control-Allow-Credentials", value: "true" },
					{ key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
					{ key: "Access-Control-Allow-Methods", value: "POST,OPTIONS" },
					{
						key: "Access-Control-Allow-Headers",
						value:
							"X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
					},
				],
			},
		];
	},
};

export default nextConfig;
