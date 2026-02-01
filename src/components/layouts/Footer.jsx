import { Heart, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gray-900/50 border-t border-gray-800 mt-auto"
      role="contentinfo"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>© {currentYear} Chess Diagram Generator.</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart
              className="w-4 h-4 text-red-500 hidden sm:inline"
              fill="currentColor"
              aria-label="love"
            />
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/BilgeGates/chess_viewer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 rounded"
              aria-label="View project on GitHub (opens in new tab)"
            >
              <Github className="w-4 h-4" aria-hidden="true" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
