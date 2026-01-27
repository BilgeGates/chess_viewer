import { Globe, CheckCircle, Monitor } from 'lucide-react';

const DownloadPage = () => {
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
            </div>
            <button className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors">
              Use Web App
            </button>
          </div>
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-600/30 rounded-2xl p-8">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Monitor className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Desktop App</h2>
            <p className="text-gray-300 mb-6">
              Native application for Windows, Mac, and Linux.
            </p>
            <div className="space-y-2 text-sm text-gray-400 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Offline access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Better performance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Native integration</span>
              </div>
            </div>
            <button className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-semibold transition-colors">
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DownloadPage;
