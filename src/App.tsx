import { useState, useCallback, useEffect, useMemo } from "react";
import type { Layer } from "@feltmaps/js-sdk";
import { useFeltEmbed } from "./feltEmbed";
import { DataModal } from "./components/DataModal";
import "./App.css";

const MAP_ID = "nwB1j9CilTkak2n66zCEUfA";

interface LayerState extends Layer {
  visible: boolean;
}

export default function App() {
  const { felt, mapRef } = useFeltEmbed(MAP_ID, {
    uiControls: {
      cooperativeGestures: false,
      showLegend: true,
      fullScreenButton: false,
    },
  });

  const [layers, setLayers] = useState<LayerState[]>([]);
  const [modalOpen, setModalOpen] = useState(true);
  const [tableOpen, setTableOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const visibleLayers = useMemo(() => layers.filter((l) => l.visible), [layers]);

  // On map load: fetch layers, hide all, then reveal map
  useEffect(() => {
    if (!felt) return;

    felt
      .getLayers()
      .then(async (allLayers) => {
        const ids = allLayers.map((l) => l.id);
        if (ids.length > 0) {
          await felt.setLayerVisibility({ hide: ids });
          await felt.setLayerLegendVisibility({ hide: ids });
        }
        setLayers(allLayers.map((l) => ({ ...l, visible: false })));
        setMapReady(true);
      })
      .catch(() => {
        setMapReady(true);
      });
  }, [felt]);

  const handleToggleLayer = useCallback(
    (layerId: string, show: boolean) => {
      if (!felt) return;

      setLayers((prev) =>
        prev.map((l) => (l.id === layerId ? { ...l, visible: show } : l)),
      );

      const key = show ? "show" : "hide";
      felt.setLayerVisibility({ [key]: [layerId] });
      felt.setLayerLegendVisibility({ [key]: [layerId] });
    },
    [felt],
  );

  return (
    <div className="app">
      {mapReady && (
        <div className="top-bar">
          <button
            className="select-data-btn"
            onClick={() => setModalOpen(true)}
          >
            Select Data
          </button>
          {visibleLayers.length > 0 && (
            <button
              className="show-table-btn"
              onClick={() => {
                if (tableOpen) {
                  felt?.hideLayerDataTable();
                  setTableOpen(false);
                } else {
                  felt?.showLayerDataTable({ layerId: visibleLayers[0].id });
                  setTableOpen(true);
                }
              }}
            >
              {tableOpen ? "Hide Table" : "Show Table"}
            </button>
          )}
        </div>
      )}

      <div
        ref={mapRef}
        className={`map-container ${mapReady ? "ready" : ""}`}
      />

      {modalOpen && (
        <DataModal
          layers={layers}
          onToggle={handleToggleLayer}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
