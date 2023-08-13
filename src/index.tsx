import React from 'react';
import ReactDOM from 'react-dom';
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import './index.css';
import App from './App';

initializeFaro({
  url: 'https://faro-collector-prod-ap-southeast-1.grafana.net/collect/dddca6ab27d8735638120607687256c6',
  app: {
    name: 'index',
    version: '1.0.0',
    environment: 'production'
  },
  instrumentations: [
    // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
    ...getWebInstrumentations(),
  ],
});

ReactDOM.render(<App />, document.getElementById('root'));
