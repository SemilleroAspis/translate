import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import Modal from 'react-modal';
import reportWebVitals from './reportWebVitals';

Modal.setAppElement('#root'); // Configurar el elemento raíz para los modales

const rootElement = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
