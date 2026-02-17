import { useState } from "react";
import type { Layer } from "@feltmaps/js-sdk";

type LayerState = Layer & { visible: boolean };

interface LayerToggleProps {
  layer: LayerState;
  onToggle: (layerId: string, show: boolean) => void;
}

export function LayerToggle({ layer, onToggle }: LayerToggleProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "10px 24px",
        cursor: "pointer",
        background: hovered ? "#f3f4f6" : "transparent",
        transition: "background 0.1s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <input
        type="checkbox"
        checked={layer.visible}
        onChange={() => onToggle(layer.id, !layer.visible)}
        style={{
          marginTop: 3,
          width: 16,
          height: 16,
          accentColor: "#2563eb",
          cursor: "pointer",
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>
          {layer.name}
        </span>
        {layer.caption && (
          <span style={{ fontSize: 12, color: "#6b7280" }}>
            {layer.caption}
          </span>
        )}
      </div>
    </label>
  );
}
