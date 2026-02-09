const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/hooks': path.resolve(__dirname, 'src/hooks'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/pages': path.resolve(__dirname, 'src/pages'),
      '@/routes': path.resolve(__dirname, 'src/routes'),
      '@/constants': path.resolve(__dirname, 'src/constants')
    }
  }
};
