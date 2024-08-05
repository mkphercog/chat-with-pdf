export const ROUTES = {
  home: {
    root: () => "/",
  },
  dashboard: {
    root: () => "/dashboard",
    uploadFile: () => "/dashboard/upload",
    pricing: () => "/dashboard/upgrade",
    fileView: (id: string) => `/dashboard/files/${id}`,
  },
};
