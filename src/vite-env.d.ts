interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    readonly VITE_ENVIRONMENT: string;
    // Thêm các biến môi trường khác nếu cần
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }