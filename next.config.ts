/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
    if (isServer) {
      // cloudflare:sockets ဟာ Cloudflare Workers runtime ကနေ built-in
      // ပေးတဲ့ module ဖြစ်လို့ webpack ကို bundle မလုပ်ဖို့ external ထားရမယ်
      config.externals = [...(config.externals || []), 'cloudflare:sockets'];
    }
    return config;
  },
}

module.exports = nextConfig