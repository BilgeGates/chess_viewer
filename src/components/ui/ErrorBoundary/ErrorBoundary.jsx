import React from 'react';

import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

import { logger } from '@/utils';

/**
 * @param {Object} props
 * @returns {JSX.Element}
 */
function ErrorFallback(props) {
  const { error, resetErrorBoundary } = props;
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="h-full max-h-full overflow-hidden flex items-center justify-center p-8 bg-bg animate-fadeIn"
    >
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-error/20 to-error/10 rounded-2xl mb-6">
          <AlertTriangle className="w-10 h-10 text-error" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-display font-bold text-text-primary mb-3">
          Something went wrong
        </h2>

        <p className="text-text-secondary text-base mb-8 leading-relaxed">
          An unexpected error occurred. The application encountered a problem
          and couldn't continue.
        </p>

        {error?.message && (
          <div className="glass-card rounded-xl p-5 mb-8 text-left border border-border/50">
            <p className="text-xs text-text-muted uppercase tracking-wider mb-2 font-semibold">
              Error Details
            </p>
            <code className="text-error text-sm break-all font-mono">
              {error.message}
            </code>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accent-hover hover:shadow-glow text-bg font-bold rounded-xl transition-shadow duration-200"
            aria-label="Try again to recover from error"
          >
            <RefreshCw className="w-5 h-5" aria-hidden="true" />
            Try Again
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-surface-elevated hover:bg-surface-hover text-text-primary font-bold rounded-xl border-2 border-border hover:border-accent transition-colors duration-200"
            aria-label="Return to home page"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error: error
    };
  }
  componentDidCatch(error, errorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };
  render() {
    if (this.state.hasError) {
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
