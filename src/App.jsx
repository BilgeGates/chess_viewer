import Navbar from './components/layouts/Navbar';
import Routes from './routes/Router';
import { ErrorBoundary } from './components/UI';
import { ThemeSettingsProvider } from './contexts';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeSettingsProvider>
        <div className="min-h-screen bg-gray-900">
          <Navbar />
          <Routes />
        </div>
      </ThemeSettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
