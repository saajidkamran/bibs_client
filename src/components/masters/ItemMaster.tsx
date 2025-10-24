import React, { useState } from "react";
import MasterDataScreen from "./MasterDataScreen";
import ItemForm from "../forms/ItemForm";
import Button from "../common/Button";
import { generateId } from "../../data/utils";
import { initialDataStore, MASTER_TYPES } from "../../data/mockData";
import { CheckCircle, Pencil, Trash2, XCircle } from "lucide-react";
import type { Item, Metal } from "../types";

const ItemMaster: React.FC = () => {
  const [items, setItems] = useState<Item[]>(initialDataStore.items as Item[]);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isFormOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === id ? { ...i, isActive: !i.isActive } : i
      )
    );
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const handleSave = (formData: any) => {
    if (selectedItem) {
      // Update existing item
      setItems((prev) => prev.map((i) => (i.id === selectedItem.id ? { ...i, ...formData } : i)));
    } else {
      // Add new item
      setItems((prev) => [...prev, { id: generateId(), createdAt: new Date(), ...formData }]);
    }
    setFormOpen(false);
  };

  return (
    <MasterDataScreen
      title="Item Master"
      onAdd={handleAdd}
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
    >
      {/* Item List */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-3 py-2 text-left">Item Name</th>
              <th className="px-3 py-2 text-left">Metals</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 py-2 text-sm">{item.name}</td>
                <td className="px-3 py-2 text-sm">
                  {(item.metalIds || [])
                    .map((mid: string) => {
                      const metal = initialDataStore.metals.find((m) => m.id === mid);
                      return metal ? metal.name : "";
                    })
                    .filter(Boolean)
                    .join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition duration-150 ${item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    onClick={() => handleToggleStatus(item.id)}
                  >
                    {item.isActive ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-3 py-2 text-right space-x-2">
                  <Button variant="icon" icon={Pencil} onClick={() => handleEdit(item)} />
                  <Button variant="icon" icon={Trash2} onClick={() => handleDelete(item.id)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">
              {selectedItem ? "Edit Item" : "Add Item"}
            </h3>
            <ItemForm
              metalData={initialDataStore[MASTER_TYPES.METAL] as Metal[]} // ✅ type assertion
              initialData={selectedItem || {}}
              onSave={handleSave}
              onCancel={() => setFormOpen(false)}
            />
          </div>
        </div>
      )}
    </MasterDataScreen>
  );
};

export default ItemMaster;
