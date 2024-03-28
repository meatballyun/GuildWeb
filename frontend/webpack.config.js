module.exports = {
	module: {
		rules: [
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack'],
			},
		],
	},
	devServer: {
		proxy: [
		  {
			context: ['/api'],
			target: 'http://localhost:3010/api',
			changeOrigin: true,
		  },
		],
	  },
}