import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia/theme';
import '@pagopa/selfcare-common-frontend/index.css';
import { CONFIG } from '@pagopa/selfcare-common-frontend/lib/config/env';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './consentAndAnalyticsConfiguration.ts';
import './locale';
import { store } from './redux/store';
import { MOCK_USER } from './utils/constants';
import { ENV } from './utils/env';

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
        <BrowserRouter basename="/token-exchange">
          <CssBaseline />
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
