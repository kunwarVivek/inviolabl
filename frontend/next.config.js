/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        domains: ["avataaars.io", "static.alchemyapi.io"],
    },
}

module.exports = nextConfig
