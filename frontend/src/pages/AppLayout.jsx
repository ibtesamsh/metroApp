import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "../api";
import {
  TicketIcon,
  ListIcon,
  PlayIcon,
  CheckIcon,
  SearchIcon,
  LogoutIcon,
  MenuIcon,
  TrainIcon,
} from "../components/ui/Icons";
import ThemeToggle from "../components/ui/ThemeToggle";

const navItems = [
  { to: "/", label: "Book Ticket", icon: TicketIcon, end: true },
  { to: "/tickets", label: "My Tickets", icon: ListIcon },
  { to: "/start-journey", label: "Start Journey", icon: PlayIcon },
  { to: "/complete-journey", label: "Complete", icon: CheckIcon },
  { to: "/verify-ticket", label: "Verify", icon: SearchIcon },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/60 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (desktop) */}
      <aside
        className={`fixed left-0 top-0 z-40 h-full w-64 transform border-r border-border
          glass p-5 transition-transform duration-200 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="mb-8 flex items-center gap-2 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-fg shadow-soft">
            <TrainIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold leading-none">Metro</p>
            <p className="text-xs text-muted">Ticketing</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "text-brand-fg" : "text-muted hover:text-text"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 rounded-xl bg-brand shadow-soft"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 34,
                      }}
                    />
                  )}
                  <Icon className="relative h-4.5 w-4.5" />
                  <span className="relative">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-5 left-5 right-5 space-y-3">
          <ThemeToggle className="mx-auto" />
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl border border-border px-3 py-2.5 text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
          >
            <LogoutIcon className="h-4.5 w-4.5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border glass px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="text-muted">
            <MenuIcon className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold">Metro Ticketing</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Main content */}
      <main className="md:ml-64 px-4 pb-28 pt-6 md:px-10 md:pt-10 md:pb-10">
        <div className="mx-auto w-full max-w-4xl">
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-border glass md:hidden">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors ${
                isActive ? "text-brand" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="tab-active"
                    className="absolute -top-px left-3 right-3 h-0.5 rounded-full bg-brand"
                    transition={{ type: "spring", stiffness: 500, damping: 34 }}
                  />
                )}
                <Icon className="h-5 w-5" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppLayout;
