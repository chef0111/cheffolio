declare const CREATE_GB_APP_VERSION: string | undefined;

export const VERSION =
  typeof CREATE_GB_APP_VERSION === "string" ? CREATE_GB_APP_VERSION : "0.0.0";
