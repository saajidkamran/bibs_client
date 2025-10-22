import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Home, Factory, Gem, Gavel, User, LogOut, Clock, Code, X, ChevronDown, ChevronUp, CheckCircle, XCircle, Search, Edit3, Trash2, Layers, Zap, List, Lock, Briefcase, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

// --- Utility Functions (Simulating Backend) ---

const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

// Master Data Structure Keys
const MASTER_TYPES = {
  PROCESS_TYPE: 'process_types',
  PROCESS: 'processes',
  METAL_PROCESS: 'metal_processes',
  METAL: 'metals',
  ITEM: 'items',
  EMPLOYEE: 'employees',
};

// Mock Initial Data for In-Memory State (Added more data for testing pagination)
const initialDataStore = {
  [MASTER_TYPES.PROCESS_TYPE]: Array.from({ length: 15 }, (_, i) => ({
    id: `pt${i + 1}`,
    name: `Process Type ${String.fromCharCode(65 + (i % 26))}-${i + 1}`,
    isActive: i % 3 !== 0,
    createdAt: new Date(Date.now() - i * 86400000), // simulate different creation dates
  })),
  [MASTER_TYPES.METAL_PROCESS]: [
    { id: 'mp1', name: 'Casting (Lost Wax)', isActive: true, createdAt: new Date() },
    { id: 'mp2', name: 'Annealing', isActive: true, createdAt: new Date() },
    { id: 'mp3', name: 'Rhodioum Plating', isActive: true, createdAt: new Date() },
    { id: 'mp4', name: 'Alloying Prep', isActive: true, createdAt: new Date() },
    { id: 'mp5', name: 'Finishing', isActive: false, createdAt: new Date() },
  ],
  [MASTER_TYPES.PROCESS]: [
    { id: 'p1', name: 'Polishing', processTypeIds: ['pt1'], isActive: true, createdAt: new Date() },
    { id: 'p2', name: 'Resizing', processTypeIds: ['pt1', 'pt2'], isActive: true, createdAt: new Date() },
    { id: 'p3', name: 'Stone Setting', processTypeIds: ['pt3'], isActive: true, createdAt: new Date() },
  ],
  [MASTER_TYPES.METAL]: [
    { id: 'm1', name: 'Gold 18k', metalProcessIds: ['mp1', 'mp2'], isActive: true, createdAt: new Date() },
    { id: 'm2', name: 'Sterling Silver', metalProcessIds: ['mp2', 'mp3'], isActive: true, createdAt: new Date() },
    { id: 'm3', name: 'Platinum', metalProcessIds: ['mp1'], isActive: true, createdAt: new Date() },
  ],
  [MASTER_TYPES.ITEM]: [
    { id: 'i1', name: 'Ring (General)', metalIds: ['m1', 'm2', 'm3'], isActive: true, createdAt: new Date() },
    { id: 'i2', name: 'Necklace Chain', metalIds: ['m2'], isActive: true, createdAt: new Date() },
  ],
  [MASTER_TYPES.EMPLOYEE]: Array.from({ length: 12 }, (_, i) => ({
    id: `e${i + 1}`,
    name: `Employee Name ${i + 1}`,
    employeeId: `EID${100 + i + 1}`,
    role: i % 2 === 0 ? 'Polisher' : 'Stone Setter',
    isActive: i % 4 !== 0,
    createdAt: new Date(Date.now() - i * 18400000),
  })),
};

// --- Shared Components ---

const Button = ({ children, onClick, variant = 'primary', icon: Icon, disabled = false, className = '', type = 'button' }) => {
  const baseStyle = 'flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-semibold transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-50';
  let variantStyle = '';

  switch (variant) {
    case 'primary':
      variantStyle = 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500';
      break;
    case 'secondary':
      variantStyle = 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400';
      break;
    case 'danger':
      variantStyle = 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500';
      break;
    case 'icon':
      return (
        <button
          type={type}
          onClick={onClick}
          disabled={disabled}
          className={`p-2 rounded-full text-gray-600 hover:bg-gray-100 transition duration-150 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {Icon && <Icon className="w-5 h-5" />}
        </button>
      );
    default:
      variantStyle = 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500';
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {Icon && <Icon className="w-5 h-5" />}
      <span>{children}</span>
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, className = '', disabled = false, error, icon: Icon }) => (
  <div className={`flex flex-col ${className}`}>
    {label && (
      <label className="text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`p-2 ${Icon ? 'pl-10' : ''} border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${disabled ? 'bg-gray-100' : 'bg-white'}`}
      />
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
      )}
    </div>
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

const MultiSelect = ({ label, options, selectedIds, onToggle, required = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOptions = options.filter(opt => selectedIds.includes(opt.id));

  return (
    <div className="relative z-10 w-full">
      <label className="text-sm font-medium text-gray-700 mb-1 flex items-center">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div
        className="relative w-full p-2 border border-gray-300 rounded-lg cursor-pointer bg-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-2 min-h-[40px] items-center">
          {selectedOptions.length > 0 ? (
            selectedOptions.map(opt => (
              <span key={opt.id} className="text-xs font-medium bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full flex items-center">
                {opt.name}
              </span>
            ))
          ) : (
            <span className="text-gray-400">Select one or more...</span>
          )}
        </div>
        <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.map(opt => (
            <div
              key={opt.id}
              className="px-4 py-2 cursor-pointer hover:bg-indigo-50 flex items-center justify-between"
              onClick={(e) => {
                e.stopPropagation();
                onToggle(opt.id);
              }}
            >
              <span>{opt.name}</span>
              <input
                type="checkbox"
                checked={selectedIds.includes(opt.id)}
                readOnly
                className="form-checkbox h-4 w-4 text-indigo-600 rounded"
              />
            </div>
          ))}
          <div className="p-2 border-t border-gray-200">
            <Button variant="secondary" onClick={() => setIsOpen(false)} className="w-full text-sm">Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

const Modal = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <Button variant="icon" onClick={onClose} icon={X} />
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Master File Forms (Same as before) ---

const ItemForm = ({ initialData, onSave, metalData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [selectedMetals, setSelectedMetals] = useState(initialData?.metalIds || []);

  const handleToggleMetal = (metalId) => {
    setSelectedMetals(prev =>
      prev.includes(metalId)
        ? prev.filter(id => id !== metalId)
        : [...prev, metalId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || selectedMetals.length === 0) {
      alert("Please fill in item name and select at least one metal.");
      return;
    }
    onSave({ name, metalIds: selectedMetals });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Item Name (e.g., Ring, Bracelet)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <MultiSelect
        label="Select Associated Metals"
        options={metalData.filter(m => m.isActive).map(m => ({ id: m.id, name: m.name }))}
        selectedIds={selectedMetals}
        onToggle={handleToggleMetal}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">{initialData ? 'Update Item' : 'Add New Item'}</Button>
    </form>
  );
};

const MetalForm = ({ initialData, onSave, metalProcessData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [selectedProcesses, setSelectedProcesses] = useState(initialData?.metalProcessIds || []);

  const handleToggleProcess = (processId) => {
    setSelectedProcesses(prev =>
      prev.includes(processId)
        ? prev.filter(id => id !== processId)
        : [...prev, processId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || selectedProcesses.length === 0) {
      alert("Please fill in metal name and select at least one metal process.");
      return;
    }
    onSave({ name, metalProcessIds: selectedProcesses });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Metal Name (e.g., Gold 18k, Silver, Platinum)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <MultiSelect
        label="Select Associated Metal Processes"
        options={metalProcessData.filter(p => p.isActive).map(m => ({ id: m.id, name: m.name }))}
        selectedIds={selectedProcesses}
        onToggle={handleToggleProcess}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">{initialData ? 'Update Metal' : 'Add New Metal'}</Button>
    </form>
  );
};

const ProcessForm = ({ initialData, onSave, processTypeData }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [selectedTypes, setSelectedTypes] = useState(initialData?.processTypeIds || []);

  const handleToggleType = (typeId) => {
    setSelectedTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || selectedTypes.length === 0) {
      alert("Please fill in process name and select at least one process type.");
      return;
    }
    onSave({ name, processTypeIds: selectedTypes });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Process Name (e.g., Casting, Setting, Polishing)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <MultiSelect
        label="Select Associated Process Types"
        options={processTypeData.filter(t => t.isActive).map(t => ({ id: t.id, name: t.name }))}
        selectedIds={selectedTypes}
        onToggle={handleToggleType}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">{initialData ? 'Update Process' : 'Add New Process'}</Button>
    </form>
  );
};

const SimpleMasterForm = ({ initialData, onSave, typeLabel }) => {
  const [name, setName] = useState(initialData?.name || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      alert("Please fill in the name.");
      return;
    }
    onSave({ name });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label={`${typeLabel} Name`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">{initialData ? `Update ${typeLabel}` : `Add New ${typeLabel}`}</Button>
    </form>
  );
};

const EmployeeForm = ({ initialData, onSave }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [employeeId, setEmployeeId] = useState(initialData?.employeeId || '');
  const [role, setRole] = useState(initialData?.role || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !employeeId || !role) {
      alert("Please fill in all employee details.");
      return;
    }
    onSave({ name, employeeId, role });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Employee Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Employee ID (Used for Card Reader Login)"
        value={employeeId}
        onChange={(e) => setEmployeeId(e.target.value)}
        required
        disabled={!!initialData} // Cannot change ID once created
      />
      <Input
        label="Role/Designation"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        required
      />
      <Button type="submit" variant="primary" className="w-full mt-6">{initialData ? 'Update Employee' : 'Add New Employee'}</Button>
    </form>
  );
};

// --- Generic Master Data Screen Component (UPDATED with Sorting and Pagination) ---

const ITEMS_PER_PAGE = 10;

const dynamicSort = (key: string, direction: 'ascending' | 'descending') => {
  return (a: any, b: any) => {
    let aValue = a[key];
    let bValue = b[key];

    // Handle date objects
    if (aValue instanceof Date && bValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }

    // Ensure string comparison is case-insensitive
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === 'ascending' ? -1 : 1;
    if (aValue > bValue) return direction === 'ascending' ? 1 : -1;
    return 0;
  };
};

const MasterDataScreen = ({ title, collectionKey, columnHeaders, renderRow, FormComponent, formProps = {}, data, handlers, sortableFields }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mode, setMode] = useState('Add');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  // Reset page when search term or data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, data]);

  // 1. Filtering and Sorting Logic
  const sortedAndFilteredData = useMemo(() => {
    if (!data) return [];
    
    // Filter
    let filterableData = data.filter(item =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employeeId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort
    if (sortConfig.key) {
      filterableData.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle date objects
        if (sortConfig.key === 'createdAt') {
          aValue = aValue instanceof Date ? aValue.getTime() : 0;
          bValue = bValue instanceof Date ? bValue.getTime() : 0;
        }
        
        // Ensure string comparison is case-insensitive
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      filterableData.sort(dynamicSort(sortConfig.key, sortConfig.direction));
    }

    return filterableData;
  }, [data, searchTerm, sortConfig]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(sortedAndFilteredData.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;

  const paginatedData = useMemo(() => {
    return sortedAndFilteredData.slice(startIdx, endIdx);
  }, [sortedAndFilteredData, startIdx, endIdx]);

  const goToPage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // 3. Sorting Handler
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  const openModal = (record = null, currentMode = 'Add') => {
    setCurrentRecord(record);
    setMode(currentMode);
    setIsModalOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      if (currentRecord) {
        handlers.update(collectionKey, currentRecord.id, payload);
      } else {
        handlers.create(collectionKey, payload);
      }
      setIsModalOpen(false);
    } catch (e) {
      console.error("Error saving record:", e);
    }
  };

  const handleToggleStatus = async (record) => {
    handlers.update(collectionKey, record.id, { isActive: !record.isActive });
  };

  const handleDelete = async (record) => {
    if (window.prompt(`To confirm deletion of ${record.name}, type 'DELETE' below:`) === 'DELETE') {
      handlers.delete(collectionKey, record.id);
    }
  };

  const AddDocIcon = (t) => {
    switch (t) {
      case 'Item Master': return Gem;
      case 'Metal Master': return Factory;
      case 'Process Master': return Zap;
      case 'Process Type Master': return Layers;
      case 'Metal Process Master': return Gavel;
      case 'Employee Master': return Briefcase;
      default: return List;
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{title}</h1>

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Input
          placeholder={`Search ${title}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
          className="md:w-1/3 w-full"
        />
        <Button onClick={() => openModal(null, 'Add')} icon={AddDocIcon(title)} variant="primary">
          Add New {title.split(' ')[0]}
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden flex-grow flex flex-col">
        <div className="overflow-x-auto flex-grow">
          {sortedAndFilteredData.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No records found. Click "Add New" to begin.</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {columnHeaders.map(({ label, key, isSortable = true }) => {
                    const isFieldSortable = sortableFields.includes(key);
                    return (
                      <th
                        key={key}
                        scope="col"
                        className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${isFieldSortable ? 'cursor-pointer hover:bg-gray-100 transition duration-150' : ''}`}
                        onClick={() => isFieldSortable && requestSort(key)}
                      >
                        <div className="flex items-center">
                          {label}
                          {isFieldSortable && getSortIcon(key)}
                        </div>
                      </th>
                    );
                  })}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition duration-150" onClick={() => requestSort('isActive')}>
                    <div className="flex items-center">
                      Status {getSortIcon('isActive')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map(record => (
                  <tr key={record.id} className="hover:bg-gray-50 transition duration-150">
                    {renderRow(record)}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition duration-150 ${record.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        onClick={() => handleToggleStatus(record)}
                      >
                        {record.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        {record.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="icon" icon={Search} onClick={() => openModal(record, 'View')} title="View" className="mr-2" />
                      <Button variant="icon" icon={Edit3} onClick={() => openModal(record, 'Edit')} title="Edit" className="mr-2" />
                      <Button variant="icon" icon={Trash2} onClick={() => handleDelete(record)} title="Delete" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination Footer */}
        {sortedAndFilteredData.length > 0 && (
          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {Math.min(startIdx + 1, sortedAndFilteredData.length)} to {Math.min(endIdx, sortedAndFilteredData.length)} of {sortedAndFilteredData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="secondary"
                icon={ChevronLeft}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm"
              >
                Previous
              </Button>

              <span className="text-sm font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="secondary"
                icon={ChevronRight}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        title={mode === 'Add' ? `Add New ${title.split(' ')[0]}` : `${mode} ${title.split(' ')[0]}`}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <FormComponent
          initialData={currentRecord}
          onSave={handleSave}
          {...formProps}
        />
        {(mode === 'View' || mode === 'Edit') && (
          <div className="mt-4 border-t pt-4">
            <h3 className="text-sm font-semibold mb-2">System Info</h3>
            <p className="text-xs text-gray-500">Created: {currentRecord?.createdAt?.toLocaleDateString() || 'N/A'}</p>
            <p className="text-xs text-gray-500">ID: {currentRecord?.id}</p>
            <p className="text-xs text-gray-500">Status: {currentRecord?.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- Screen Components (Updated to pass sortableFields) ---

const DashboardScreen = ({ dataStore }) => {
  const items = dataStore.items;
  const employees = dataStore.employees;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-indigo-500">
          <p className="text-sm font-medium text-gray-500">Total Master Items</p>
          <p className="text-4xl font-extrabold text-indigo-700">{items.length}</p>
          <p className="text-xs text-gray-400 mt-2">Unique jewelry items configured.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-green-500">
          <p className="text-sm font-medium text-gray-500">Active Employees</p>
          <p className="text-4xl font-extrabold text-green-700">{employees.filter(e => e.isActive).length}</p>
          <p className="text-xs text-gray-400 mt-2">Currently available workforce.</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-yellow-500">
          <p className="text-sm font-medium text-gray-500">Today's Open Jobs</p>
          <p className="text-4xl font-extrabold text-yellow-700">0</p>
          <p className="text-xs text-gray-400 mt-2">Placeholder for POS/Work Order integration.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Employee Time Tracking Status (Mock)</h2>
        <div className="space-y-2">
          {employees.slice(0, 5).map(e => (
            <div key={e.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
              <span className="font-medium">{e.name} ({e.employeeId})</span>
              <span className="text-sm text-gray-500">{e.role}</span>
              <span className={`px-3 py-1 text-xs rounded-full font-semibold ${Math.random() > 0.5 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {Math.random() > 0.5 ? 'Clocked In' : 'Clocked Out'}
              </span>
            </div>
          ))}
          {employees.length === 0 && <p className="text-center text-gray-500 italic">Add employees in the Employee Master to see status.</p>}
        </div>
      </div>
    </div>
  );
};

const ProcessTypeMaster = ({ data, handlers }) => (
  <MasterDataScreen
    data={data.process_types}
    handlers={handlers}
    title="Process Type Master"
    collectionKey={MASTER_TYPES.PROCESS_TYPE}
    sortableFields={['name', 'createdAt']}
    columnHeaders={[
      { label: 'Type Name', key: 'name' },
    ]}
    renderRow={(record) => (
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.name}</td>
    )}
    FormComponent={(props) => <SimpleMasterForm {...props} typeLabel="Process Type" />}
  />
);

const MetalProcessMaster = ({ data, handlers }) => (
  <MasterDataScreen
    data={data.metal_processes}
    handlers={handlers}
    title="Metal Process Master"
    collectionKey={MASTER_TYPES.METAL_PROCESS}
    sortableFields={['name', 'createdAt']}
    columnHeaders={[
      { label: 'Process Name', key: 'name' },
    ]}
    renderRow={(record) => (
      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.name}</td>
    )}
    FormComponent={(props) => <SimpleMasterForm {...props} typeLabel="Metal Process" />}
  />
);

const ProcessMaster = ({ data, handlers }) => {
  const processTypeData = data.process_types;
  return (
    <MasterDataScreen
      data={data.processes}
      handlers={handlers}
      title="Process Master"
      collectionKey={MASTER_TYPES.PROCESS}
      sortableFields={['name', 'createdAt']}
      columnHeaders={[
        { label: 'Process Name', key: 'name' },
        { label: 'Associated Process Types', key: 'processTypeIds', isSortable: false },
      ]}
      renderRow={(record) => (
        <>
          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.name}</td>
          <td className="px-6 py-4">
            <div className="flex flex-wrap gap-1">
              {record.processTypeIds?.map(id => {
                const type = processTypeData.find(t => t.id === id);
                return type ? (
                  <span key={id} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {type.name}
                  </span>
                ) : null;
              })}
            </div>
          </td>
        </>
      )}
      FormComponent={ProcessForm}
      formProps={{ processTypeData }}
    />
  );
};

const MetalMaster = ({ data, handlers }) => {
  const metalProcessData = data.metal_processes;
  return (
    <MasterDataScreen
      data={data.metals}
      handlers={handlers}
      title="Metal Master"
      collectionKey={MASTER_TYPES.METAL}
      sortableFields={['name', 'createdAt']}
      columnHeaders={[
        { label: 'Metal Name', key: 'name' },
        { label: 'Associated Metal Processes', key: 'metalProcessIds', isSortable: false },
      ]}
      renderRow={(record) => (
        <>
          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.name}</td>
          <td className="px-6 py-4">
            <div className="flex flex-wrap gap-1">
              {record.metalProcessIds?.map(id => {
                const process = metalProcessData.find(p => p.id === id);
                return process ? (
                  <span key={id} className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    {process.name}
                  </span>
                ) : null;
              })}
            </div>
          </td>
        </>
      )}
      FormComponent={MetalForm}
      formProps={{ metalProcessData }}
    />
  );
};

const ItemMaster = ({ data, handlers }) => {
  const metalData = data.metals;
  return (
    <MasterDataScreen
      data={data.items}
      handlers={handlers}
      title="Item Master"
      collectionKey={MASTER_TYPES.ITEM}
      sortableFields={['name', 'createdAt']}
      columnHeaders={[
        { label: 'Item Name', key: 'name' },
        { label: 'Associated Metals', key: 'metalIds', isSortable: false },
      ]}
      renderRow={(record) => (
        <>
          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.name}</td>
          <td className="px-6 py-4">
            <div className="flex flex-wrap gap-1">
              {record.metalIds?.map(id => {
                const metal = metalData.find(m => m.id === id);
                return metal ? (
                  <span key={id} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                    {metal.name}
                  </span>
                ) : null;
              })}
            </div>
          </td>
        </>
      )}
      FormComponent={ItemForm}
      formProps={{ metalData }}
    />
  );
};

const EmployeeMaster = ({ data, handlers }) => (
  <MasterDataScreen
    data={data.employees}
    handlers={handlers}
    title="Employee Master"
    collectionKey={MASTER_TYPES.EMPLOYEE}
    sortableFields={['name', 'employeeId', 'role', 'createdAt']}
    columnHeaders={[
      { label: 'Name', key: 'name' },
      { label: 'Employee ID', key: 'employeeId' },
      { label: 'Role', key: 'role' },
    ]}
    renderRow={(record) => (
      <>
        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{record.name}</td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{record.employeeId}</td>
        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{record.role}</td>
      </>
    )}
    FormComponent={EmployeeForm}
  />
);

// --- Navigation Data (Same as before) ---

const MAIN_MENU_ITEMS = [
  { name: 'Dashboard', icon: Home, screen: 'DASHBOARD' },
  {
    name: 'Master Files', icon: Lock, children: [
      { name: 'Item Master', icon: Gem, screen: 'ITEM_MASTER' },
      { name: 'Metal Master', icon: Factory, screen: 'METAL_MASTER' },
      { name: 'Metal Process Master', icon: Gavel, screen: 'METAL_PROCESS_MASTER' },
      { name: 'Process Master', icon: Zap, screen: 'PROCESS_MASTER' },
      { name: 'Process Type Master', icon: Layers, screen: 'PROCESS_TYPE_MASTER' },
    ]
  },
  { name: 'Employee Management', icon: User, screen: 'EMPLOYEE_MASTER' },
  { name: 'Point of Sale (POS)', icon: Clock, screen: 'POS_WIP' },
  { name: 'Reports & Analytics', icon: List, screen: 'REPORTS_WIP' },
];

const Sidebar = ({ currentScreen, setScreen }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState('');

  const handleMouseEnter = () => setIsExpanded(true);
  const handleMouseLeave = () => setIsExpanded(false);

  const toggleSubmenu = (name) => {
    setOpenSubmenu(openSubmenu === name ? '' : name);
  };

  const NavItem = ({ item }) => {
    const isActive = item.screen === currentScreen;
    const isSubmenuOpen = item.children && openSubmenu === item.name;

    const baseClasses = "flex items-center p-3 rounded-xl transition duration-150 group";
    const activeClasses = isActive ? "bg-indigo-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-100 group-hover:bg-indigo-50 group-hover:text-indigo-600";
    const Icon = item.icon;

    return (
      <li key={item.name} className="mt-1">
        <a
          href="#"
          onClick={() => item.screen ? setScreen(item.screen) : toggleSubmenu(item.name)}
          className={`${baseClasses} ${activeClasses}`}
        >
          <Icon className="w-5 h-5 shrink-0" />
          <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 absolute left-full ml-4'}`}>
            {item.name}
          </span>
          {item.children && (
            <div className={`ml-auto transition-transform duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 absolute right-3'}`}>
              {isExpanded ? (isSubmenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />) : null}
            </div>
          )}
        </a>
        {item.children && isSubmenuOpen && isExpanded && (
          <ul className="ml-6 border-l border-gray-200 pl-3 mt-1 space-y-1">
            {item.children.map(child => (
              <NavItem key={child.name} item={child} />
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 ease-in-out z-40 p-4 flex flex-col ${isExpanded ? 'w-64' : 'w-20'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Top Section: Logo & Brand */}
      <div className={`flex items-center py-4 mb-6 border-b border-gray-100 ${isExpanded ? 'justify-start' : 'justify-center'}`}>
        <Gem className={`w-8 h-8 text-indigo-600 shrink-0 ${isExpanded ? 'mr-3' : ''}`} />
        {isExpanded && <span className="text-xl font-extrabold text-gray-800 whitespace-nowrap">JewelWorks ERP</span>}
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow overflow-y-auto pr-2">
        <ul className="space-y-1">
          {MAIN_MENU_ITEMS.map(item => <NavItem key={item.name} item={item} />)}
        </ul>
      </nav>

      {/* Bottom Section: Footer & Logout */}
      <div className="pt-4 mt-auto border-t border-gray-100">
        <div className={`transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="text-xs text-gray-400 mb-2 space-y-1">
            <p>
              <Code className="w-3 h-3 inline mr-1" />
              Developer: Gemini Solutions
            </p>
            <p>
              <List className="w-3 h-3 inline mr-1" />
              Version Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <Button onClick={() => alert("Simulated Logout. Data is in-memory and will be reset.")} variant="secondary" icon={LogOut} className="w-full justify-center mt-2">
          {isExpanded ? 'Logout' : ''}
        </Button>
      </div>
    </aside>
  );
};

// --- Main App Component ---

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('DASHBOARD');
  // Initialize state with mock data
  const [dataStore, setDataStore] = useState(initialDataStore);

  // --- CRUD Handlers (In-Memory State Modification) ---
  const createDocument = useCallback((collectionKey, data) => {
    const newRecord = {
      id: generateId(),
      ...data,
      isActive: true,
      createdAt: new Date(),
    };
    setDataStore(prev => ({
      ...prev,
      [collectionKey]: [newRecord, ...prev[collectionKey]],
    }));
  }, []);

  const updateDocument = useCallback((collectionKey, docId, data) => {
    setDataStore(prev => ({
      ...prev,
      [collectionKey]: prev[collectionKey].map(record =>
        record.id === docId
          ? { ...record, ...data, updatedAt: new Date() }
          : record
      ),
    }));
  }, []);

  const deleteDocument = useCallback((collectionKey, docId) => {
    setDataStore(prev => ({
      ...prev,
      [collectionKey]: prev[collectionKey].filter(record => record.id !== docId),
    }));
  }, []);

  const dataHandlers = useMemo(() => ({
    create: createDocument,
    update: updateDocument,
    delete: deleteDocument,
  }), [createDocument, updateDocument, deleteDocument]);


  // 2. Screen Router
  const renderScreen = () => {
    const screenProps = {
      data: dataStore,
      handlers: dataHandlers
    };

    switch (currentScreen) {
      case 'DASHBOARD':
        return <DashboardScreen dataStore={dataStore} />;
      case 'ITEM_MASTER':
        return <ItemMaster {...screenProps} />;
      case 'METAL_MASTER':
        return <MetalMaster {...screenProps} />;
      case 'METAL_PROCESS_MASTER':
        return <MetalProcessMaster {...screenProps} />;
      case 'PROCESS_MASTER':
        return <ProcessMaster {...screenProps} />;
      case 'PROCESS_TYPE_MASTER':
        return <ProcessTypeMaster {...screenProps} />;
      case 'EMPLOYEE_MASTER':
        return <EmployeeMaster {...screenProps} />;
      case 'POS_WIP':
      case 'REPORTS_WIP':
        return (
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800">{currentScreen.replace('_WIP', '').replace('_', ' ')}</h1>
            <div className="mt-8 p-10 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800">
              <p className="font-semibold text-lg">Work In Progress</p>
              <p>This module is not yet designed. We will work on the Point of Sale and Reports screens in the next stage!</p>
            </div>
          </div>
        );
      default:
        return <DashboardScreen dataStore={dataStore} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased">
      {/* Sidebar - Collapsible Menu Drawer */}
      <Sidebar currentScreen={currentScreen} setScreen={setCurrentScreen} />

      {/* Main Content Area */}
      <main className="ml-20 transition-all duration-300 ease-in-out p-0 h-screen overflow-y-auto">
        <div className="h-full">
          {renderScreen()}
        </div>
      </main>
    </div>
  );
};

export default App;
