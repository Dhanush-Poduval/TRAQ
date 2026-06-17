import React from "react";
import { LayoutDashboard, AlertCircle, FileSpreadsheet, BarChart3, Settings, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/logo.png";

export const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed, onLogout, onShowLanding }) => {
  const { isDark } = useTheme();
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "violations", label: "Violations", icon: AlertCircle, count: 3 },
    { id: "lpr", label: "LPR Terminal", icon: FileSpreadsheet },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen z-30 flex flex-col justify-between border-r-2 border-border bg-background transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      } font-display`}
    >
      {/* Brand Header */}
      <div>
        {collapsed ? (
          <div className="h-16 flex items-center justify-center relative border-b-2 border-border w-full">
            <div
              onClick={onShowLanding}
              className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-colors overflow-hidden"
              title="Return to Welcome Screen"
            >
              <img src={logo} alt="TRAQ Logo" className="w-full h-full object-contain" />
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="absolute right-1 p-1 rounded-none hover:bg-foreground text-foreground hover:text-background dark:hover:text-accent-foreground dark:hover:bg-accent transition-colors hidden md:block border border-transparent hover:border-border dark:hover:border-accent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="h-16 flex items-center justify-between px-4 border-b-2 border-border">
            <div
              onClick={onShowLanding}
              className="flex items-center gap-3 overflow-hidden cursor-pointer group/brand"
              title="Return to Welcome Screen"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center overflow-hidden transition-colors">
                <img src={logo} alt="TRAQ Logo" className="w-full h-full object-contain" />
              </div>
              <div className="transition-all duration-300 select-none">
                <h1 className="text-sm font-black tracking-wider text-foreground font-display uppercase group-hover/brand:text-accent transition-colors">
                  TRAQ
                </h1>
                <p className="text-[8.5px] text-accent font-sans font-bold tracking-wide leading-none mt-1 uppercase">
                  Traffic Risk Analysis & Qualification
                </p>
              </div>
            </div>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-none hover:bg-foreground text-foreground hover:text-background dark:hover:text-accent-foreground dark:hover:bg-accent transition-colors hidden md:block border border-transparent hover:border-border dark:hover:border-accent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-none text-xs font-black tracking-widest uppercase transition-all duration-150 group relative ${
                  isActive
                    ? "bg-accent text-accent-foreground border-2 border-border dark:border-accent"
                    : "text-foreground hover:bg-foreground hover:text-background dark:hover:bg-accent dark:hover:text-accent-foreground border-2 border-transparent hover:border-border dark:hover:border-accent"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-150 ${
                      isActive
                        ? "text-accent-foreground"
                        : "text-foreground group-hover:text-background dark:group-hover:text-accent-foreground"
                    }`}
                  />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {item.count && !collapsed && (
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-none transition-colors duration-150 ${
                      isActive
                        ? "bg-background text-accent"
                        : "bg-foreground text-background group-hover:bg-accent group-hover:text-accent-foreground"
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {/* Collapsed Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-2 py-1 bg-foreground text-background text-[9px] rounded-none opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md font-bold z-50 whitespace-nowrap border border-border uppercase tracking-wider dark:bg-accent dark:text-accent-foreground dark:border-accent">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer / Logout */}
      <div className="p-2 border-t-2 border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-none text-xs font-black tracking-widest uppercase text-foreground hover:bg-accent hover:text-accent-foreground hover:border-border dark:hover:border-accent border-2 border-transparent transition-all duration-150 font-display"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Exit System</span>}
          {collapsed && (
            <div className="absolute left-full ml-3 px-2 py-1 bg-foreground text-background text-[9px] rounded-none opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 shadow-md font-bold z-50 whitespace-nowrap border border-border uppercase tracking-wider dark:bg-accent dark:text-accent-foreground dark:border-accent">
              Exit System
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
