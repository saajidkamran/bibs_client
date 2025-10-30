import { X, User, UserPlus, Search } from 'lucide-react';
import InputGroup from '../common/InputGroup';

// --- Type Definition ---
interface Customer {
    id: string;
    name: string;
    company?: string;
    contact?: string;
    type: 'Registered' | 'Invoice' | 'Cash';
}

interface CustomerModalProps {
    onClose: () => void;
    customers: Customer[];
    search: string;
    setSearch: (v: string) => void;
    onSelectCustomer: (c: Customer) => void;
    cashName: string;
    setCashName: (v: string) => void;
    cashContact: string;
    setCashContact: (v: string) => void;
    onCreateCashCustomer: () => void;
}

export default function CustomerModal({
    onClose,
    customers,
    search,
    setSearch,
    onSelectCustomer,
    cashName,
    setCashName,
    cashContact,
    setCashContact,
    onCreateCashCustomer,
}: CustomerModalProps) {
    const isCashButtonDisabled = !cashName.trim() || !cashContact.trim();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <User className="w-6 h-6" /> Customer Selection
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition duration-150"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {/* Body */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                    {/* Registered / Invoice Customers */}
                    <div className="md:border-r md:pr-4">
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">
                            Registered Customers
                        </h3>
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
                                <p className="p-3 text-center text-gray-500">
                                    No matching customers found.
                                </p>
                            ) : (
                                customers.map((customer) => (
                                    <div
                                        key={customer.id}
                                        className="p-3 border-b hover:bg-blue-50 cursor-pointer transition flex justify-between items-center"
                                        onClick={() => onSelectCustomer(customer)}
                                    >
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {customer.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {customer.company || 'N/A'} - {customer.contact}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${customer.type === 'Invoice'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                                }`}
                                        >
                                            {customer.type}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Cash / New Guest */}
                    <div>
                        <h3 className="font-semibold text-lg text-gray-700 mb-3">
                            Cash / New Guest Customer
                        </h3>
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

                {/* Footer */}
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