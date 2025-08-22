import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
  const { logout, authUser, onlineUsers } = useAuthStore();
  const { t } = useTranslation();

  return (
    <header className="bg-base-100/95 backdrop-blur-xl border-b border-base-300 fixed w-full top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo Section */}
          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-200 group">
              <div className="relative">
                <div className="size-10 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg group-hover:shadow-primary/25 transition-shadow">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t('app.name')}
                </h1>
              </div>
            </Link>
          </motion.div>

          {/* Right Section */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {/* Language Selector */}
            <LanguageSelector className="hidden sm:block" />

            {/* Theme Selector */}
            <ThemeSelector className="hidden sm:block" />

            {/* Online Users Indicator */}
            {authUser && onlineUsers.length > 0 && (
              <motion.div
                className="hidden md:flex items-center gap-2 px-3 py-2 bg-success/10 rounded-lg border border-success/20"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-xs font-medium text-success">
                  {onlineUsers.length} {t('common.online')}
                </span>
              </motion.div>
            )}

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to="/settings"
                className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 transition-all duration-200"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">{t('navigation.settings')}</span>
              </Link>

              {authUser && (
                <>
                  <Link
                    to="/profile"
                    className="btn btn-ghost btn-sm gap-2 hover:bg-base-200 transition-all duration-200"
                  >
                    <div className="avatar">
                      <div className="w-5 h-5 rounded-full">
                        <img
                          src={authUser.profilePic || "/avatar.png"}
                          alt="Profile"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <span className="hidden md:inline">{t('navigation.profile')}</span>
                  </Link>

                  <motion.button
                    className="btn btn-ghost btn-sm gap-2 text-error hover:bg-error/10 hover:text-error transition-all duration-200"
                    onClick={logout}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut className="size-4" />
                    <span className="hidden md:inline">{t('navigation.logout')}</span>
                  </motion.button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <MobileMenu />
          </motion.div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
