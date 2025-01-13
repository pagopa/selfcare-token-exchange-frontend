import { ErrorBoundary, LoadingOverlay } from '@pagopa/selfcare-common-frontend/lib';
import UnloadEventHandler from '@pagopa/selfcare-common-frontend/lib/components/UnloadEventHandler';
import Layout from './components/Layout/Layout';
import TokenExchange from './pages/TokenExchange/TokenExchange';

const App = () => (
  <ErrorBoundary>
    <Layout>
      <LoadingOverlay />
      <UnloadEventHandler />
      <TokenExchange />
    </Layout>
  </ErrorBoundary>
);

export default App;
