import '@pagopa/selfcare-common-frontend/lib/common-polyfill';
import '@pagopa/selfcare-common-frontend/index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia/dist/theme/theme';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { store } from './redux/store';
import { MOCK_USER } from './utils/constants';
import { ENV } from './utils/env';
import './locale';
import './consentAndAnalyticsConfiguration.ts';

const onSuccessEncoded = encodeURIComponent(location.pathname + location.search);

// eslint-disable-next-line functional/immutable-data
CONFIG.MOCKS.MOCK_USER = MOCK_USER;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGIN = `${ENV.URL_FE.LOGIN}?onSuccess=` + onSuccessEncoded;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.LOGOUT = ENV.URL_FE.LOGOUT;
// eslint-disable-next-line functional/immutable-data
CONFIG.URL_FE.ASSISTANCE = '/assistance';


const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
