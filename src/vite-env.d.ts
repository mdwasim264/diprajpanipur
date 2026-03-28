/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET_PRODUCTS: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET_CATEGORIES: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET_BANNERS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}