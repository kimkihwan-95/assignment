"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface Coin {
  symbol: string;
  baseAsset: string;
  quoteAsset: string;
}

async function fetchCoins(): Promise<Coin[]> {
  const response = await fetch("https://api.binance.com/api/v3/exchangeInfo");
  const data = await response.json();
  return data.symbols.map((coin: Coin) => ({
    symbol: coin.symbol,
    baseAsset: coin.baseAsset,
    quoteAsset: coin.quoteAsset,
  }));
}

export default function Search() {
  const { data, isLoading } = useQuery({
    queryKey: ["coins"],
    queryFn: fetchCoins,
    staleTime: 1000 * 60 * 5,
  });

  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        Loading...
      </div>
    );
  }

  const filteredCoins = data?.filter((coin) =>
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col p-4 w-[400px] h-[500px] mt-10 shadow-md text-gray-500">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-auto">
        <ul className="space-y-2">
          {filteredCoins?.map((coin) => (
            <li
              key={coin.symbol}
              className="flex justify-between items-center p-2 border-b"
            >
              <div>
                <span>{coin.baseAsset}</span> /{" "}
                {coin.quoteAsset}
              </div>
            </li>
          ))}
          {filteredCoins?.length === 0 && (
            <div className="text-center py-4">
              No coins found
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
