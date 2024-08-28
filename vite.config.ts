import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";

export default defineConfig(({ command, mode }) => {
    // Load environment variables from .env file based on the current mode (e.g., development, production)
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [react(), glsl()],
        server: {
            proxy: {
                // Proxy requests from /api to the backend URL specified in the environment variables
                "/dunce": {
                    //target: "http://localhost:8125",
                    target: "https://api.skillstorm-congo.com",
                    changeOrigin: true,
                    rewrite: (path) => path.replace(/^\/dunce/, "")
                }
            }
        }
        // types: {
        //     compilerOptions: {
        //         types: ["vite-plugin-glsl/ext"]
        //     }
        // }
        // Define global constants that will be replaced during the build process
        // define: {
        //     // Define __APP_ENV__ as a global constant with the value of env.APP_ENV
        //     __APP_ENV__: JSON.stringify(env.APP_ENV)
        // }
    };
});
