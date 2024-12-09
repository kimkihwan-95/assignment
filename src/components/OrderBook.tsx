"use client";

import { useQuery } from "@tanstack/react-query";
import useOrderBookStore from "@/store/price";
import { useEffect, useState } from "react";

interface Order {
  price: number;
  quantity: number;
}

interface OrderBookResponse {
  bids: [string, string][];
  asks: [string, string][];
}

async function fetchOrderBook(): Promise<{ bids: Order[]; asks: Order[] }> {
  const response = await fetch("https://api.binance.com/api/v3/depth?symbol=BTCUSDT&limit=20");
  const data: OrderBookResponse = await response.json();

  const bids: Order[] = data.bids.map(([price, quantity]) => ({
    price: parseFloat(price),
    quantity: parseFloat(quantity),
  }));

  const asks: Order[] = data.asks.map(([price, quantity]) => ({
    price: parseFloat(price),
    quantity: parseFloat(quantity),
  }));

  return { bids, asks };
}

export default function OrderBook() {
  const { data, isLoading } = useQuery({
    queryKey: ["orderBook"],
    queryFn: fetchOrderBook,
    refetchInterval: 1000,
  });

  const setSelectedPrice = useOrderBookStore((state) => state.setSelectedPrice);
  const viewMode = useOrderBookStore((state) => state.viewMode);
  const setViewMode = useOrderBookStore((state) => state.setViewMode);

  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [previousPrice, setPreviousPrice] = useState<number | null>(null);

  useEffect(() => {
    if (data?.bids && data?.asks) {
      const highestBid = data.bids[0].price;
      const lowestAsk = data.asks[0].price;
      const newPrice = (highestBid + lowestAsk) / 2;

      setPreviousPrice(currentPrice);
      setCurrentPrice(newPrice);
    }
  }, [data]);

  const handlePriceClick = (price: number) => {
    setSelectedPrice(price);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col p-4 overflow-hidden w-[300px] h-[600px]">

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setViewMode("both")}
          className={`px-4 py-2 bg-gradient-to-r from-green-500 to-red-500 rounded w-[20px]`}
        ></button>
        <button
          onClick={() => setViewMode("bids")}
          className={`px-4 py-2 bg-green-500 rounded w-[20px]`}
        ></button>
        <button
          onClick={() => setViewMode("asks")}
          className={`px-4 py-2 bg-red-500 rounded w-[20px]`}
        ></button>
      </div>

      <div className="mb-4 flex justify-between items-center text-lg font-bold">
        {currentPrice !== null && (
          <span
            className={`flex items-center ${
              currentPrice > (previousPrice || 0)
                ? "text-green-500"
                : currentPrice < (previousPrice || 0)
                ? "text-red-500"
                : "text-gray-500"
            }`}
          >
            {currentPrice.toFixed(2)}{" "}
            {currentPrice > (previousPrice || 0) && <span className="ml-1">&uarr;</span>}
            {currentPrice < (previousPrice || 0) && <span className="ml-1">&darr;</span>}
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2 mb-2 text-center font-bold text-gray-500 text-sm">
        <div >Price</div>
        <div >Amount</div>
        <div >Total</div>
      </div>

      <div className="h-[400px] overflow-auto">
        <ul className="space-y-1">
          {(viewMode === "both" || viewMode === "bids") &&
            data?.bids.map((bid, index) => (
              <li
                key={index}
                className="grid grid-cols-3 gap-2 py-1 text-xs cursor-pointer"
                onClick={() => handlePriceClick(bid.price)}
              >
                <span className="text-green-500 text-center">{bid.price.toFixed(2)}</span>
                <span className="text-center">{bid.quantity.toFixed(4)}</span>
                <span className="text-center">{(bid.price * bid.quantity).toFixed(2)}</span>
              </li>
            ))}
          {(viewMode === "both" || viewMode === "asks") &&
            data?.asks.map((ask, index) => (
              <li
                key={index}
                className="grid grid-cols-3 gap-2 py-1 text-xs cursor-pointer"
                onClick={() => handlePriceClick(ask.price)}
              >
                <span className="text-red-500 text-center">{ask.price.toFixed(2)}</span>
                <span className="text-center">{ask.quantity.toFixed(4)}</span>
                <span className="text-center">{(ask.price * ask.quantity).toFixed(2)}</span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
