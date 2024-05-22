/// <reference types="vite/client" />
interface ImportMetaEnv extends Readonly<Record<string, string>>{
    readonly VITE_REACT_URL: string;
    //readonly VITE_BACKEND_URL: string;
    // Add other environment variables here...
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }