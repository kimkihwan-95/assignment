"use client";

import { useEffect, useRef, useState } from "react";
import { init, dispose, Chart } from "klinecharts";
import axios from "axios";

interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

const intervals = [
  { label: "1 Minute", value: "1m" },
  { label: "1 Hour", value: "1h" },
  { label: "1 Day", value: "1d" },
  { label: "1 Week", value: "1w" },
  { label: "1 Month", value: "1M" },
];

export default function BTCChart() {
  const chartRef = useRef<Chart | null>(null);
  const [selectedInterval, setSelectedInterval] = useState("1h");

  useEffect(() => {
    const chart = init("chart") as Chart;
    chartRef.current = chart;

    const fetchKlineData = async (interval: string) => {
      try {
        const response = await axios.get("https://api.binance.com/api/v3/klines", {
          params: {
            symbol: "BTCUSDT",
            interval,
            limit: 100, // 최근 100개의 데이터 가져오기
          },
        });

        const klineData: KlineData[] = response.data.map((kline: any) => ({
          timestamp: kline[0],
          open: parseFloat(kline[1]),
          high: parseFloat(kline[2]),
          low: parseFloat(kline[3]),
          close: parseFloat(kline[4]),
          volume: parseFloat(kline[5]),
        }));

        chart.applyNewData(klineData);
        chart.createIndicator("MA", false); // MA(이동평균선) 추가
      } catch (error) {
        console.error("Error fetching kline data:", error);
      }
    };

    fetchKlineData(selectedInterval);

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
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

      chart.updateData(newKline); // 실시간 데이터로 차트 업데이트
    };

    return () => {
      dispose("chart");
      ws.close();
    };
  }, [selectedInterval]);

  return (
    <div>
      <div className="mb-4 flex justify-center space-x-4">
        {intervals.map((interval) => (
          <button
            key={interval.value}
            className={`px-4 py-2 ${selectedInterval === interval.value
              ? "bg-500 text-white"
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
