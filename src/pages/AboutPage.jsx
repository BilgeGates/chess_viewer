import {
  CheckCircle,
  Code,
  Shield,
  Info,
  Sparkles,
  Image,
  Download,
  Zap,
  Lightbulb,
  Keyboard,
  Copy,
  RotateCw,
  Shuffle,
  FileText,
  Maximize2,
  Layers,
  XCircle
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 sm:py-16 lg:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* About Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-700 shadow-2xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
            About Chess Diagram Generator
          </h1>

          <div className="space-y-6 text-gray-300 text-base sm:text-lg leading-relaxed">
            <p>
              Chess Diagram Generator is a professional tool designed for chess
              enthusiasts, coaches, authors, and content creators who need
              high-quality chess diagrams.
            </p>

            <p>
              Built with modern web technologies, this application provides
              pixel-perfect rendering and ultra-high resolution exports suitable
              for print publications, digital content, and presentations.
            </p>

            <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6 my-8">
              <h2 className="text-2xl font-bold text-blue-400 mb-4">
                Key Highlights
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Ultra-HD Export:</strong> Up to 32x quality
                    (12,800px × 12,800px)
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>
                    <strong>20+ Piece Styles:</strong> Professional piece sets
                    from Lichess
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>
                    <strong>FEN Support:</strong> Full Forsyth-Edwards Notation
                    compatibility
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <span>
                    <strong>Cloud Sync:</strong> Save and sync your favorite
                    positions
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 flex items-center gap-3">
              <Code className="w-7 h-7 text-purple-400" />
              Technology
            </h2>
            <p>
              This application is built with React and uses HTML5 Canvas for
              rendering. All processing happens in your browser - no server
              uploads required, ensuring your positions remain private and
              secure.
            </p>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-8 mb-4 flex items-center gap-3">
              <Shield className="w-7 h-7 text-green-400" />
              Privacy & Security
            </h2>
            <p>
              Your chess positions and diagrams never leave your device. All
              image generation happens locally in your browser, ensuring
              complete privacy and security for your content.
            </p>
          </div>
        </div>

        {/* User Guide Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-700 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                How to Use
              </h2>
              <p className="text-sm text-gray-400">
                Complete guide for creating perfect chess diagrams
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Export Quality Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-blue-400">
                  Export Quality Levels
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QualityCard
                  icon={<Zap className="w-5 h-5" />}
                  level="8x Quality"
                  resolution="3,200px"
                  fileSize="~86KB - 1MB"
                  use="Web & Social Media"
                  color="green"
                />
                <QualityCard
                  icon={<Shield className="w-5 h-5" />}
                  level="16x Quality"
                  resolution="6,400px"
                  fileSize="~255KB - 3MB"
                  use="Print & Presentations"
                  color="blue"
                  recommended
                />
                <QualityCard
                  icon={<Sparkles className="w-5 h-5" />}
                  level="24x Quality"
                  resolution="9,600px"
                  fileSize="~506KB - 6MB"
                  use="Professional Print"
                  color="purple"
                />
                <QualityCard
                  icon={<Maximize2 className="w-5 h-5" />}
                  level="32x Quality"
                  resolution="12,800px"
                  fileSize="~837KB - 6MB+"
                  use="Maximum Quality"
                  color="red"
                />
              </div>
            </div>

            {/* File Formats Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center">
                  <Image className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-amber-400">
                  File Formats
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormatCard
                  icon={<FileText className="w-5 h-5" />}
                  format="PNG"
                  color="blue"
                  pros={[
                    'Transparent background',
                    'Lossless compression',
                    'Best quality'
                  ]}
                  cons={['Larger file size']}
                />
                <FormatCard
                  icon={<Download className="w-5 h-5" />}
                  format="JPEG"
                  color="amber"
                  pros={[
                    'Smaller file size',
                    'Universal support',
                    'Fast loading'
                  ]}
                  cons={['No transparency']}
                />
              </div>
            </div>

            {/* Pro Tips Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-green-400">Pro Tips</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <TipCard text="Use Batch Export to download multiple formats at once" />
                <TipCard text="Validate FEN notation before exporting to ensure accuracy" />
                <TipCard text="Higher quality settings may slow down older browsers" />
                <TipCard text="Board size range: 150-600px, adjustable in 50px steps" />
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-600/20 flex items-center justify-center">
                  <Keyboard className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-purple-400">
                  Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <ActionCard
                  icon={<Copy className="w-4 h-4" />}
                  action="Copy Image"
                  description="Copy to clipboard instantly"
                  color="green"
                />
                <ActionCard
                  icon={<FileText className="w-4 h-4" />}
                  action="Copy FEN"
                  description="Copy position notation"
                  color="blue"
                />
                <ActionCard
                  icon={<RotateCw className="w-4 h-4" />}
                  action="Flip Board"
                  description="View from black's perspective"
                  color="purple"
                />
                <ActionCard
                  icon={<Shuffle className="w-4 h-4" />}
                  action="Random Position"
                  description="Generate test positions"
                  color="pink"
                />
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-gradient-to-br from-blue-950/40 to-purple-950/40 rounded-xl p-5 border border-blue-700/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-bold text-blue-300 text-base">
                    Best Practices
                  </h4>
                  <ul className="text-sm text-gray-300 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>
                        Use <strong>16x quality</strong> for balanced file size
                        and quality
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>
                        Choose <strong>PNG</strong> for transparency or{' '}
                        <strong>JPEG</strong> for smaller files
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>Enable coordinates for instructional diagrams</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-400 mt-0.5">•</span>
                      <span>
                        Test different themes to match your content style
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quality Card Component
const QualityCard = ({
  icon,
  level,
  resolution,
  fileSize,
  use,
  color,
  recommended
}) => {
  const colors = {
    green: 'from-green-600/10 to-green-600/5 border-green-600/30',
    blue: 'from-blue-600/10 to-blue-600/5 border-blue-600/30',
    purple: 'from-purple-600/10 to-purple-600/5 border-purple-600/30',
    red: 'from-red-600/10 to-red-600/5 border-red-600/30'
  };

  const iconColors = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400',
    red: 'text-red-400'
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 space-y-2 hover:shadow-lg transition-all duration-300 relative`}
    >
      {recommended && (
        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
          Recommended
        </div>
      )}
      <div className="flex items-center gap-2">
        <div className={iconColors[color]}>{icon}</div>
        <h5 className={`font-bold text-sm ${iconColors[color]}`}>{level}</h5>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-gray-400 font-mono">{resolution}</p>
        <p className="text-xs text-gray-300 font-semibold">{use}</p>
        <p className="text-xs text-gray-500 italic">{fileSize}</p>
      </div>
    </div>
  );
};

// Format Card Component
const FormatCard = ({ icon, format, color, pros, cons }) => {
  const colors = {
    blue: 'from-blue-600/10 to-blue-600/5 border-blue-600/30 text-blue-400',
    amber: 'from-amber-600/10 to-amber-600/5 border-amber-600/30 text-amber-400'
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-4 space-y-3 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h5 className="font-bold text-base">{format}</h5>
      </div>
      <div className="space-y-2">
        <div className="space-y-1">
          {pros.map((pro) => (
            <div
              key={pro}
              className="flex items-start gap-2 text-xs text-green-400"
            >
              <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{pro}</span>
            </div>
          ))}
        </div>
        <div className="space-y-1">
          {cons.map((con) => (
            <div
              key={con}
              className="flex items-start gap-2 text-xs text-red-400"
            >
              <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{con}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Tip Card Component
const TipCard = ({ text }) => (
  <div className="bg-gray-800/50 rounded-lg p-3 flex items-start gap-3 hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50">
    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
    <p className="text-sm text-gray-300 leading-relaxed">{text}</p>
  </div>
);

// Action Card Component
const ActionCard = ({ icon, action, description, color }) => {
  const colors = {
    green:
      'from-green-600/10 to-green-600/5 border-green-600/30 text-green-400',
    blue: 'from-blue-600/10 to-blue-600/5 border-blue-600/30 text-blue-400',
    purple:
      'from-purple-600/10 to-purple-600/5 border-purple-600/30 text-purple-400',
    pink: 'from-pink-600/10 to-pink-600/5 border-pink-600/30 text-pink-400'
  };

  return (
    <div
      className={`bg-gradient-to-br ${colors[color]} border rounded-lg p-3 space-y-1 hover:shadow-lg transition-all duration-300`}
    >
      <div className="flex items-center gap-2">
        {icon}
        <h6 className="font-bold text-sm">{action}</h6>
      </div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
};

export default AboutPage;
