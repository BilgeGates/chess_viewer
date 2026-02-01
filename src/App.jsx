import Navbar from './components/layouts/Navbar';
import Routes from './routes/Router';
import { ErrorBoundary } from './components/UI';
import { ThemeSettingsProvider } from './contexts';

const App = () => {
  return (
    <ErrorBoundary>
      <ThemeSettingsProvider>
        <div className="min-h-screen bg-gray-900 antialiased">
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" tabIndex={-1}>
            <Routes />
          </main>
        </div>
      </ThemeSettingsProvider>
    </ErrorBoundary>
  );
};

export default App;
