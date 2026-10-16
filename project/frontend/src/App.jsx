
import React, { useCallback, useEffect, useState } from "react";

const API = "http://localhost:5000";

export default function App() {
  const [health, setHealth] = useState("Checking...");
  const [doctors, setDoctors] = useState([]);
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [message, setMessage] = useState("");

  const loadDoctors = useCallback(async () => {
    try {
      const response = await fetch(`${API}/api/doctors`);

      if (!response.ok) {
        throw new Error("Could not load doctors");
      }

      setDoctors(await response.json());
    } catch {
      setMessage("Unable to load doctors. Check the backend.");
    }
  }, []);

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch(`${API}/api/health`);
        const data = await response.json();

        setHealth(
          response.ok
            ? `Backend: ${data.backend}, Database: ${data.database}`
            : "Database unavailable"
        );

        if (response.ok) {
          await loadDoctors();
        }
      } catch {
        setHealth("Backend unavailable");
      }
    }

    checkHealth();
  }, [loadDoctors]);

  async function addDoctor(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`${API}/api/doctors`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, specialty })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to add doctor");
      }

      setDoctors((previous) => [...previous, data]);
      setName("");
      setSpecialty("");
      setMessage("Doctor added successfully!");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <main style={{
      maxWidth: 700,
      margin: "40px auto",
      padding: 24,
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>Doctor Management System</h1>

      <p>
        <strong>System status:</strong> {health}
      </p>

      <h2>Add a Doctor</h2>

      <form onSubmit={addDoctor}>
        <div style={{ marginBottom: 12 }}>
          <input
            required
            placeholder="Doctor name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            style={{ padding: 10, width: "90%" }}
          />
        </div>

        <div style={{ marginBottom: 12 }}>
          <input
            required
            placeholder="Specialty"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            style={{ padding: 10, width: "90%" }}
          />
        </div>

        <button type="submit" style={{ padding: 10 }}>
          Add Doctor
        </button>
      </form>

      {message && <p>{message}</p>}

      <h2>Doctors List</h2>

      {doctors.length === 0 ? (
        <p>No doctors added yet.</p>
      ) : (
        <ul>
          {doctors.map((doctor) => (
            <li key={doctor.id}>
              <strong>{doctor.name}</strong> — {doctor.specialty}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

