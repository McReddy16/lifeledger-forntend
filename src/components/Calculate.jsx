import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Modal,
  Fade,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { getSummaryReport } from "../api/financeApi";
import SummaryCards from "./SummaryCards";

export default function Calculate() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  /* ===============================
     DATE HELPERS
  ================================= */

  const todayRange = () => {
    const today = new Date().toISOString().slice(0, 10);
    return { start: today, end: today };
  };

  const weekRange = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diffToMonday = currentDay === 0 ? -6 : 1 - currentDay;

    const monday = new Date(today);
    monday.setDate(today.getDate() + diffToMonday);

    return {
      start: monday.toISOString().slice(0, 10),
      end: new Date().toISOString().slice(0, 10),
    };
  };

  /* ===============================
     FETCH SUMMARY
  ================================= */

  const fetchSummary = async (start, end) => {
    console.log("Fetching summary for:", start, end);
    try {
      setLoading(true);
      const response = await getSummaryReport(start, end);

      // If backend wraps inside data object, adjust here
      const data = response?.data ?? response;
console.log(data)
      setSummary(data);
      setOpen(false);
      setMode(null);
    } catch (err) {
      console.error("Summary fetch error:", err);
      alert("Failed to load summary");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     AUTO LOAD TODAY
  ================================= */

  useEffect(() => {
    const r = todayRange();
    fetchSummary(r.start, r.end);
  }, []);

  return (
    <>
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          SUMMARY
        </Typography>

        <Button
          variant="contained"
          endIcon={<KeyboardArrowDownIcon />}
          onClick={() => setOpen(true)}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            px: 3,
          }}
        >
          CALCULATE
        </Button>
      </Box>

      {/* LOADER */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {/* SUMMARY CARDS */}
      {!loading && summary && <SummaryCards data={summary} />}

      {/* MODAL */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 300 } }}
      >
        <Fade in={open}>
          <Box
            sx={{
              width: 340,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 3,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Select Range
            </Typography>

            <Typography
              sx={{ cursor: "pointer", mb: 1 }}
              onClick={() => {
                const r = todayRange();
                fetchSummary(r.start, r.end);
              }}
            >
              Today
            </Typography>

            <Typography
              sx={{ cursor: "pointer", mb: 1 }}
              onClick={() => {
                const r = weekRange();
                fetchSummary(r.start, r.end);
              }}
            >
              This Week
            </Typography>

            <Typography
              sx={{ cursor: "pointer", mb: 2, color: "primary.main" }}
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
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  disabled={!startDate || !endDate || loading}
                  onClick={() => fetchSummary(startDate, endDate)}
                >
                  Apply
                </Button>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
}