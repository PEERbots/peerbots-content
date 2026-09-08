import { SocialLinks, Text } from "@peerbots/core";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#152b3c] text-white py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Brand & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
          <span className="font-bold text-sm tracking-wider uppercase text-peerbots-teal">
            Peerbots Marketplace
          </span>
          <span className="text-gray-500 hidden sm:inline">•</span>
          <Text size="sm" className="!text-gray-300">
            © {currentYear} Peerbots
          </Text>
        </div>

        {/* Center: Ecosystem Links */}
        <div className="flex items-center gap-6 text-sm">
          <a
            href="https://peerbots.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Peerbots
          </a>
          <a
            href="https://app.peerbots.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Robot Controller
          </a>
          <a
            href="mailto:hello@peerbots.org"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Right: Social Links */}
        <div>
          <SocialLinks variant="white" size="sm" />
        </div>
      </div>
    </footer>
  );
}
