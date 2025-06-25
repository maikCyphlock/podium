/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitar React Strict Mode
  reactStrictMode: true,
  
  // Configuración de imágenes
  images: {
    domains: [
      'localhost',
      'podium-app.vercel.app',
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Headers de seguridad
  async headers() {
    return [
      {
        // Aplicar estos encabezados a todas las rutas de la API
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { 
            key: 'Access-Control-Allow-Methods', 
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' 
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization',
          },
        ],
      },
    ];
  },
  
  // Configuración de redireccionamiento
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },
  
  // Configuración de reescritura (rewrites)
  async rewrites() {
    return [
      // Reescritura para compatibilidad con API externas si es necesario
    ];
  },
  
  // Configuración de webpack
  webpack: (config, { isServer }) => {
    // Configuraciones personalizadas de webpack
    
    // Soporte para archivos SVG como componentes de React
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    // Soporte para archivos de carga
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        module: false,
        net: false,
        dns: false,
        child_process: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Configuración experimental
  experimental: {
    // Habilita la compresión Brotli
    // (útil para reducir el tamaño de los activos estáticos)
    // brotliSize: true,
    
    // Mejora el rendimiento de carga de fuentes
    optimizeFonts: true,
    
    // Habilita la carga de módulos ES para paquetes externos
    esmExternals: true,
    
    // Mejora el rendimiento de la compilación
    // incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
  },
  
  // Configuración de compresión
  compress: true,
  
  // Configuración de TypeScript
  typescript: {
    // Habilita la verificación de tipos en producción
    ignoreBuildErrors: false,
  },
  
  // Configuración de ESLint
  eslint: {
    // Ejecuta ESLint durante la compilación en producción
    ignoreDuringBuilds: false,
  },
  
  // Configuración de salida estática
  output: 'standalone',
};

module.exports = nextConfig;
