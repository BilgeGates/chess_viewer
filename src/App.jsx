import Navbar from './components/layouts/Navbar';
import Routes from './routes/Router';
import { ErrorBoundary } from './components/UI';

const App = () => {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900">
        <Navbar />
        <Routes />
      </div>
    </ErrorBoundary>
  );
};

export default App;
