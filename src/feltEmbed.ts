import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Felt, type FeltController, type FeltEmbedOptions } from "@feltmaps/js-sdk";

export function useFeltEmbed(mapId: string, options?: FeltEmbedOptions) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [felt, setFelt] = useState<FeltController | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !mapRef.current) return;
    loadedRef.current = true;

    Felt.embed(mapRef.current, mapId, options).then(setFelt);
  }, [mapId]);

  return { felt, mapRef };
}

export const FeltContext = createContext<FeltController | null>(null);

export function useFelt() {
  const felt = useContext(FeltContext);
  if (!felt) throw new Error("useFelt must be used within a FeltContext provider");
  return felt;
}
