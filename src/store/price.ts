import { create } from "zustand";

interface OrderBookState {
  selectedPrice: number | null;
  setSelectedPrice: (price: number) => void;
  viewMode: "both" | "bids" | "asks";
  setViewMode: (mode: "both" | "bids" | "asks") => void;
}

const useOrderBookStore = create<OrderBookState>((set) => ({
  selectedPrice: null,
  setSelectedPrice: (price) => set({ selectedPrice: price }),
  viewMode: "both",
  setViewMode: (mode) => set({ viewMode: mode }),
}));

export default useOrderBookStore;
