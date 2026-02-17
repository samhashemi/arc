import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Layer } from "@feltmaps/js-sdk";
import { LayerToggle } from "./LayerToggle";

type LayerState = Layer & { visible: boolean };

interface DataModalProps {
  layers: LayerState[];
  onToggle: (layerId: string, show: boolean) => void;
  onClose: () => void;
}

export function DataModal({ layers, onToggle, onClose }: DataModalProps) {
  const selectedCount = layers.filter((l) => l.visible).length;
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const query = searchQuery.toLowerCase();
  const filteredLayers = layers.filter(
    (l) =>
      l.name?.toLowerCase().includes(query) ||
      l.caption?.toLowerCase().includes(query),
  );

  return createPortal(
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          width: "90%",
          maxWidth: 480,
          height: "80vh",
          maxHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            padding: "20px 24px 12px",
          }}
        >
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111", margin: 0 }}>
              Select Data Layers
            </h2>
            <span style={{ fontSize: 13, color: "#6b7280", marginTop: 2, display: "block" }}>
              {selectedCount} of {layers.length} selected
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              padding: "6px 16px",
              borderRadius: 6,
            }}
          >
            Done
          </button>
        </div>
        <div style={{ padding: "0 24px 12px", fontSize: 14, color: "#374151", lineHeight: 1.5, borderBottom: "1px solid #e5e7eb" }}>
          <p style={{ margin: "0 0 8px" }}>
            Our latest, most powerful tool to find, visualize, analyze, and export community data.
          </p>
          <p style={{ margin: "0 0 8px" }}>
            Thousands of easy-to-find demographic, education, health, and economic indicators from local, state, and national sources, all in one place, as well as the ability to upload and visualize your own data!
          </p>
          <p style={{ margin: 0 }}>
            Explore neighborhoods, census tracts, zip codes, cities, counties, and more geographies across the state of Georgia.
          </p>
        </div>
        <div style={{ padding: "12px 24px 0" }}>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search layers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              fontSize: 14,
              border: "1px solid #d1d5db",
              borderRadius: 6,
              outline: "none",
            }}
          />
        </div>
        <div style={{ overflowY: "auto", padding: "8px 0" }}>
          {filteredLayers.length === 0 ? (
            <div style={{ padding: "16px 24px", color: "#6b7280", fontSize: 14 }}>
              No layers match "{searchQuery}"
            </div>
          ) : (
            filteredLayers.map((layer) => (
              <LayerToggle
                key={layer.id}
                layer={layer}
                onToggle={onToggle}
              />
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
