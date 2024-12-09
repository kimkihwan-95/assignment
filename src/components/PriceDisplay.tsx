"use client";

import { useState, useEffect } from "react";
import useOrderBookStore from "@/store/price";

export default function BuyAndSell() {
  const selectedPrice = useOrderBookStore((state) => state.selectedPrice);

  const [buyPrice, setBuyPrice] = useState<number | string>(selectedPrice || "");
  const [buyAmount, setBuyAmount] = useState<number | string>("");

  const [sellPrice, setSellPrice] = useState<number | string>(selectedPrice || "");
  const [sellAmount, setSellAmount] = useState<number | string>("");

  useEffect(() => {
    if (selectedPrice) {
      setBuyPrice(selectedPrice);
      setSellPrice(selectedPrice);
    }
  }, [selectedPrice]);

  return (
    <div className="flex gap-2 p-4 h-[300px] w-[800px]">
      <div className="flex-1">
        <h2 className="text-lg font-bold text-green-500 mb-4">Buy</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-white">Price</label>
            <input
              type="number"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-200 text-gray-700"
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Amount</label>
            <input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-green-200 text-gray-700"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <button className="w-full py-3 mt-4 text-white bg-green-500 rounded hover:bg-green-600">
          Buy
        </button>
      </div>

      <div className="flex-1">
        <h2 className="text-lg font-bold text-red-500 mb-4">Sell</h2>
        <div className="space-y-2">
          <div>
            <label className="block text-sm font-medium text-white">Price</label>
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-red-200 text-gray-700"
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white">Amount</label>
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:ring-red-200 text-gray-700"
              placeholder="Enter amount"
            />
          </div>
        </div>
        <button className="w-full py-3 mt-4 text-white bg-red-500 rounded hover:bg-red-600 ">
          Sell
        </button>
      </div>
    </div>
  );
}
