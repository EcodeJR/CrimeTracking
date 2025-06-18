// --- server/server.js ---
const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
const { protect } = require("./middleware/authMiddleware");


app.use("/api/auth", require("./routes/authRoutes"));

app.use("/api/criminals", protect, require("./routes/criminalRoutes"));
app.use("/api/suspects", protect, require("./routes/suspectRoutes"));
app.use("/api/complainants", protect, require("./routes/complainantRoutes"));
app.use("/api/stats", protect, require("./routes/statsRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
