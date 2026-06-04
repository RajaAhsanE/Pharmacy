import React from 'react';
import ReactDOM from 'react-dom/client';
import 'sweetalert2/dist/sweetalert2.min.css';
import './styles/app.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
