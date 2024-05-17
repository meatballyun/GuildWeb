import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Pages from './pages';
import './styles/index.css';
import { worker } from './mocks/browser';

if (
  process.env.NODE_ENV === 'development' &&
  process.env.REACT_APP_MOCK_API === 'msw'
) {
  worker.start();
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Pages />
    </BrowserRouter>
  </React.StrictMode>
);
