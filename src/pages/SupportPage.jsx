import { Mail, MessageSquare, FileText, ExternalLink } from "lucide-react";

const SupportPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 sm:pb-16 lg:pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Support & Help
          </h1>
          <p className="text-gray-400 text-lg">
            Get help and find answers to common questions
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-600/30 rounded-2xl p-8 hover:border-blue-500/50 transition-all">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Email Support
            </h2>
            <p className="text-gray-300 mb-6">
              Send us an email and we'll respond within 24-48 hours.
            </p>

            <a
              href="mailto:support@chessdiagram.com"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              support@chessdiagram.com
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Community Forum */}
          <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-600/30 rounded-2xl p-8 hover:border-purple-500/50 transition-all">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              Community Forum
            </h2>
            <p className="text-gray-300 mb-6">
              Join our community to ask questions and share tips.
            </p>
            <button className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold transition-colors">
              Visit Forum
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 sm:p-8 lg:p-12 border border-gray-700 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <FileText className="w-8 h-8 text-green-400" />
            <h2 className="text-3xl font-bold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                How do I export a chess diagram?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Click on the "Download PNG" or "Download JPEG" buttons below the
                chess board. You can also use the "Batch Export" option to
                export multiple formats at once.
              </p>
            </div>

            {/* FAQ Item 2 */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What is FEN notation?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                FEN (Forsyth-Edwards Notation) is a standard notation for
                describing chess positions. You can enter FEN strings in the
                control panel to set up any chess position you want to diagram.
              </p>
            </div>

            {/* FAQ Item 3 */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I customize the board colors?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Yes! Use the color picker controls in the control panel to
                customize both light and dark square colors. You can also choose
                from 20+ different piece styles.
              </p>
            </div>

            {/* FAQ Item 4 */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                What export quality should I use?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                For web use, 4x-8x quality is sufficient. For print
                publications, use 16x or higher. The maximum 32x quality
                produces images up to 12,800px × 12,800px for professional
                printing.
              </p>
            </div>

            {/* FAQ Item 5 */}
            <div className="border-b border-gray-700 pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Is my data stored on your servers?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                No. All processing happens locally in your browser. Your chess
                positions and diagrams never leave your device, ensuring
                complete privacy and security.
              </p>
            </div>

            {/* FAQ Item 6 */}
            <div className="pb-6">
              <h3 className="text-xl font-semibold text-white mb-3">
                Can I save my favorite positions?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Yes! Click the "Add to Favorites" button to save positions. Your
                favorites are stored locally in your browser and synced across
                sessions.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        {/* <div className="mt-12 text-center bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-600/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-white mb-3">
            Still need help?
          </h3>
          <p className="text-gray-300 mb-6">
            Can't find the answer you're looking for? Feel free to contact us
            directly.
          </p>

          <a
            href="mailto:"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-white font-semibold transition-colors"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </div> */}
      </div>
    </div>
  );
};
export default SupportPage;
