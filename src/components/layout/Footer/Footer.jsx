import { Heart, Github, ExternalLink, Crown } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="mt-auto border-t border-border bg-surface"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                <Crown className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-text-primary">
                Chess Diagram Generator
              </span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-text-muted text-sm">
              <span>&copy; {currentYear}</span>
              <span className="hidden sm:inline">&middot;</span>
              <span className="hidden sm:flex items-center gap-1">
                Made with
                <Heart className="w-3.5 h-3.5 text-error" fill="currentColor" />
              </span>
            </div>
          </div>

          <a
            href="https://github.com/BilgeGates/chess_viewer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-text-secondary hover:text-text-primary text-sm font-medium hover:bg-surface-hover transition-colors duration-150"
            aria-label="View project on GitHub"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
