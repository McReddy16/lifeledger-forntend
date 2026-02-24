import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { deleteJournalEntry, updateJournalEntry } from "../api/financeApi";

/* =========================
   DATE FORMATTER
   ========================= */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

/* ==================================================
   FINANCE TABLE (UI ONLY)
   - Sorting & pagination are BACKEND driven
   ================================================== */
export default function FinanceTable({
  entries,
  page,
  rowsPerPage,
  totalElements,
  orderBy,
  order,
  loading,
  onPageChange,
  onRowsPerPageChange,
  onSortChange,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingDescription, setEditingDescription] = useState("");

  /* DELETE */
  async function handleDelete(id) {
    if (!window.confirm("Delete this entry?")) return;
    await deleteJournalEntry(id);
    window.location.reload(); // acceptable for now
  }

  /* SAVE EDIT */
  async function handleSave(entry) {
    await updateJournalEntry(entry.id, {
      ...entry,
      description: editingDescription,
    });
    setEditingId(null);
    window.location.reload();
  }

  return (
    <Paper sx={{ borderRadius: 3, overflow: "hidden" }}>
      {/* =========================
         HEADER BAR (Entries + Calculate)
         ========================= */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Typography fontSize={18} fontWeight={600}>
          ENTRIES
        </Typography>

        
      </Box>

      {/* =========================
         TABLE
         ========================= */}
      <TableContainer>
        <Table size="small">
          {/* ---------- HEADER ---------- */}
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f1f5f9" }}>
              {[
                { key: "entryDate", label: "Date" },
                { key: "category", label: "Category" },
                { key: "description", label: "Description" },
                { key: "amount", label: "Amount", align: "right" },
                { key: "moneyFlow", label: "Flow", align: "center" },
              ].map((col) => (
                <TableCell
                  key={col.key}
                  align={col.align || "left"}
                  sx={{
                    fontWeight: 700,
                    fontSize: 13,
                    textTransform: "uppercase",
                    borderRight: "1px solid #e5e7eb",
                  }}
                >
                  <TableSortLabel
                    active={orderBy === col.key}
                    direction={orderBy === col.key ? order : "asc"}
                    onClick={() => onSortChange(col.key)}
                  >
                    {col.label}
                  </TableSortLabel>
                </TableCell>
              ))}

              <TableCell
                sx={{
                  fontWeight: 700,
                  fontSize: 13,
                  borderRight: "1px solid #e5e7eb",
                }}
              >
                Payment
              </TableCell>

              <TableCell align="center" sx={{ fontWeight: 700, fontSize: 13 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          {/* ---------- BODY ---------- */}
          <TableBody>
            {entries.map((e) => (
              <TableRow key={e.id} hover>
                {/* DATE */}
                <TableCell sx={{ borderRight: "1px solid #e5e7eb" }}>
                  {formatDate(e.entryDate)}
                </TableCell>

                {/* CATEGORY */}
                <TableCell sx={{ borderRight: "1px solid #e5e7eb" }}>
                  {e.category}
                </TableCell>

                {/* DESCRIPTION */}
                <TableCell
                  sx={{
                    borderRight: "1px solid #e5e7eb",
                    maxWidth: 260,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {editingId === e.id ? (
                    <>
                      <input
                        value={editingDescription}
                        onChange={(ev) =>
                          setEditingDescription(ev.target.value)
                        }
                        style={{ width: "65%" }}
                      />
                      <FaCheck
                        style={{ marginLeft: 8, cursor: "pointer" }}
                        onClick={() => handleSave(e)}
                      />
                      <FaTimes
                        style={{ marginLeft: 6, cursor: "pointer" }}
                        onClick={() => setEditingId(null)}
                      />
                    </>
                  ) : (
                    e.description
                  )}
                </TableCell>

                {/* AMOUNT */}
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    borderRight: "1px solid #e5e7eb",
                  }}
                >
                  {e.amount}
                </TableCell>

                {/* FLOW */}
                <TableCell
                  align="center"
                  sx={{ borderRight: "1px solid #e5e7eb" }}
                >
                  <span
                    style={{
                      padding: "4px 14px",
                      borderRadius: 999,
                      fontWeight: 600,
                      fontSize: 13,
                      background:
                        e.moneyFlow === "IN" ? "#dcfce7" : "#fee2e2",
                      color:
                        e.moneyFlow === "IN" ? "#166534" : "#991b1b",
                    }}
                  >
                    {e.moneyFlow === "IN" ? "+" : "-"}
                  </span>
                </TableCell>

                {/* PAYMENT */}
                <TableCell sx={{ borderRight: "1px solid #e5e7eb" }}>
                  {e.paymentType}
                </TableCell>

                {/* ACTION */}
                <TableCell align="center">
                  <FaEdit
                    style={{
                      color: "#2563eb",
                      cursor: "pointer",
                      marginRight: 10,
                    }}
                    onClick={() => {
                      setEditingId(e.id);
                      setEditingDescription(e.description);
                    }}
                  />
                  <FaTrash
                    style={{ color: "#dc2626", cursor: "pointer" }}
                    onClick={() => handleDelete(e.id)}
                  />
                </TableCell>
              </TableRow>
            ))}

            {loading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  Loading…
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* =========================
         PAGINATION (BACKEND)
         ========================= */}
      <TablePagination
        component="div"
        count={totalElements}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        rowsPerPageOptions={[5, 10, 25, 50]}
      />
    </Paper>
  );
}
