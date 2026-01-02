import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Info, Download, HelpCircle, Menu, X, Crown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // İlk yükləmədə check et
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // Debounce ilə resize
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: Info },
    { path: "/download", label: "Download", icon: Download },
    { path: "/support", label: "Support", icon: HelpCircle },
  ];

  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Floating Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-2xl hover:scale-110 transition-transform"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={handleClose}
        />
      )}

      {/* DESKTOP: Side Menu (md və yuxarı) */}
      {!isMobile && (
        <nav
          className={`fixed top-0 left-0 h-full w-72 md:w-80 bg-gray-900/98 backdrop-blur-lg border-r border-gray-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6 pt-16">
            {/* Logo */}
            <div
              className="flex items-center gap-3 mb-8 pb-6 border-b border-gray-700 cursor-pointer"
              onClick={() => {
                navigate("/");
                handleClose();
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Chess Diagram</h1>
                <p className="text-xs text-gray-400">Generator</p>
              </div>
            </div>

            {/* Navigation Items */}
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      `w-full px-4 py-3 rounded-lg font-semibold text-sm transition-all flex items-center gap-3 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* MOBILE: Bottom Sheet (md-dan kiçik) */}
      {isMobile && (
        <nav
          className={`fixed bottom-0 left-0 right-0 bg-gray-900/98 backdrop-blur-lg rounded-t-3xl shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="p-6 pb-safe">
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6" />

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Logo */}
            <div
              className="flex items-center justify-center gap-3 mb-6 pb-6 border-b border-gray-700 cursor-pointer"
              onClick={() => {
                navigate("/");
                handleClose();
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Crown className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Chess Diagram</h1>
                <p className="text-xs text-gray-400">Generator</p>
              </div>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-3 pb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      `px-4 py-4 rounded-xl font-semibold text-sm transition-all flex flex-col items-center justify-center gap-2 ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`
                    }
                  >
                    <Icon className="w-6 h-6" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
