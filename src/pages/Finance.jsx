import "../styles/finance.css";
import { useEffect, useState, useCallback } from "react";
import { Box, Paper, Typography } from "@mui/material";
import FinanceEntryForm from "../components/FinanceEntryForm";
import FinanceTable from "../components/FinanceTable";
import Calculate from "../components/Calculate";
import { searchJournalEntries } from "../api/financeApi";

/* =====================================
   HELPER → Convert Date to yyyy-mm-dd
===================================== */
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export default function Finance() {
  /* =========================
     STATE
  ========================= */
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState("entryDate");
  const [order, setOrder] = useState("desc");
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  /* =========================
     FETCH JOURNAL ENTRIES
  ========================= */
  const loadEntries = useCallback(async () => {
    setLoading(true);

    try {
      // 🔥 Load everything (50 years back to 50 years future)
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

      console.log("Search Result:", data);

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

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  /* =========================
     AFTER ENTRY ADDED
  ========================= */
  const handleEntryAdded = () => {
    setPage(0);
    loadEntries();
  };

  return (
    <div className="finance-container">
      {/* ENTRY FORM */}
      <FinanceEntryForm onEntryAdded={handleEntryAdded} />

      {/* CALCULATE */}
      <Calculate onResult={setSummary} />

      {/* SUMMARY */}
      {summary && (
        <Box sx={{ display: "flex", gap: 2, px: 2, mt: 2 }}>
          <Paper sx={{ flex: 1, p: 2, borderRadius: 2 }}>
            <Typography fontWeight={600}>Total IN</Typography>
            <Typography color="green" fontWeight={700}>
              +₹{summary.totalIn?.toLocaleString()}
            </Typography>

            <Typography mt={2} fontWeight={600}>
              Total OUT
            </Typography>
            <Typography color="red" fontWeight={700}>
              -₹{summary.totalOut?.toLocaleString()}
            </Typography>

            <Typography mt={2} fontWeight={600}>
              Net
            </Typography>
            <Typography
              fontWeight={700}
              color={summary.net >= 0 ? "green" : "red"}
            >
              ₹{summary.net?.toLocaleString()}
            </Typography>
          </Paper>

          <Paper
            sx={{
              flex: 1,
              p: 2,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography fontWeight={600}>Net</Typography>
            <Typography
              fontSize={28}
              fontWeight={800}
              color={summary.net >= 0 ? "green" : "red"}
            >
              ₹{summary.net?.toLocaleString()}
            </Typography>
          </Paper>
        </Box>
      )}

      {/* TABLE */}
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
