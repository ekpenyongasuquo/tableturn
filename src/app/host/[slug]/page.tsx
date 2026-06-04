"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Table = {
  id: string;
  label: string;
  capacity: number;
  status: string;
};

type Party = {
  id: string;
  name: string;
  size: number;
  status: string;
  quoted_wait: number;
  joined_at: string;
};

type Restaurant = {
  id: string;
  name: string;
  slug: string;
};

export default function HostDashboard() {
  const params = useParams();
  const slug = params.slug as string;

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [parties, setParties] = useState<Party[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParty, setSelectedParty] = useState<Party | null>(null);
  const [seating, setSeating] = useState(false);
  const [message, setMessage] = useState("");

  const fetchQueue = async () => {
    try {
      const res = await fetch(`/api/queue/${slug}`);
      const data = await res.json();
      setRestaurant(data.restaurant);
      setParties(data.parties);
      setTables(data.tables);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [slug]);

  const freeTable = async (tableId: string, tableLabel: string) => {
    try {
      const res = await fetch(`/api/table/${tableId}/free`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✓ ${tableLabel} is now available`);
        fetchQueue();
      } else {
        setMessage(`✗ ${data.error}`);
      }
    } catch (err) {
      setMessage("✗ Something went wrong");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const seatParty = async (tableId: string) => {
    if (!selectedParty) return;
    setSeating(true);
    try {
      const res = await fetch(`/api/party/${selectedParty.id}/seat`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_id: tableId }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✓ ${selectedParty.name} seated successfully`);
        setSelectedParty(null);
        fetchQueue();
      } else {
        setMessage(`✗ ${data.error}`);
      }
    } catch (err) {
      setMessage("✗ Something went wrong");
    } finally {
      setSeating(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const removeParty = async (partyId: string, partyName: string) => {
    try {
      const res = await fetch(`/api/party/${partyId}/remove`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✓ ${partyName} removed from queue`);
        fetchQueue();
      }
    } catch (err) {
      setMessage("✗ Something went wrong");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const availableTables = tables.filter(
    (t) =>
      t.status === "available" &&
      selectedParty &&
      t.capacity >= selectedParty.size
  );

  const waitTime = (joinedAt: string) => {
    const diff = Math.floor(
      (Date.now() - new Date(joinedAt).getTime()) / 60000
    );
    return diff < 1 ? "Just arrived" : `${diff} min ago`;
  };

  if (loading) {
    return (
      <div style={{ background: "#080C14", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#00D4FF", fontFamily: "monospace" }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "#080C14", minHeight: "100vh", color: "#E8EDF5", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#0D1420", borderBottom: "1px solid #1A2535", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 32, background: "#00D4FF", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, color: "#080C14", fontSize: 16 }}>T</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>TableTurn</div>
            <div style={{ fontSize: 12, color: "#5A6A80" }}>{restaurant?.name}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 8px #00FF88" }} />
          <span style={{ fontSize: 13, color: "#5A6A80" }}>Live · updates every 5s</span>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div style={{ background: message.startsWith("✓") ? "#00FF8822" : "#FF3B5C22", border: `1px solid ${message.startsWith("✓") ? "#00FF88" : "#FF3B5C"}`, color: message.startsWith("✓") ? "#00FF88" : "#FF3B5C", padding: "12px 24px", textAlign: "center", fontSize: 14, fontWeight: 600 }}>
          {message}
        </div>
      )}

      <div style={{ padding: 24, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, maxWidth: 1200, margin: "0 auto" }}>

        {/* Waitlist */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>
              Waiting Queue
              <span style={{ marginLeft: 8, background: "#00D4FF22", color: "#00D4FF", fontSize: 12, padding: "2px 8px", borderRadius: 20 }}>{parties.length}</span>
            </h2>
          </div>

          {parties.length === 0 ? (
            <div style={{ background: "#0D1420", border: "1px solid #1A2535", borderRadius: 12, padding: 40, textAlign: "center", color: "#5A6A80" }}>
              No parties waiting
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {parties.map((party, index) => (
                <div key={party.id}
                  style={{ background: selectedParty?.id === party.id ? "#00D4FF15" : "#0D1420", border: `1px solid ${selectedParty?.id === party.id ? "#00D4FF" : "#1A2535"}`, borderRadius: 12, padding: 16, cursor: "pointer", transition: "all 0.2s" }}
                  onClick={() => setSelectedParty(selectedParty?.id === party.id ? null : party)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ background: "#1A2535", color: "#5A6A80", fontSize: 11, fontWeight: 700, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{index + 1}</span>
                        <span style={{ fontWeight: 600, fontSize: 15 }}>{party.name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: "#5A6A80", marginLeft: 30 }}>
                        {party.size} {party.size === 1 ? "person" : "people"} · {waitTime(party.joined_at)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeParty(party.id, party.name); }}
                      style={{ background: "transparent", border: "1px solid #1A2535", color: "#5A6A80", padding: "4px 10px", borderRadius: 6, fontSize: 12, cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>

                  {selectedParty?.id === party.id && (
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #1A2535" }}>
                      <div style={{ fontSize: 12, color: "#00D4FF", marginBottom: 8, fontWeight: 600 }}>
                        Select a table for {party.name}:
                      </div>
                      {availableTables.length === 0 ? (
                        <div style={{ fontSize: 12, color: "#FF3B5C" }}>No available tables fit this party size</div>
                      ) : (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {availableTables.map((table) => (
                            <button key={table.id}
                              onClick={(e) => { e.stopPropagation(); seatParty(table.id); }}
                              disabled={seating}
                              style={{ background: "#00D4FF22", border: "1px solid #00D4FF", color: "#00D4FF", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", fontWeight: 600 }}>
                              {table.label} (seats {table.capacity})
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tables */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, marginTop: 0 }}>
            Tables
            <span style={{ marginLeft: 8, background: "#00FF8822", color: "#00FF88", fontSize: 12, padding: "2px 8px", borderRadius: 20 }}>
              {tables.filter(t => t.status === "available").length} available
            </span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {tables.map((table) => (
              <div key={table.id} style={{ background: "#0D1420", border: `1px solid ${table.status === "available" ? "#00FF8840" : "#FF3B5C40"}`, borderRadius: 12, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{table.label}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: table.status === "available" ? "#00FF8820" : "#FF3B5C20", color: table.status === "available" ? "#00FF88" : "#FF3B5C" }}>
                    {table.status.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: "#5A6A80" }}>Seats {table.capacity}</div>
                  {table.status === "occupied" && (
                    <button
                      onClick={() => freeTable(table.id, table.label)}
                      style={{ background: "#00FF8820", border: "1px solid #00FF88", color: "#00FF88", padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                      Free Table
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}