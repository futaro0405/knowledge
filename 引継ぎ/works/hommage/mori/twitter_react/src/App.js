import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { TwitterProvider } from './providers/TwitterProvider';
import { Router } from './router/Router';

function App() {
  return (
    <TwitterProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </TwitterProvider>
  );
}

export default App;
