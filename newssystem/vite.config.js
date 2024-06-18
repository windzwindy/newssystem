import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
// import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';

// https://vitejs.dev/config/
// https://github.com/vitejs/vite/issues/14102#issuecomment-1678411399
export default defineConfig({
    plugins: [react()],
    server: {
        // 反向代理
        proxy: {
            // 向 api 转发时则转发到 maoyan 网站请求
            '/api': {
                target: 'https://i.maoyan.com',
                changeOrigin: true,
                secure: false,
            },
        },
    },
})
