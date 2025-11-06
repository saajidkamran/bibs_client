import { useState } from "react";
import type { CompanyRecord } from "../data/companyTypes";
import { initialCompanyData } from "../data/mockData";

export const useCompanyManager = () => {
  const [data, setData] = useState<CompanyRecord[]>(initialCompanyData);

  const handleSave = (formData: Omit<CompanyRecord, "id">, id?: number) => {
    setData((prev) => {
      let updated = [...prev];
      if (id) {
        const old = prev.find((c) => c.id === id);
        if (!old) return prev;

        const newId = Math.max(...prev.map((c) => c.id)) + 1;
        const archived: CompanyRecord = { ...old, status: "Inactive" };
        const newVersion: CompanyRecord = { ...formData, id: newId, addedBy: "Admin" };

        updated = prev.map((c) =>
          c.id === id
            ? archived
            : newVersion.status === "Active" && c.status === "Active"
              ? { ...c, status: "Inactive" }
              : c,
        );
        updated.push(newVersion);
      } else {
        const newId = Math.max(...prev.map((c) => c.id)) + 1;
        const newCompany: CompanyRecord = { ...formData, id: newId };
        updated =
          newCompany.status === "Active"
            ? prev.map((c) => ({ ...c, status: "Inactive" })).concat(newCompany)
            : [...prev, newCompany];
      }
      return updated;
    });
  };

  return { data, setData, handleSave };
};
