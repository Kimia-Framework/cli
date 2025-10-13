import { AppMetaData } from "@kimia-framework/core/interfaces";
import { config } from "@kimia-framework/core/helpers";

export const appMetaData: AppMetaData = {
  name: "_app_name_",
  version: "0.1",
  buildNumber: 1,
  supportedLanguages: ["_locale_"],
  logo: {
    favicon: "favicon.png",
    small: "logo.png",
    medium: "logo.png",
    large: "logo.png",
  },
  title: {
    _locale_: "_app_title_",
    en: "_app_title_",
  },
  swagger: {
    path: "/api-docs",
    enabled: () => config<boolean>("DEBUG_MODE") === true,
  },
};
