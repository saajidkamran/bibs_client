import React, { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import ItemMaster from "./components/masters/ItemMaster";
import MetalMaster from "./components/masters/MetalMaster";
import ProcessMaster from "./components/masters/ProcessMaster";
import ProcessTypeMaster from "./components/masters/ProcessTypeMaster";
import MetalProcessMaster from "./components/masters/MetalProcessMaster";
import EmployeeMaster from "./components/masters/EmployeeMaster";
import { PosMainScreen } from "./components/pos/PosMainScreen";

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState("DASHBOARD");
  console.log("🚀 ~ App ~ currentScreen:", currentScreen)

  const renderContent = () => {
    switch (currentScreen) {
      case "DASHBOARD":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Welcome to JewelWorks ERP 💎
            </h1>
            <p className="mt-2 text-gray-600">
              Use the sidebar to navigate between modules like POS and Masters.
            </p>
          </div>
        );

      case "POS_WIP":
        return <PosMainScreen />;

      case "ITEM_MASTER":
        return <ItemMaster />;

      case "METAL_MASTER":
        return <MetalMaster />;

      case "PROCESS_MASTER":
        return <ProcessMaster />;

      case "PROCESS_TYPE_MASTER":
        return <ProcessTypeMaster />;

      case "METAL_PROCESS_MASTER":
        return <MetalProcessMaster />;

      case "EMPLOYEE_MASTER":
        return <EmployeeMaster />;

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentScreen={currentScreen} setScreen={setCurrentScreen} />
      <main className="flex-1 overflow-y-auto bg-gray-50 ml-20">{renderContent()}</main>
    </div>
  );
};

export default App;
