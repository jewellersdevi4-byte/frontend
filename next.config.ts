import type {NextConfig} from 'next';
const config:NextConfig={distDir:process.env.NEXT_DIST_DIR||'.next',async rewrites(){return [{source:'/api/:path*',destination:(process.env.API_INTERNAL_URL||(process.env.NODE_ENV==='production'?'https://backend.devijewellers.in':'http://127.0.0.1:4102'))+'/api/:path*'}];},poweredByHeader:false};export default config;
