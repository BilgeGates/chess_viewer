import { Heart, Github, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900/50 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>© {currentYear} Chess Diagram Generator.</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart
              className="w-4 h-4 text-red-500 hidden sm:inline"
              fill="currentColor"
            />
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/BilgeGates/chess_viewer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
