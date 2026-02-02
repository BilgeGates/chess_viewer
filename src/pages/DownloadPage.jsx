import { Globe, CheckCircle, Smartphone } from 'lucide-react';

const DownloadPage = () => {
  const handleInstallPWA = () => {
    // Check if PWA can be installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      alert('App is already installed!');
      return;
    }

    // For browsers that support PWA installation
    alert(
      'To install:\n\n1. Click the browser menu (⋮)\n2. Select "Install app" or "Add to Home Screen"\n3. Follow the prompts'
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 sm:pb-16 lg:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Download Options
          </h1>
          <p className="text-gray-400 text-lg">
            Access Chess Diagram Generator on any device
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Web Application */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Web Application
            </h2>
            <p className="text-gray-300 mb-6">
              Use directly in your browser. No installation required.
            </p>
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Instant access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Always up to date</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Works on all devices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>No downloads needed</span>
              </div>
            </div>
            <a
              href="/"
              className="block w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors text-center"
            >
              Use Web App
            </a>
          </div>

          {/* PWA (Progressive Web App) */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-600/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Progressive Web App
            </h2>
            <p className="text-gray-300 mb-6">
              Install as a native app on your device for offline access.
            </p>
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>App-like experience</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Home screen icon</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Fast loading</span>
              </div>
            </div>
            <button
              onClick={handleInstallPWA}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg text-white font-semibold transition-all shadow-lg hover:shadow-purple-500/50 active:scale-95"
            >
              Install PWA
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">
            Installation Guide
          </h3>
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">
                📱 Mobile (iOS/Android)
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Open the app in Safari (iOS) or Chrome (Android)</li>
                <li>Tap the Share button (iOS) or Menu (⋮) (Android)</li>
                <li>Select "Add to Home Screen"</li>
                <li>Confirm and enjoy!</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">
                💻 Desktop (Chrome/Edge)
              </h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Look for the install icon (➕) in the address bar</li>
                <li>Click "Install" when prompted</li>
                <li>The app will open in a standalone window</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DownloadPage;
