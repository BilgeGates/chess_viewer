import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * ErrorFallback component displayed when an error is caught
 */
const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[400px] flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 to-gray-950 rounded-xl border border-red-500/30"
    >
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 rounded-full mb-4">
          <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">
          Something went wrong
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          An unexpected error occurred. The application encountered a problem
          and couldn't continue.
        </p>

        {error?.message && (
          <div className="bg-gray-800/50 rounded-lg p-3 mb-6 text-left">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
              Error Details
            </p>
            <code className="text-red-400 text-sm break-all">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            aria-label="Try again to recover from error"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Try Again
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            aria-label="Return to home page"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
};

/**
 * ErrorBoundary class component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional onError callback
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });

    // Call optional onReset callback
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      // Render custom fallback if provided, otherwise use default
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.props.FallbackComponent) {
        const FallbackComponent = this.props.FallbackComponent;
        return (
          <FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary, ErrorFallback };
export default ErrorBoundary;
