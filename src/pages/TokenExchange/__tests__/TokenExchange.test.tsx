import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { verifyMockExecution as verifyLoginMockExecution } from '../../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import '../../../locale';
import TokenExchange from '../TokenExchange';
import { createStore } from './../../../redux/store';

vi.mock('@pagopa/selfcare-common-frontend/lib/decorators/withLogin', () =>
  import('../../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin')
);


beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation(
    vi.fn(() =>
      Promise.resolve({
        status: 200,
        ok: true,
        json: () => Promise.resolve('https://backofficeURL.it/ui#id=jwtToken'),
      })
    ) as any
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});


const renderApp = (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore || createStore();
  render(
    <Provider store={store}>
      <MemoryRouter>
        <TokenExchange />
      </MemoryRouter>
    </Provider>
  );
  return { store };
};

describe('Token Exchange', function () {
  test('renders the landing page', async () => {
    let store;
    const url = 'http://dummy.com/token-exchange?institutionId=123&productId=prod-xxx';

    Object.defineProperty(window, 'location', {
      value: new URL(url),
    });

    await waitFor(() => ({ store } = renderApp()));
    if (store) {
      verifyLoginMockExecution(store.getState());
    }

    expect(document.getElementById('tokenExchange'));
  });

  test('Input institutionId, productId, environment', async () => {
    const url =
      'http://dummy.com/token-exchange?institutionId=123&productId=prod-xxx&environment=Collaudo';

    await waitFor(() => (window.location.href = url));
    await waitFor(() => renderApp());

    expect(window.location.href).toContain('/ui#id=jwtToken');
  });

  test('Input institutionId, productId, environment and redirectUrl', async () => {
    const url =
      'http://dummy.com/token-exchange?institutionId=123&productId=prod-xxx&environment=Collaudo&redirectUrl=cod42';

    await waitFor(() => (window.location.href = url));
    await waitFor(() => renderApp());

    expect(window.location.href).toContain('/ui?redirectUrl=cod42#id=jwtToken');
  });

  test('Throw error and click on back button', async () => {
    Object.defineProperty(window.location, 'assign', {
      configurable: true,
      value: vi.fn(),
    });
    global.fetch = vi.fn(() =>
      Promise.resolve({
        status: 500,
        ok: false,
      })
    ) as any;

    const url =
      'http://dummy.com/token-exchange?institutionId=123&productId=prod-xxx&environment=Collaudo&redirectUrl=cod42';
    await waitFor(() => (window.location.href = url));
    await waitFor(() => renderApp());

    const goHomeBtn = await screen.findByTestId('go-home-btn-test');
    expect(goHomeBtn).toBeInTheDocument();

    fireEvent.click(goHomeBtn);
    expect(window.location.assign).toBeCalledWith('http://selfcare/auth/logout');
  });
});
