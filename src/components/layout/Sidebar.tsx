import { useState, useCallback } from "react";
import {
  Home,
  Factory,
  Gem,
  Gavel,
  User,
  LogOut,
  Clock,
  Code,
  ChevronDown,
  ChevronUp,
  List,
  Lock,
  Layers,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Button from "../common/Button"; // Assuming this is correct

// --- 1. Type Definitions for Clarity and Safety ---
interface NavItemChild {
  name: string;
  icon: LucideIcon;
  screen: string;
}

interface MainMenuItem {
  name: string;
  icon: LucideIcon;
  screen?: string; // Optional for parent items
  children?: NavItemChild[]; // Optional for items without submenus
}

interface SidebarProps {
  currentScreen: string;
  setScreen: (screen: string) => void;
}

// --- 2. Sidebar Navigation Structure (No Change Needed) ---
const MAIN_MENU_ITEMS: MainMenuItem[] = [
  { name: "Dashboard", icon: Home, screen: "DASHBOARD" },
  {
    name: "Master Files",
    icon: Lock,
    children: [
      { name: "Item Master", icon: Gem, screen: "ITEM_MASTER" },
      { name: "Metal Master", icon: Factory, screen: "METAL_MASTER" },
      { name: "Metal Process Master", icon: Gavel, screen: "METAL_PROCESS_MASTER" },
      { name: "Process Master", icon: Zap, screen: "PROCESS_MASTER" },
      { name: "Process Type Master", icon: Layers, screen: "PROCESS_TYPE_MASTER" },
    ],
  },
  { name: "Employee Management", icon: User, screen: "EMPLOYEE_MASTER" },
  { name: "Point of Sale (POS)", icon: Clock, screen: "POS_WIP" },
  { name: "Company Information", icon: List, screen: "COMPANY_INFO" },
  { name: "Vat Management", icon: List, screen: "VAT_MANAGER" },
];

// --- 3. NavItem Component for Recursion and Reusability ---
const NavItem: React.FC<{ item: MainMenuItem, currentScreen: string, setScreen: (screen: string) => void, isExpanded: boolean, openSubmenu: string, toggleSubmenu: (name: string) => void }> = ({
  item,
  currentScreen,
  setScreen,
  isExpanded,
  openSubmenu,
  toggleSubmenu,
}) => {
  // Determine if this item is currently selected
  const isActive = item.screen === currentScreen;
  // Determine if this is a parent item and its submenu is open
  const isParent = !!item.children;
  const isSubmenuOpen = isParent && openSubmenu === item.name;

  const Icon = item.icon;

  const baseClasses = "flex items-center p-3 rounded-xl transition duration-150 group cursor-pointer";
  const activeClasses = isActive
    ? "bg-indigo-600 text-white shadow-md"
    : "text-gray-600 hover:bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600";

  const handleClick = () => {
    if (item.screen) {
      setScreen(item.screen);
    } else if (isParent) {
      toggleSubmenu(item.name);
    }
    // Note: Child items with screens will never hit the isParent check.
  };

  return (
    <li key={item.name} className="mt-1">
      <div
        role="button" // Use role="button" or an actual <button> for accessibility
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
        className={`${baseClasses} ${activeClasses} ${
          !isExpanded && isParent ? "justify-center" : ""
        }`}
        aria-expanded={isParent ? isSubmenuOpen : undefined} // ARIA attribute
        aria-current={isActive ? "page" : undefined} // ARIA attribute for active screen
      >
        <Icon className="w-5 h-5 shrink-0" />

        {isExpanded && (
          <>
            <span
              className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300`}
            >
              {item.name}
            </span>
            {isParent && (
              <div className="ml-auto transition-transform duration-300">
                {isSubmenuOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Renders collapsed submenu when sidebar is minimized */}
      {!isExpanded && isParent && (
        <div className="absolute left-full top-0 ml-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50 invisible opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
          <div className="p-2 text-sm font-semibold text-gray-700 border-b">{item.name}</div>
          <ul className="space-y-1 p-2">
            {item.children?.map((child) => (
              <li key={child.name}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setScreen(child.screen)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setScreen(child.screen); }}
                  className={`flex items-center p-2 rounded-lg transition duration-150 cursor-pointer ${
                    child.screen === currentScreen
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-indigo-600"
                  }`}
                  aria-current={child.screen === currentScreen ? "page" : undefined}
                >
                  <child.icon className="w-4 h-4 mr-2" />
                  <span className="whitespace-nowrap">{child.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Renders expanded submenu when sidebar is expanded */}
      {isExpanded && isSubmenuOpen && (
        <ul className="ml-6 border-l border-gray-200 pl-3 mt-1 space-y-1">
          {/* Recursively map children, passing all necessary props */}
          {item.children?.map((child) => (
            <NavItem
              key={child.name}
              item={child}
              currentScreen={currentScreen}
              setScreen={setScreen}
              isExpanded={isExpanded}
              openSubmenu={openSubmenu}
              toggleSubmenu={toggleSubmenu}
            />
          ))}
        </ul>
      )}
    </li>
  );
};


const Sidebar: React.FC<SidebarProps> = ({ currentScreen, setScreen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState("");

  const handleMouseEnter = useCallback(() => setIsExpanded(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsExpanded(false);
    setOpenSubmenu(""); // Close submenu on collapse for cleaner transition
  }, []);

  const toggleSubmenu = useCallback((name: string) => {
    setOpenSubmenu((prev) => (prev === name ? "" : name));
  }, []);

  return (
    // Set a min-height to prevent layout shift during expansion/collapse
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-40 p-4 flex flex-col min-h-screen ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- Top Section: Logo & Brand (Modified for centering when collapsed) --- */}
      <div
        className={`flex items-center py-4 mb-6 border-b border-gray-100 ${
          isExpanded ? "justify-start" : "justify-center"
        }`}
      >
        <Gem className={`w-8 h-8 text-indigo-600 shrink-0 ${isExpanded ? "mr-3" : ""}`} />
        {isExpanded && (
          <span className="text-xl font-extrabold text-gray-800 whitespace-nowrap">
            JewelWorks ERP
          </span>
        )}
      </div>

      {/* --- Navigation Links --- */}
      <nav className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-1">
          {MAIN_MENU_ITEMS.map((item) => (
            <NavItem
              key={item.name}
              item={item}
              currentScreen={currentScreen}
              setScreen={setScreen}
              isExpanded={isExpanded}
              openSubmenu={openSubmenu}
              toggleSubmenu={toggleSubmenu}
            />
          ))}
        </ul>
      </nav>

      {/* --- Bottom Section: Footer & Logout --- */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <div
          className={`transition-opacity duration-300 overflow-hidden ${
            isExpanded ? "opacity-100 h-auto" : "opacity-0 h-0"
          }`} // Use h-0 to prevent content from affecting layout when collapsed
        >
          <div className="text-xs text-gray-400 mb-2 space-y-1">
            <p className="flex items-center">
              <Code className="w-3 h-3 mr-1 shrink-0" />
              Developer: FutureTec Solutions
            </p>
            <p className="flex items-center">
              <List className="w-3 h-3 mr-1 shrink-0" />
              Version Date:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <Button
          onClick={() => alert("Simulated Logout. Data is in-memory and will be reset.")}
          variant="secondary"
          icon={LogOut}
          className="w-full justify-center mt-4"
        >
          {isExpanded ? "Logout" : " "} {/* Add a space or non-breaking space for layout consistency */}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;