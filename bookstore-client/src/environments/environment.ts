export const environment = {
  production: true,
  API_Url: (window as { [key: string]: any })["env"]["API_Url"] || "default/"
};
