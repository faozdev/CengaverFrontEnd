import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Import the App component
import { BrowserRouter } from 'react-router-dom';

const API_BASE_URL = 'https://localhost:7266';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

export default API_BASE_URL;
