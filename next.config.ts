import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		reactCompiler: true
	},
	typescript: {
		tsconfigPath: "./tsconfig.json"
	},
	images: {
		formats: ["image/webp", "image/avif"]
	},
	compiler: {
		removeConsole: process.env.NODE_ENV === "production"
	}
}

export default nextConfig
