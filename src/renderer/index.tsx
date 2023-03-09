import { createRoot } from 'react-dom/client';
import App from './App';
import 'react-toastify/dist/ReactToastify.css';

import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import React from 'react';

Bugsnag.start({
  apiKey: '6cd4815af1900f7dc947cecfaf8e965f',
  plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = Bugsnag.getPlugin('react')!.createErrorBoundary(React);

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
