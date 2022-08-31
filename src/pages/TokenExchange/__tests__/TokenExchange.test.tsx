import { render, screen } from '@testing-library/react';
import TokenExchange from '../TokenExchange';
import '../../../locale';
import { createStore } from './../../../redux/store';
import { verifyMockExecution as verifyLoginMockExecution } from '../../../__mocks__/@pagopa/selfcare-common-frontend/decorators/withLogin';
import { Provider } from 'react-redux';

jest.mock('@pagopa/selfcare-common-frontend/decorators/withLogin');

const renderApp = (injectedStore?: ReturnType<typeof createStore>) => {
  const store = injectedStore ? injectedStore : createStore();
  render(
    <Provider store={store}>
      <TokenExchange />
    </Provider>
  );
  return { store };
};

test('renders the landing page', () => {
  const { store } = renderApp();
  verifyLoginMockExecution(store.getState());

  expect(screen.getByText('Token Exchange')).toBeVisible();
});
