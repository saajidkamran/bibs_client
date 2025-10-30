import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X, User, UserPlus, Trash2, CheckSquare, Square, Printer, Calendar, Clock, Camera } from 'lucide-react';

// --- Type Definitions ---

interface Customer {
  id: string;
  name: string;
  company?: string;
  contact?: string;
  type: 'Registered' | 'Invoice' | 'Cash';
}

interface MetalProcess {
  types: { [type: string]: string[] };
}

interface MetalOptions {
  [metal: string]: { metalProcesses: { [process: string]: MetalProcess } };
}

interface SelectionData {
  [category: string]: { metals: MetalOptions };
}

interface Job {
  id: string;
  image: string | null;
  item: string;
  metal: string;
  description: string;
  qty: number;
  total: number;
}

// --- Mock Data ---

// Mock customer data
const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: 'John Doe', company: 'Doe Jewelry', contact: '555-1234', type: 'Registered' },
  { id: '2', name: 'Jane Smith', company: 'Smith Gems', contact: '555-5678', type: 'Registered' },
  { id: '3', name: 'Mike Johnson', company: 'Johnson Metals', contact: '555-9012', type: 'Invoice' },
  { id: '4', name: 'Emily White', company: 'N/A', contact: '555-3456', type: 'Registered' },
];

// Mock data for the cascading selection (Component 2)
const SELECTION_DATA: SelectionData = {
  'RING': {
    metals: {
      'Platinum': {
        // Renaming processes to reflect they are Metal Processes (S3)
        metalProcesses: { 
          'Polishing': { types: { 'Hand Polish': ['Light', 'Heavy'], 'Machine Polish': ['Quick', 'Deep'] } }, 
          'Mounting': { types: { 'Prong': ['4-Prong', '6-Prong'], 'Bezel': ['Full', 'Half'] } } 
        }
      },
      '18d white': {
        metalProcesses: { 
          'Polishing': { types: { 'Hand Polish': ['Light'] } }, 
          'Engraving': { types: { 'Laser': ['in block', 'in script'], 'Hand': ['Deep Cut', 'Shallow'] } } 
        }
      },
      '18d yellow': {
        metalProcesses: { 'Casting': { types: { 'Sand Cast': ['Small', 'Large'], 'Lost Wax': ['Intricate', 'Simple'] } } }
      }
    }
  },
  'Pendant': {
    metals: {
      'SILVER & OXID': {
        metalProcesses: { 'Engraving': { types: { 'Laser': ['in block', 'in script'], 'Hand': ['Deep Cut', 'Shallow'] } }, 'CAD/CAM': { types: { '3D Print': ['Resin', 'Wax'], 'Milling': ['CNC'] } } }
      },
      '14d r&w': {
        metalProcesses: { 'Polishing': { types: { 'Hand Polish': ['Light'] } } }
      }
    }
  },
  'Earring': {
    metals: {
      'Platinum': {
        metalProcesses: { 'Setting': { types: { 'Micro-set': ['0.5mm', '1mm'], 'Pave': ['1.5mm'] } } }
      },
      '18d red': {
        metalProcesses: { 'Hallmark': { types: { 'Laser': ['Small Mark'], 'Stamp': ['Standard'] } } }
      }
    }
  },
  'Bangle': {
    metals: {
      '18d white': {
        metalProcesses: { 'Watch Service': { types: { 'Battery': ['Standard'], 'Cleaning': ['Ultrasonic'] } } }
      }
    }
  }
};

// Helper function to generate unique IDs
const generateId = () => `job_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;


// --- Reusable Components (Defined here for scope) ---

/**
 * Component 3 & 6: Reusable InputGroup
 */
function InputGroup({ label, id, children }: { label: string, id: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
    </div>
  );
}

/**
 * Component 2: Cascading Selection Group (Options and Steps)
 */
function SelectionGroup({ title, options, selected, onSelect, disabled, multiSelect = false }) {
    const selectedArray = Array.isArray(selected) ? selected : (selected ? [selected] : []);
    const isSelected = (option) => selectedArray.includes(option);

    const handleSelect = (option) => {
        if (multiSelect) {
            onSelect(option); // Expects the setter to handle toggling
        } else {
            // Single select logic
            onSelect(option); // Expects the setter to handle setting the single value
        }
    };
    
    return (
        <div className={`p-2 rounded-lg transition duration-300 ${disabled ? 'bg-gray-100' : 'bg-white shadow-sm border border-gray-200'}`}>
            <h3 className={`text-xs font-semibold mb-2 ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>{title}</h3>
            <div className={`flex flex-wrap gap-2 transition-opacity duration-300 ${disabled || options.length === 0 ? 'opacity-50' : ''}`}>
                {options.length === 0 && (
                    <span className="text-xs text-gray-400">
                        {disabled ? 'Select previous step' : 'N/A'}
                    </span>
                )}
                {options.map(option => (
                    <button
                        key={option}
                        onClick={() => handleSelect(option)}
                        disabled={disabled}
                        title={option}
                        className={`
                            selection-btn-65 relative
                            border rounded-md shadow-md
                            transition duration-150 transform hover:scale-[1.02]
                            ${isSelected(option)
                                ? 'bg-blue-600 text-white border-blue-700 ring-2 ring-blue-300'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }
                            ${disabled ? 'cursor-not-allowed bg-gray-100 text-gray-400 shadow-inner hover:bg-gray-100 hover:text-gray-400' : ''}
                        `}
                    >
                        {multiSelect && isSelected(option) && (
                            <CheckSquare className="w-4 h-4 absolute top-1 right-1 text-white bg-blue-600 rounded-sm" />
                        )}
                        <span className="relative z-10">{option}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}


// --- Main App Component ---

export default function App() {
  // --- State Variables ---

  // Component 1: Customer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer>({ id: 'cash', name: 'CASH', type: 'Cash' });
  const [customerSearch, setCustomerSearch] = useState('');
  const [cashCustomerName, setCashCustomerName] = useState('');
  const [cashCustomerContact, setCashCustomerContact] = useState('');
  
  // Image Capture State
  const [isCaptureModalOpen, setIsCaptureModalOpen] = useState(false);
  
  // Component 2: Selection State
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedMetal, setSelectedMetal] = useState<string | null>(null);
  const [selectedMetalProcesses, setSelectedMetalProcesses] = useState<string[]>([]); 
  const [selectedProcesses, setSelectedProcesses] = useState<string[]>([]); 
  const [selectedProcessTypes, setSelectedProcessTypes] = useState<string[]>([]); 

  // Component 3: Job Entry State
  const [quantity, setQuantity] = useState(1);
  const [jobPrice, setJobPrice] = useState(0);
  const [jobComments, setJobComments] = useState('');

  // Component 5: Job List State
  const [jobs, setJobs] = useState<Job[]>([]);

  // Component 6: Ticket Details State
  const [docNo, setDocNo] = useState('100245'); 
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueTime, setDueTime] = useState('12:00');
  const [wantsVatInvoice, setWantsVatInvoice] = useState(false);
  
  // NEW: Ticket Preview Modal State
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);


  // --- Derived Data (for dynamic selections) ---

  const availableMetals = useMemo(() => {
    return selectedItem ? SELECTION_DATA[selectedItem]?.metals || {} : {};
  }, [selectedItem]);

  const availableMetalProcessesOptions = useMemo(() => {
    if (!selectedMetal) return {};
    return availableMetals[selectedMetal]?.metalProcesses || {};
  }, [selectedMetal, availableMetals]);

  const availableProcessesOptions = useMemo(() => {
    const options = new Set<string>();
    if (selectedMetalProcesses.length === 0) return [];

    selectedMetalProcesses.forEach(mpName => {
        const mpData = availableMetalProcessesOptions[mpName];
        if (mpData && mpData.types) {
            Object.keys(mpData.types).forEach(pName => options.add(pName));
        }
    });
    return Array.from(options);
  }, [selectedMetalProcesses, availableMetalProcessesOptions]);
  
  const availableProcessTypesOptions = useMemo(() => {
    const options = new Set<string>();
    if (selectedProcesses.length === 0) return [];
    
    Object.values(availableMetalProcessesOptions).forEach(mpData => {
        if (mpData && mpData.types) {
            Object.entries(mpData.types).forEach(([pName, pTypes]) => {
                if (selectedProcesses.includes(pName)) {
                    pTypes.forEach(type => options.add(type));
                }
            });
        }
    });
    
    return Array.from(options);
  }, [selectedProcesses, availableMetalProcessesOptions]);


  // --- Event Handlers ---

  // Toggler function for multi-select steps (S3, S4, S5)
  const toggleSelection = (option: string, currentArray: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    const isSelected = currentArray.includes(option);
    let newArray;
    
    if (isSelected) {
      newArray = currentArray.filter(item => item !== option);
    } else {
      newArray = [...currentArray, option];
    }
    
    setter(newArray);
    
    if (setter === setSelectedMetalProcesses) {
      setSelectedProcesses([]);
      setSelectedProcessTypes([]);
    } else if (setter === setSelectedProcesses) {
      setSelectedProcessTypes([]);
    }
  };

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    setSelectedMetal(null);
    setSelectedMetalProcesses([]);
    setSelectedProcesses([]);
    setSelectedProcessTypes([]);
  };

  const handleMetalSelect = (metal: string) => {
    setSelectedMetal(metal);
    setSelectedMetalProcesses([]);
    setSelectedProcesses([]);
    setSelectedProcessTypes([]);
  };
  
  const handleMetalProcessToggle = (process: string) => {
    toggleSelection(process, selectedMetalProcesses, setSelectedMetalProcesses);
  };
  
  const handleProcessToggle = (process: string) => {
    toggleSelection(process, selectedProcesses, setSelectedProcesses);
  };
  
  const handleProcessTypeToggle = (type: string) => {
    toggleSelection(type, selectedProcessTypes, setSelectedProcessTypes);
  };

  // Component 1: Customer Modal Handlers
  const openCustomerModal = () => setIsModalOpen(true);
  const closeCustomerModal = () => {
    setIsModalOpen(false);
    setCustomerSearch('');
    setCashCustomerName('');
    setCashCustomerContact('');
  };

  const selectRegisteredCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setWantsVatInvoice(customer.type === 'Invoice' || customer.type === 'Registered'); 
    closeCustomerModal();
  };

  const createCashCustomer = () => {
    if (!cashCustomerName || !cashCustomerContact) {
      console.error("Cash customer needs name and contact.");
      return;
    }
    const cashCustomer: Customer = {
      id: `cash_${Date.now()}`,
      name: cashCustomerName,
      contact: cashCustomerContact,
      type: 'Cash',
    };
    setSelectedCustomer(cashCustomer);
    setWantsVatInvoice(false); 
    closeCustomerModal();
  };
  
  const filteredCustomers = MOCK_CUSTOMERS.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (c.company && c.company.toLowerCase().includes(customerSearch.toLowerCase())) ||
    (c.contact && c.contact.toLowerCase().includes(customerSearch.toLowerCase()))
  );

  // Handler to open the image capture modal
  const openCaptureModal = () => { 
    if (!selectedItem || !selectedMetal || selectedProcessTypes.length === 0 || quantity <= 0) {
      // In a real app, this should be a visual message box, not just console.error
      console.error("Please select an Item, Metal, and at least one Process Type, and ensure quantity is valid.");
      return;
    }
    setIsCaptureModalOpen(true);
  };

  // Final handler to create the job after image is captured or skipped
  const finalizeAddJob = (imageBase64: string | null) => {
    // New logic: Create a separate job entry for *each* selected Process Type
    const newJobs: Job[] = selectedProcessTypes.map(type => {
      const jobDescription = [
        selectedItem,
        selectedMetal,
        `Processes: (${selectedMetalProcesses.join(' + ')})`,
        `Sub-Processes: (${selectedProcesses.join(' + ')})`,
        `Final Service: ${type}`
      ].join(' | ');
      
      return {
        id: generateId(),
        image: imageBase64, // Base64 data URL or null
        item: selectedItem as string,
        metal: selectedMetal as string,
        description: jobDescription,
        qty: quantity, 
        // Use jobPrice for the total, as it is "Price per Type"
        total: jobPrice * quantity, 
      };
    });

    setJobs(prevJobs => [...prevJobs, ...newJobs]);

    // Reset for next job
    setSelectedItem(null);
    setSelectedMetal(null);
    setSelectedMetalProcesses([]);
    setSelectedProcesses([]);
    setSelectedProcessTypes([]);
    setQuantity(1);
    setJobPrice(0);
    setJobComments('');
    
    // Close the image capture modal
    setIsCaptureModalOpen(false);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));
  };
  
  // Calculate total for the ticket
  const ticketTotal = useMemo(() => {
    return jobs.reduce((sum, job) => sum + job.total, 0);
  }, [jobs]);

  // NEW: Function to open the ticket modal
  const openTicketModal = () => {
    if (jobs.length === 0) {
        console.error("No jobs added to the ticket.");
        return;
    }
    setIsTicketModalOpen(true);
  };

  // NEW: Function to finalize the ticket (called from within the modal)
  const finalizeTicket = () => {
    // 1. Log transaction details (for backend/debug purposes)
    console.log(`--- TICKET FINALIZED ---`);
    console.log(`Ticket ${docNo} accepted for ${selectedCustomer.name}. Total Amount: £${ticketTotal.toFixed(2)}`);
    
    // 2. Reset screen for new order
    setJobs([]);
    setSelectedCustomer({ id: 'cash', name: 'CASH', type: 'Cash' });
    setWantsVatInvoice(false);
    
    // 3. Close modal
    setIsTicketModalOpen(false);
  };

  // Assign the modal opener to the button handler
  const handleAcceptAndPrint = openTicketModal;

  // --- Render ---
  return (
    <div className="flex flex-col h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Custom Styles for Form Inputs and 65x65 Buttons */}
      <style jsx="true">{`
        .form-input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          color: #1f2937;
          background-color: #ffffff;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        }
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        .form-input:read-only {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
        
        /* Custom class for fixed 65px buttons with text wrapping/truncation */
        .selection-btn-65 {
          width: 65px; 
          height: 65px; 
          padding: 3px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          font-size: 0.65rem;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* Allow text to wrap within the button, but limit lines */
        .selection-btn-65 > span {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
        }
        
        /* Styles for ticket preview modal */
        .ticket-page {
            width: 100%;
            max-width: 400px; /* Standard receipt width */
            margin: 0 auto;
            padding: 1.5rem;
            background-color: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
      `}</style>

      {/* Top Header Bar */}
      <header className="bg-white shadow-md p-2 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-700">JEWELRY POS (T)</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">OPTIONS</span>
          <span className="text-sm font-medium">MASTER</span>
          <span className="text-sm font-medium text-blue-600 font-bold">POS (TRANSACTIONS)</span>
          <span className="text-sm font-medium">REPORTS</span>
          <span className="text-sm font-medium">Opened Forms</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-2 overflow-hidden">
        
        {/* Step 1: Customer Selection */}
        <div className="bg-white rounded-lg shadow p-3 mb-2">
          <h2 className="text-sm font-semibold text-blue-700 mb-2">Step 1: Select Customer</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={openCustomerModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-150"
            >
              Select Customer
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Name:</span>
              <span className="text-lg font-bold text-gray-900">{selectedCustomer.name}</span>
            </div>
            {selectedCustomer.type === 'Cash' && (
              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setWantsVatInvoice(!wantsVatInvoice)}>
                {wantsVatInvoice ? <CheckSquare className="w-5 h-5 text-blue-600" /> : <Square className="w-5 h-5 text-gray-400" />}
                <span className="text-sm font-medium">Request VAT Invoice</span>
              </div>
            )}
            {(selectedCustomer.type === 'Invoice' || selectedCustomer.type === 'Registered') && (
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">{selectedCustomer.type} Customer (VAT Invoice)</span>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Item Process Selection */}
        <div className="bg-white rounded-lg shadow p-3 mb-2">
          <h2 className="text-sm font-semibold text-blue-700 mb-2">Step 2: Item Process</h2>
          <div className="flex flex-wrap gap-2"> 
            {/* 2.1: Item (Single Select) */}
            <SelectionGroup
              title="Item"
              options={Object.keys(SELECTION_DATA)}
              selected={selectedItem}
              onSelect={handleItemSelect}
            />
            {/* 2.2: Metal (Single Select) */}
            <SelectionGroup
              title="Metal"
              options={Object.keys(availableMetals)}
              selected={selectedMetal}
              onSelect={handleMetalSelect}
              disabled={!selectedItem}
            />
            {/* 2.3: Metal Process (Multi-select) */}
            <SelectionGroup
              title="Metal Process"
              options={Object.keys(availableMetalProcessesOptions)}
              selected={selectedMetalProcesses}
              onSelect={handleMetalProcessToggle}
              disabled={!selectedMetal}
              multiSelect={true}
            />
            {/* 2.4: Process (Multi-select) */}
            <SelectionGroup
              title="Process"
              options={availableProcessesOptions}
              selected={selectedProcesses}
              onSelect={handleProcessToggle}
              disabled={selectedMetalProcesses.length === 0}
              multiSelect={true}
            />
            {/* 2.5: Type of Process (Multi-select) */}
            <SelectionGroup
              title="Type of Process"
              options={availableProcessTypesOptions}
              selected={selectedProcessTypes}
              onSelect={handleProcessTypeToggle}
              disabled={selectedProcesses.length === 0}
              multiSelect={true}
            />
          </div>
        </div>

        {/* Main Job Area (Steps 3, 5, and 4/6) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-2 overflow-hidden">
          
          {/* Left Column: Step 3 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-3 flex flex-col">
            <h2 className="text-sm font-semibold text-blue-700 mb-2">Step 3: Current Job Item</h2>
            <div className="space-y-3">
              <InputGroup label="Item Quantity" id="quantity">
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-input"
                  min="1"
                />
              </InputGroup>
              <InputGroup label="Price per Type" id="jobPrice">
                <input
                  type="number"
                  id="jobPrice"
                  value={jobPrice}
                  onChange={(e) => setJobPrice(parseFloat(e.target.value) || 0)}
                  className="form-input"
                  min="0"
                  step="0.01"
                />
              </InputGroup>
              <InputGroup label="Job Comments" id="jobComments">
                <textarea
                  id="jobComments"
                  rows={4}
                  value={jobComments}
                  onChange={(e) => setJobComments(e.target.value)}
                  className="form-input"
                />
              </InputGroup>
            </div>
            <button
              onClick={openCaptureModal} 
              disabled={!selectedItem || !selectedMetal || selectedProcessTypes.length === 0 || quantity <= 0} 
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Job(s) (Capture Image)
            </button>
          </div>

          {/* Center Column: Step 5 */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-3 flex flex-col overflow-hidden">
            <h2 className="text-sm font-semibold text-blue-700 mb-2">Jobs List</h2>
            <div className="flex-1 overflow-auto">
              <table className="w-full min-w-[600px] text-sm text-left">
                <thead className="bg-gray-100 text-gray-600 uppercase text-xs sticky top-0">
                  <tr>
                    <th className="py-2 px-3">ID</th>
                    <th className="py-2 px-3">Image</th>
                    <th className="py-2 px-3">Item</th>
                    <th className="py-2 px-3">Metal</th>
                    <th className="py-2 px-3">Job Description (Final Service)</th>
                    <th className="py-2 px-3">Qty</th>
                    <th className="py-2 px-3">Total (£)</th>
                    <th className="py-2 px-3">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {jobs.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-gray-500">
                        No jobs added yet.
                      </td>
                    </tr>
                  )}
                  {jobs.map((job, index) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="py-2 px-3 font-mono text-xs">{job.id.split('_')[1]}</td>
                      <td className="py-2 px-3">
                        {/* Display image if Base64 data exists */}
                        {job.image ? (
                          <img 
                            src={job.image} 
                            alt="Job Item" 
                            className="w-10 h-10 rounded object-cover border border-gray-200" 
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center text-xs text-gray-400 bg-gray-100 rounded">
                            No IMG
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-3 font-medium">{job.item}</td>
                      <td className="py-2 px-3">{job.metal}</td>
                      <td className="py-2 px-3 text-xs">{job.description}</td>
                      <td className="py-2 px-3 font-bold">{job.qty}</td>
                      {/* Displaying British Pound symbol */}
                      <td className="py-2 px-3 font-bold">£{job.total.toFixed(2)}</td> 
                      <td className="py-2 px-3">
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Total Display */}
            <div className="mt-4 p-2 border-t border-gray-200 flex justify-end">
                <span className="text-lg font-semibold text-gray-700">Ticket Total: </span>
                {/* Displaying British Pound symbol */}
                <span className="text-xl font-bold text-blue-700 ml-4">£{ticketTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Right Column: Step 4 & 6 */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-3 flex flex-col space-y-4">
            {/* Step 4: Treeview (Simplified to show selected parts) */}
            <div className="border border-gray-200 rounded-lg p-3">
              <h2 className="text-sm font-semibold text-blue-700 mb-2">Selection Preview</h2>
              <ul className="text-sm space-y-1">
                {!selectedItem && <li className="text-gray-400">No item selected...</li>}
                {selectedItem && <li>**{selectedItem}**
                  {selectedMetal && <ul className="pl-4 border-l ml-2"><li>Metal: {selectedMetal}
                    {selectedMetalProcesses.length > 0 && <ul className="pl-4 border-l ml-2"><li>Processes: ({selectedMetalProcesses.join(', ')})
                      {selectedProcesses.length > 0 && <ul className="pl-4 border-l ml-2"><li>Sub-Processes: ({selectedProcesses.join(', ')})
                        {selectedProcessTypes.length > 0 && <ul className="pl-4 border-l ml-2"><li>Types: ({selectedProcessTypes.join(', ')})</li></ul>}
                      </li></ul>}
                    </li></ul>}
                  </li></ul>}
                </li>}
              </ul>
            </div>
            
            {/* Step 6: Ticket Details */}
            <div className="border border-gray-200 rounded-lg p-3 flex-1 flex flex-col">
              <h2 className="text-sm font-semibold text-blue-700 mb-2">Step 4: Ticket Details</h2>
              <div className="space-y-3">
                <InputGroup label="Doc No:" id="docNo">
                  <input 
                    type="text" 
                    id="docNo" 
                    value={docNo} 
                    onChange={e => setDocNo(e.target.value)} 
                    className="form-input" 
                  />
                </InputGroup>
                <InputGroup label="Due Date:" id="dueDate">
                  <div className="relative">
                    <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} className="form-input" />
                    <Calendar className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </InputGroup>
                <InputGroup label="Due Time:" id="dueTime">
                  <div className="relative">
                    <input type="time" id="dueTime" value={dueTime} onChange={e => setDueTime(e.target.value)} className="form-input" />
                    <Clock className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </InputGroup>
              </div>
              <button
                onClick={handleAcceptAndPrint}
                disabled={jobs.length === 0}
                className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-150 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer className="w-5 h-5" />
                Accept & Print Ticket
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Component 1: Customer Modal */}
      {isModalOpen && (
        <CustomerModal
          onClose={closeCustomerModal}
          customers={filteredCustomers}
          search={customerSearch}
          setSearch={setCustomerSearch}
          onSelectCustomer={selectRegisteredCustomer}
          cashName={cashCustomerName}
          setCashName={setCashCustomerName}
          cashContact={cashCustomerContact}
          setCashContact={setCashCustomerContact}
          onCreateCashCustomer={createCashCustomer}
        />
      )}
      
      {/* Image Capture Modal */}
      {isCaptureModalOpen && (
        <ImageCaptureModal
          onClose={() => setIsCaptureModalOpen(false)}
          onCapture={finalizeAddJob} 
          onSkip={() => finalizeAddJob(null)} 
        />
      )}
      
      {/* NEW: Ticket Preview Modal */}
      {isTicketModalOpen && (
        <TicketPreviewModal
          jobs={jobs}
          customer={selectedCustomer}
          docNo={docNo}
          dueDate={dueDate}
          dueTime={dueTime}
          ticketTotal={ticketTotal}
          wantsVatInvoice={wantsVatInvoice}
          onClose={() => setIsTicketModalOpen(false)}
          onConfirmPrint={finalizeTicket} // Calls the finalization logic
        />
      )}
    </div>
  );
}

// --- Sub-Components ---

/**
 * Customer Modal - Component 1 Implementation
 */
function CustomerModal({ onClose, customers, search, setSearch, onSelectCustomer, cashName, setCashName, cashContact, setCashContact, onCreateCashCustomer }) {
    
    // Determine if the cash customer creation button should be enabled
    const isCashButtonDisabled = !cashName.trim() || !cashContact.trim();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
                
                {/* Modal Header */}
                <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <User className="w-6 h-6"/> Customer Selection
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition duration-150">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {/* Modal Body */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                    
                    {/* Registered/Invoice Customers */}
                    <div className="md:border-r md:pr-4">
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">Registered Customers</h3>
                        <div className="relative mb-3">
                            <input
                                type="text"
                                placeholder="Search by Name, Company, or Contact"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="form-input pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>

                        <div className="max-h-60 overflow-y-auto border rounded-lg">
                            {customers.length === 0 ? (
                                <p className="p-3 text-center text-gray-500">No matching customers found.</p>
                            ) : (
                                customers.map(customer => (
                                    <div
                                        key={customer.id}
                                        className="p-3 border-b hover:bg-blue-50 cursor-pointer transition flex justify-between items-center"
                                        onClick={() => onSelectCustomer(customer)}
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">{customer.name}</p>
                                            <p className="text-xs text-gray-500">{customer.company || 'N/A'} - {customer.contact}</p>
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${customer.type === 'Invoice' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                            {customer.type}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                    {/* Cash Customer */}
                    <div>
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">Cash / New Guest Customer</h3>
                        <div className="space-y-3">
                            <InputGroup label="Customer Name" id="cashName">
                                <input 
                                    type="text" 
                                    id="cashName" 
                                    placeholder="Enter Name"
                                    value={cashName}
                                    onChange={(e) => setCashName(e.target.value)}
                                    className="form-input"
                                />
                            </InputGroup>
                            <InputGroup label="Contact Number" id="cashContact">
                                <input 
                                    type="text" 
                                    id="cashContact" 
                                    placeholder="Enter Contact"
                                    value={cashContact}
                                    onChange={(e) => setCashContact(e.target.value)}
                                    className="form-input"
                                />
                            </InputGroup>
                            <button
                                onClick={onCreateCashCustomer}
                                disabled={isCashButtonDisabled}
                                className="mt-4 w-full py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <UserPlus className="w-5 h-5" /> Create & Select Cash Customer
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <footer className="p-4 border-t flex justify-end bg-white">
                    <button 
                        onClick={onClose}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg shadow-md"
                    >
                        Close
                    </button>
                </footer>
            </div>
        </div>
    );
}

/**
 * Image Capture Modal (Simulated)
 */
function ImageCaptureModal({ onClose, onCapture, onSkip }) {
    // In a real application, this would use the browser's MediaDevices API to access the camera.
    // For this simulation, we'll generate a placeholder image URL on "capture".

    const handleSimulatedCapture = () => {
        // Placeholder image URL
        const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/yN/DAAAACXBIWXMAAAsTAAALEwEAmpwYAAABsklEQVR4nO3dO04DQRQF0W8BMSkRCRo2eW4NBE8ABU4JqIAG9Y1bW2kCg0lGggQx4o02N8l2932tY3s/kL8c5v/rM9p6U277qYyS3/h9P5+B+Q91EJEKx1c+v4/f+fA2pU97qYyS3/h9f9+n/w4iEalQLO2u7u40pU/5qYyS3/h9f/t3t4B1yP1UJs98D0RCHfP087z127f8lJ/K2X7uJt+35aegUuqY77/7dF3fA/OQn8rZfu4m37elHwKRiEal3b09w8/z8NOn/FTO9nM3/b4t/RCIhGpR/vnnr/7x8/Xz/v3e29qX7+f5uJt9/Sj/c/38Pj9D+Y+X/dZNv2/L70BEIhG1Qj66+vj6q/D28/1dG9jR1X/+X4H46O3jV97t3fF7kH/NT+Vsv3cTbtsuD8xPZe9f/vP310fXb/t3fD/T/O1v/m5j/b6tPzL7x97x1u/33n3c/f3O/f3P/fve29qX7+f5uJt9/Sj/c/38Pj/3/Gf+b2f6v52/5af8Vs72czf9vu1/RCIhGoRiUSiFpFIJCIWiUQikYhYJCKRSCQikkSif0lE3y4l4VwVAAAAAElFTkSuQmCC"; 
        onCapture(base64Image); 
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden">
                
                {/* Modal Header */}
                <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <Camera className="w-6 h-6"/> Capture Item Image
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition duration-150">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {/* Modal Body: Camera View Simulation */}
                <div className="p-6 flex flex-col items-center justify-center bg-gray-100 flex-1">
                    <div className="w-full h-64 bg-gray-300 rounded-lg border-4 border-gray-400 flex items-center justify-center text-center text-gray-600 font-semibold text-xl">
                        [LIVE CAMERA FEED SIMULATION AREA]
                        <p className="absolute mt-20 text-sm italic">(Using a placeholder image on 'Capture')</p>
                    </div>
                </div>

                {/* Modal Footer: Action Buttons */}
                <footer className="p-4 border-t flex justify-between bg-white">
                    <button 
                        onClick={onSkip}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow-md"
                    >
                        Skip & Add Job
                    </button>
                    <button 
                        onClick={handleSimulatedCapture}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md flex items-center gap-2"
                    >
                        <Camera className="w-5 h-5" /> Capture Image
                    </button>
                </footer>
            </div>
        </div>
    );
}

/**
 * NEW: Ticket Preview Modal - Displays the final ticket before printing/finalizing
 */
function TicketPreviewModal({ jobs, customer, docNo, dueDate, dueTime, ticketTotal, wantsVatInvoice, onClose, onConfirmPrint }) {
    
    // Simple VAT calculation for demonstration (assuming 20% VAT)
    const vatRate = 0.20;
    const subtotal = ticketTotal / (1 + (wantsVatInvoice ? vatRate : 0));
    const vatAmount = ticketTotal - subtotal;
    
    // Function to trigger print dialog (simulated here)
    const handlePrint = () => {
        // In a real environment, this would format the ticket content
        // and send it to a printer API or window.print()
        console.log("Simulating ticket print...");
        onConfirmPrint();
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden h-[90vh]">
                
                {/* Modal Header */}
                <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <Printer className="w-6 h-6"/> Ticket Preview (Doc No: {docNo})
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition duration-150">
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {/* Modal Body: Printable Ticket Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="ticket-page">
                        
                        {/* Company Header/Logo */}
                        <div className="text-center pb-4 border-b border-dashed border-gray-400 mb-4">
                            <h1 className="text-2xl font-extrabold text-gray-900">GEMINI JEWELRY SERVICES</h1>
                            <p className="text-xs text-gray-500">The Finest Workmanship</p>
                            <p className="text-sm mt-2">123 High Street, London, UK</p>
                        </div>
                        
                        {/* Ticket & Customer Details */}
                        <div className="text-sm mb-4 space-y-1">
                            <div className="flex justify-between">
                                <span className="font-semibold">Doc No:</span>
                                <span>{docNo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Date Due:</span>
                                <span>{new Date(dueDate).toLocaleDateString()} @ {dueTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Customer:</span>
                                <span className="font-bold">{customer.name} ({customer.type})</span>
                            </div>
                            {customer.contact && (
                                <div className="flex justify-between">
                                    <span className="font-semibold">Contact:</span>
                                    <span>{customer.contact}</span>
                                </div>
                            )}
                        </div>
                        
                        {/* Jobs List */}
                        <div className="border-t border-b border-dashed border-gray-400 py-3 mb-4">
                            <h3 className="text-xs font-bold uppercase mb-2">Job Items</h3>
                            <div className="space-y-3">
                                {jobs.map((job) => (
                                    <div key={job.id} className="text-xs border-b pb-2 last:border-b-0">
                                        <div className="flex justify-between font-semibold">
                                            <span>{job.item} / {job.metal}</span>
                                            <span>£{job.total.toFixed(2)}</span>
                                        </div>
                                        <p className="text-gray-600 italic">Qty: {job.qty} - {job.description.split(' | ')[4]?.replace('Final Service: ', '')}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Totals Section */}
                        <div className="text-sm space-y-1">
                            {wantsVatInvoice ? (
                                <>
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>£{subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>VAT (20%):</span>
                                        <span>£{vatAmount.toFixed(2)}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between">
                                    <span>Total (Cash):</span>
                                    <span>£{ticketTotal.toFixed(2)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-gray-400">
                                <span>GRAND TOTAL:</span>
                                <span>£{ticketTotal.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="text-center pt-4 mt-4 border-t border-dashed border-gray-400">
                            <p className="text-xs italic">Thank you for your business. Please keep this ticket as proof of service.</p>
                        </div>
                        
                    </div>
                </div>

                {/* Modal Footer: Action Buttons */}
                <footer className="p-4 border-t flex justify-end bg-white">
                    <button 
                        onClick={handlePrint}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md flex items-center gap-2"
                    >
                        <Printer className="w-5 h-5" /> Confirm & Print
                    </button>
                </footer>
            </div>
        </div>
    );
}
