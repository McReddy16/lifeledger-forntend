import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getSummaryReport } from "../api/financeApi";

export default function Calculate({ onResult }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* -------------------------
     DATE HELPERS
     ------------------------- */

  // Today → Today
  const todayRange = () => {
    const today = new Date().toISOString().slice(0, 10);
    return { start: today, end: today };
  };

  // Calendar Week → Monday to Today
  const weekRange = () => {
    const today = new Date();

    const currentDay = today.getDay(); // Sunday = 0
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    return {
      start: monday.toISOString().slice(0, 10),
      end: new Date().toISOString().slice(0, 10),
    };
  };

  /* -------------------------
     API TRIGGER
     ------------------------- */

  const fetchSummary = async (start, end) => {
    try {
      const data = await getSummaryReport(start, end);
      onResult(data);
      setOpen(false);
      setMode(null);
    } catch (err) {
      console.error("Summary error:", err);
      alert(err.message);
    }
  };

  return (
    <Box sx={{ px: 2, pt: 2 }}>
      {/* BUTTON */}
      <Button
        variant="contained"
        endIcon={<KeyboardArrowDownIcon />}
        onClick={() => setOpen((prev) => !prev)}
        sx={{ textTransform: "none" }}
      >
        CALCULATE
      </Button>

      {/* PANEL */}
      {open && (
        <Paper sx={{ mt: 2, p: 2, width: 260 }}>
          {/* Today */}
          <Typography
            sx={{ cursor: "pointer", mb: 1 }}
            onClick={() => {
              const r = todayRange();
              fetchSummary(r.start, r.end);
            }}
          >
            Today
          </Typography>

          {/* This Week (Calendar Week) */}
          <Typography
            sx={{ cursor: "pointer", mb: 1 }}
            onClick={() => {
              const r = weekRange();
              fetchSummary(r.start, r.end);
            }}
          >
            This Week
          </Typography>

          {/* Custom */}
          <Typography
            sx={{ cursor: "pointer", mb: 1, color: "#2563eb" }}
            onClick={() => setMode("CUSTOM")}
          >
            Custom Range
          </Typography>

          {mode === "CUSTOM" && (
            <>
              <TextField
                type="date"
                fullWidth
                size="small"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                sx={{ mb: 1 }}
              />

              <TextField
                type="date"
                fullWidth
                size="small"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                sx={{ mb: 1 }}
              />

              <Button
                fullWidth
                variant="contained"
                onClick={() => fetchSummary(startDate, endDate)}
                disabled={!startDate || !endDate}
              >
                Apply
              </Button>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
}