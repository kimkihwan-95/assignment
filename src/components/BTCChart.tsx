"use client";

import { useEffect, useRef } from "react";
import { init, dispose, Chart } from "klinecharts";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const intervals = [
  { label: "1 s", value: "1s" },
  { label: "1 M", value: "1m" },
  { label: "1 H", value: "1h" },
  { label: "1 Day", value: "1d" },
  { label: "1 Week", value: "1w" },
  { label: "1 Month", value: "1M" },
];

const fetchKlineData = async (interval: string): Promise<KlineData[]> => {
  const response = await axios.get("https://api.binance.com/api/v3/klines", {
    params: {
      symbol: "BTCUSDT",
      interval,
      limit: 100,
    },
  });

  return response.data.map((kline: any) => ({
    timestamp: kline[0],
    open: parseFloat(kline[1]),
    high: parseFloat(kline[2]),
    low: parseFloat(kline[3]),
    close: parseFloat(kline[4]),
    volume: parseFloat(kline[5]),
  }));
};

export default function BTCChart() {
  const chartRef = useRef<Chart | null>(null);
  const [selectedInterval, setSelectedInterval] = useState("1s");

  const { data: klineData, isLoading } = useQuery({
    queryKey: ["klineData", selectedInterval],
    queryFn: () => fetchKlineData(selectedInterval),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    const chart = init("chart") as Chart;
    chartRef.current = chart;

    if (klineData) {
      chart.applyNewData(klineData);
      chart.createIndicator("MA", false);
    }

    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m");
    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      const kline = message.k;

      const newKline: KlineData = {
        timestamp: kline.t,
        open: parseFloat(kline.o),
        high: parseFloat(kline.h),
        low: parseFloat(kline.l),
        close: parseFloat(kline.c),
        volume: parseFloat(kline.v),
      };

      chart.updateData(newKline);
    };

    return () => {
      dispose("chart");
      ws.close();
    };
  }, [klineData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4 flex justify-center space-x-4">
        {intervals.map((interval) => (
          <button
            key={interval.value}
            className={`px-4 py-2 ${selectedInterval === interval.value
              ? " text-white"
              : "text-gray-500"
              }`}
            onClick={() => setSelectedInterval(interval.value)}
          >
            {interval.label}
          </button>
        ))}
      </div>
      <div id="chart" style={{ width: 800, height: 500 }} />
    </div>
  );
}
