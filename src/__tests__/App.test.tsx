import { ThemeProvider } from '@mui/material';
import { theme } from '@pagopa/mui-italia/theme';
import { userActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/userSlice';
import { render, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';
import App from '../App';
import '../locale';
import { createStore } from '../redux/store';
import { ENV } from '../utils/env';

afterEach(() => {
  vi.unstubAllGlobals();
});

test('redirects an authenticated user with the shared layout inside the basename router', async () => {
  const location = new URL(
    'http://localhost/token-exchange?institutionId=123&productId=prod-xxx&redirectUrl=cod42'
  );
  vi.stubGlobal('location', location);
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve('https://backoffice.example/ui#id=jwtToken'),
  });
  vi.stubGlobal('fetch', fetchMock);
  const store = createStore();
  store.dispatch(userActions.setLoggedUser({ uid: '123', name: 'Test', surname: 'User' }));

  render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/token-exchange">
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );

  await waitFor(() => {
    expect(location.href).toBe('https://backoffice.example/ui?redirectUrl=cod42#id=jwtToken');
  });
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining(
      `${ENV.URL_API.API_DASHBOARD}/v2/products/prod-xxx/back-office?institutionId=123`
    ),
    expect.objectContaining({ method: 'GET', credentials: 'include' })
  );
});
