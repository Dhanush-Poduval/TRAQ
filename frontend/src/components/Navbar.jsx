import React, { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { Bell, Search, Settings, LogOut, Terminal, ArrowLeft } from "lucide-react";

export const Navbar = ({ activeTab, searchQuery, setSearchQuery, notifications, onMarkAllRead, onLogout, onShowLanding }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const getTabLabel = () => {
    switch (activeTab) {
      case "dashboard":
        return "01 // SYSTEM OVERVIEW";
      case "violations":
        return "02 // LIVE DISPATCH FEED";
      case "lpr":
        return "03 // OCR LPR TERMINAL";
      case "analytics":
        return "04 // INCIDENT ANALYSIS";
      case "settings":
        return "05 // SYSTEM LOGIC CONFIG";
      default:
        return "SYSTEM CONTROLLER";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="h-16 border-b-2 border-border bg-background sticky top-0 z-20 px-4 flex items-center justify-between text-foreground select-none font-display">

      {/* Title & Back Navigation */}
      <div className="flex flex-col gap-0.5 justify-center">
        <button
          onClick={onShowLanding}
          className="group flex items-center gap-1 text-[9px] font-mono tracking-widest text-muted-foreground hover:text-accent font-bold uppercase transition-colors cursor-pointer w-fit self-start"
        >
          <ArrowLeft className="w-2.5 h-2.5 transition-transform group-hover:-translate-x-0.5" />
          <span>BACK</span>
        </button>
        <div className="flex items-center gap-2">
          <Terminal className="w-4.5 h-4.5 text-accent" />
          <h2 className="text-xs font-black tracking-widest text-foreground uppercase font-display">
            {getTabLabel()}
          </h2>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-3">

        {/* Search Input */}
        <div className="relative max-w-xs hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="h-3.5 w-3.5 text-foreground" />
          </div>
          <input
            type="text"
            placeholder="SEARCH RECORDS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 pl-search pr-2 py-1 bg-background border-2 border-border text-foreground text-xs font-mono rounded-none focus:outline-none focus:border-accent uppercase placeholder-muted-foreground/60"
          />
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Alert Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-1.5 rounded-none text-foreground hover:bg-foreground hover:text-background dark:hover:bg-accent dark:hover:text-accent-foreground transition-colors relative border-2 border-transparent hover:border-border dark:hover:border-accent"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-accent rounded-none"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-background border-2 border-border rounded-none overflow-hidden z-50 shadow-lg font-mono">
              <div className="px-3 py-2 border-b-2 border-border flex justify-between items-center bg-card">
                <span className="text-[10px] font-black text-foreground font-display tracking-widest">INCIDENT ALERTS</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => {
                      onMarkAllRead();
                      setShowNotifications(false);
                    }}
                    className="text-[9px] text-accent hover:underline font-mono font-bold"
                  >
                    ACKNOWLEDGE
                  </button>
                )}
              </div>
              <div className="divide-y divide-border border-border max-h-60 overflow-y-auto font-mono text-[11px] leading-tight">
                {notifications.length === 0 ? (
                  <div className="p-3 text-center text-xs text-muted-foreground font-bold uppercase">NO INCIDENTS</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-2.5 text-left transition-colors hover:bg-card border-b border-border last:border-b-0 ${
                        notif.read ? "opacity-60" : "bg-accent/5 dark:bg-accent/10"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-[11px] font-bold text-foreground uppercase">
                          {notif.text}
                        </p>
                        <span className="text-[9px] text-muted-foreground font-bold whitespace-nowrap">
                          {notif.time.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-0.5 rounded-none hover:bg-card border-2 border-transparent hover:border-border dark:hover:border-accent transition-colors"
          >
            <div className="w-6 h-6 rounded-none bg-foreground text-background font-mono font-bold flex items-center justify-center text-[10px]">
              AV
            </div>
            <div className="text-left hidden md:block pr-1">
              <p className="text-[10px] font-black text-foreground leading-none uppercase font-display">DISPATCHER 402</p>
              <p className="text-[8px] text-accent font-mono mt-0.5 uppercase tracking-widest font-bold">SUPERVISOR</p>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-background border-2 border-border rounded-none overflow-hidden z-50 p-1 shadow-lg font-mono text-[11px]">
              <div className="px-2.5 py-1.5 border-b-2 border-border mb-1">
                <p className="font-bold text-foreground uppercase">Alan V. (ID: 0402)</p>
                <p className="text-[9px] text-muted-foreground">alan.v@enforcement.gov</p>
              </div>
              <button
                onClick={() => {
                  alert("Accessing System Settings...");
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-foreground hover:bg-foreground hover:text-background dark:hover:bg-accent dark:hover:text-accent-foreground rounded-none transition-colors font-bold uppercase"
              >
                PROFILE SETTINGS
              </button>
              <div className="border-t border-border my-1"></div>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 text-[10px] text-accent hover:bg-accent hover:text-accent-foreground rounded-none transition-colors font-bold uppercase"
              >
                LOGOUT
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
