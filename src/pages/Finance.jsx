import "../styles/finance.css";
import { useEffect, useState, useCallback } from "react";
import { Box } from "@mui/material";
import FinanceEntryForm from "../components/FinanceEntryForm";
import FinanceTable from "../components/FinanceTable";
import Calculate from "../components/Calculate";
import { searchJournalEntries } from "../api/financeApi";

function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export default function Finance() {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("entryDate");
  const [order, setOrder] = useState("desc");
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    try {
      const start = new Date();
      start.setFullYear(start.getFullYear() - 50);

      const end = new Date();
      end.setFullYear(end.getFullYear() + 50);

      const data = await searchJournalEntries(
        {
          startDate: formatDate(start),
          endDate: formatDate(end),
        },
        page,
        rowsPerPage,
        orderBy,
        order
      );

      setEntries(data?.content ?? []);
      setTotalElements(data?.totalElements ?? 0);
    } catch (err) {
      console.error("Failed to load entries:", err);
      setEntries([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, orderBy, order]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const handleEntryAdded = () => {
    setPage(0);
    loadEntries();
  };

  return (
    <div className="finance-container">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          pt: 2,
        }}
      >
        <FinanceEntryForm onEntryAdded={handleEntryAdded} />
      </Box>

      {/* Summary + Calculate handled internally */}
      <Calculate />

      <FinanceTable
        entries={entries}
        page={page}
        rowsPerPage={rowsPerPage}
        totalElements={totalElements}
        orderBy={orderBy}
        order={order}
        loading={loading}
        onPageChange={setPage}
        onRowsPerPageChange={(size) => {
          setRowsPerPage(size);
          setPage(0);
        }}
        onSortChange={(column) => {
          setOrderBy(column);
          setOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          setPage(0);
        }}
        onRefresh={loadEntries}
      />
    </div>
  );
}