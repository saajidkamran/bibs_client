import { useState } from "react";
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
  Briefcase,
} from "lucide-react";
import Button from "../common/Button";

interface SidebarProps {
  currentScreen: string;
  setScreen: (screen: string) => void;
}

// Sidebar Navigation Structure
const MAIN_MENU_ITEMS = [
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
  { name: "Reports & Analytics", icon: List, screen: "REPORTS_WIP" },
  { name: "Vat Management", icon: List, screen: "VAT_MANAGER" },
];

const Sidebar: React.FC<SidebarProps> = ({ currentScreen, setScreen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState("");

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu((prev) => (prev === name ? "" : name));
  };

  const NavItem = ({ item }: { item: any }) => {
    const isActive = item.screen === currentScreen;
    const isSubmenuOpen = item.children && openSubmenu === item.name;

    const baseClasses = "flex items-center p-3 rounded-xl transition duration-150 group";
    const activeClasses = isActive
      ? "bg-indigo-600 text-white shadow-md"
      : "text-gray-600 hover:bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600";

    const Icon = item.icon;

    return (
      <li key={item.name} className="mt-1">
        <a
          href="#"
          onClick={() => (item.screen ? setScreen(item.screen) : toggleSubmenu(item.name))}
          className={`${baseClasses} ${activeClasses}`}
        >
          <Icon className="w-5 h-5 shrink-0" />
          <span
            className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${
              isExpanded ? "opacity-100" : "opacity-0 absolute left-full ml-4"
            }`}
          >
            {item.name}
          </span>
          {item.children && (
            <div
              className={`ml-auto transition-transform duration-300 ${
                isExpanded ? "opacity-100" : "opacity-0 absolute right-3"
              }`}
            >
              {isExpanded &&
                (isSubmenuOpen ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                ))}
            </div>
          )}
        </a>

        {item.children && isSubmenuOpen && isExpanded && (
          <ul className="ml-6 border-l border-gray-200 pl-3 mt-1 space-y-1">
            {item.children.map((child: any) => (
              <NavItem key={child.name} item={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-40 p-4 flex flex-col ${
        isExpanded ? "w-64" : "w-20"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* --- Top Section: Logo & Brand --- */}
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
            <NavItem key={item.name} item={item} />
          ))}
        </ul>
      </nav>

      {/* --- Bottom Section: Footer & Logout --- */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <div
          className={`transition-opacity duration-300 ${isExpanded ? "opacity-100" : "opacity-0"}`}
        >
          <div className="text-xs text-gray-400 mb-2 space-y-1">
            <p>
              <Code className="w-3 h-3 inline mr-1" />
              Developer: FutureTec Solutions
            </p>
            <p>
              <List className="w-3 h-3 inline mr-1" />
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
          className="w-full justify-center mt-2"
        >
          {isExpanded ? "Logout" : ""}
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
