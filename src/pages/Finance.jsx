import "../styles/finance.css";
import { useEffect, useState } from "react";
import FinanceEntryForm from "../components/FinanceEntryForm";
import FinanceTable from "../components/FinanceTable";
import { getJournalByRange } from "../api/financeApi";

// Main finance page
export default function Finance() {
  const [entries, setEntries] = useState([]);

  // Load today's entries
  async function loadEntries() {
    const today = new Date().toISOString().slice(0, 10);
    const data = await getJournalByRange(today, today);
    setEntries(data ?? []);
  }

  // Load once on page load
  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <div className="finance-container">
      {/* Form triggers reload after add */}
      <FinanceEntryForm onEntryAdded={loadEntries} />

      {/* Table only displays data */}
      <FinanceTable entries={entries} />
    </div>
  );
}
