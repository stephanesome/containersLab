export const environment = {
  production: false,
  API_Url: (window as { [key: string]: any })["env"]["API_Url"] || "default/"
};
