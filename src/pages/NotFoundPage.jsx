import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Crown } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="h-screen flex items-center justify-center px-4 bg-bg">
      <div className="text-center max-w-lg animate-fadeIn">
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/10 flex items-center justify-center mx-auto animate-float">
            <Crown className="w-12 h-12 text-accent animate-pulse" />
          </div>
        </div>

        <span className="text-9xl font-display font-bold bg-gradient-to-r from-accent via-text-primary to-accent bg-clip-text text-transparent block mb-6">
          404
        </span>

        <h1 className="text-3xl font-display font-bold text-text-primary mb-4">
          Page Not Found
        </h1>
        <p className="text-text-secondary text-lg mb-10 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-accent-hover text-bg rounded-xl font-bold shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-elevated text-text-primary rounded-xl font-bold hover:bg-surface-hover transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
