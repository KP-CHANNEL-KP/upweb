/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config: { externals: string[]; externalsType: string; }, { isServer }: any) => {
    if (isServer) {
      // cloudflare:sockets ကို webpack ကနေ bundle မလုပ်ဘဲ external
      // အနေနဲ့ ထားရမယ် — externalsType: 'commonjs' ကို ထပ်ထည့်ရမှ
      // valid JS output ဖြစ်မယ် (colon ပါတဲ့ module name ကြောင့်)
      config.externals.push('cloudflare:sockets');
      config.externalsType = 'commonjs';
    }
    return config;
  },
}

module.exports = nextConfig