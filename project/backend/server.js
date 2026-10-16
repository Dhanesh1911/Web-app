
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(cors({
  origin: "http://localhost:3000"
}));
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "doctor_user",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "doctor_db",
  waitForConnections: true,
  connectionLimit: 10
});

app.get("/", (req, res) => {
  res.json({
    message: "Doctor project backend is running"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "OK",
      backend: "running",
      database: "connected"
    });
  } catch (error) {
    console.error("Database health check failed:", error.message);
    res.status(503).json({
      status: "ERROR",
      database: "unavailable"
    });
  }
});

app.get("/api/doctors", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name, specialty FROM doctors ORDER BY id"
    );
    res.json(rows);
  } catch (error) {
    console.error("Failed to fetch doctors:", error.message);
    res.status(500).json({
      error: "Could not fetch doctors"
    });
  }
});

app.post("/api/doctors", async (req, res) => {
  try {
    const { name, specialty } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof specialty !== "string" ||
      !specialty.trim()
    ) {
      return res.status(400).json({
        error: "Name and specialty are required"
      });
    }

    const [result] = await pool.execute(
      "INSERT INTO doctors (name, specialty) VALUES (?, ?)",
      [name.trim(), specialty.trim()]
    );

    res.status(201).json({
      id: result.insertId,
      name: name.trim(),
      specialty: specialty.trim()
    });
  } catch (error) {
    console.error("Failed to create doctor:", error.message);
    res.status(500).json({
      error: "Could not create doctor"
    });
  }
});

async function startServer() {
  try {
    // Verify database connectivity before accepting requests.
    await pool.query("SELECT 1");

    // Create the example table if it doesn't exist.
    await pool.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        specialty VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();

