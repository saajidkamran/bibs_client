import { Printer, X } from 'lucide-react';

interface Job {
    id: string;
    image: string | null;
    item: string;
    metal: string;
    description: string;
    qty: number;
    total: number;
}

interface Customer {
    id: string;
    name: string;
    company?: string;
    contact?: string;
    type: 'Registered' | 'Invoice' | 'Cash';
}

interface TicketPreviewModalProps {
    jobs: Job[];
    customer: Customer;
    docNo: string;
    dueDate: string;
    dueTime: string;
    ticketTotal: number;
    wantsVatInvoice: boolean;
    onClose: () => void;
    onConfirmPrint: () => void;
}

export default function TicketPreviewModal({
    jobs,
    customer,
    docNo,
    dueDate,
    dueTime,
    ticketTotal,
    wantsVatInvoice,
    onClose,
    onConfirmPrint,
}: TicketPreviewModalProps) {
    const vatRate = 0.2; // 20% VAT
    const subtotal = ticketTotal / (1 + (wantsVatInvoice ? vatRate : 0));
    const vatAmount = ticketTotal - subtotal;

    const handlePrint = () => {
        console.log('Simulating ticket print...');
        onConfirmPrint();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden h-[90vh]">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b bg-blue-50">
                    <h2 className="text-xl font-bold text-blue-800 flex items-center gap-2">
                        <Printer className="w-6 h-6" /> Ticket Preview (Doc No: {docNo})
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1 rounded-full bg-white transition duration-150"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="ticket-page">
                        {/* Company Header */}
                        <div className="text-center pb-4 border-b border-dashed border-gray-400 mb-4">
                            <h1 className="text-2xl font-extrabold text-gray-900">
                                GEMINI JEWELRY SERVICES
                            </h1>
                            <p className="text-xs text-gray-500">The Finest Workmanship</p>
                            <p className="text-sm mt-2">123 High Street, London, UK</p>
                        </div>

                        {/* Ticket & Customer Info */}
                        <div className="text-sm mb-4 space-y-1">
                            <div className="flex justify-between">
                                <span className="font-semibold">Doc No:</span>
                                <span>{docNo}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Date Due:</span>
                                <span>
                                    {new Date(dueDate).toLocaleDateString()} @ {dueTime}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-semibold">Customer:</span>
                                <span className="font-bold">
                                    {customer.name} ({customer.type})
                                </span>
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
                                    <div
                                        key={job.id}
                                        className="text-xs border-b pb-2 last:border-b-0"
                                    >
                                        <div className="flex justify-between font-semibold">
                                            <span>
                                                {job.item} / {job.metal}
                                            </span>
                                            <span>£{job.total.toFixed(2)}</span>
                                        </div>
                                        <p className="text-gray-600 italic">
                                            Qty: {job.qty} -{' '}
                                            {job.description
                                                .split(' | ')[4]
                                                ?.replace('Final Service: ', '')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Totals */}
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
                            <p className="text-xs italic">
                                Thank you for your business. Please keep this ticket as proof of
                                service.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
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