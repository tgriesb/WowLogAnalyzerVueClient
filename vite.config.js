import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  // Log the loaded environment variable for debugging
  console.log('API_PROXY_TARGET:', env.BASE_API_URL);

  return defineConfig({
    plugins: [vue()],
    server: {
      proxy: {
        '/api': {
            target: env.BASE_API_URL, // The backend server address
            changeOrigin: true, // Needed for virtual hosted sites
          },
      },
    },
  });
};