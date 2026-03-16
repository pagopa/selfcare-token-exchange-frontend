

const PUBLIC_URL_INNER: string = import.meta.env.BASE_URL;
export const ENV = {
  ENV: import.meta.env.VITE_ENV,
  PUBLIC_URL: PUBLIC_URL_INNER ? PUBLIC_URL_INNER : '/token-exchange',

  ASSISTANCE: {
    ENABLE: import.meta.env.VITE_ENABLE_ASSISTANCE,
    EMAIL: import.meta.env.VITE_PAGOPA_HELP_EMAIL,
  },

  URL_FE: {
    LOGIN: import.meta.env.VITE_URL_FE_LOGIN,
    LOGOUT: import.meta.env.VITE_URL_FE_LANDING,
    DASHBOARD: import.meta.env.VITE_URL_FE_DASHBOARD,
    LANDING: import.meta.env.VITE_URL_FE_LANDING,
  },

  URL_API: {
    API_DASHBOARD: import.meta.env.VITE_URL_API_DASHBOARD,
  },

  ANALYTCS: {
    ENABLE: import.meta.env.VITE_ANALYTICS_ENABLE,
    MOCK: import.meta.env.VITE_ANALYTICS_MOCK,
    DEBUG: import.meta.env.VITE_ANALYTICS_DEBUG,
    TOKEN: import.meta.env.VITE_MIXPANEL_TOKEN,
    API_HOST: import.meta.env.VITE_MIXPANEL_API_HOST || 'https://api-eu.mixpanel.com',
  },
};
