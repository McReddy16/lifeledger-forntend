import { Box, Typography } from "@mui/material";

export default function SummaryCards({ data }) {
  const cards = [
    { label: "Total Income", value: data?.totalIn },
    { label: "Total Expense", value: data?.totalOut },
    { label: "Net Balance", value: data?.net },
  ];

  console.log(data)
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(3, 1fr)",
        },
        gap: 2,
        px: 2,
        pb: 3,
      }}
    >
      {cards.map((card) => (
        <Box
          key={card.label}
          sx={{
            borderRadius: 2,
            p: 2,
            backgroundColor: "#fff",
            border: "1px solid #e5e7eb",
            minHeight: 100,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "#6b7280",
              textTransform: "uppercase",
              letterSpacing: 0.6,
            }}
          >
            {card.label}
          </Typography>

          <Typography
            sx={{
              mt: 1,
              fontSize: 18,
              fontWeight: 700,
              color:
                card.label === "Net Balance"
                  ? data?.net >= 0
                    ? "green"
                    : "red"
                  : "#111827",
            }}
          >
            ₹ {card.value?.toLocaleString() ?? 0}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}