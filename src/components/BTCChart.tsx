"use client";

import { useEffect, useRef } from 'react'
import { init, dispose, Chart } from 'klinecharts'
import axios from 'axios';

interface KlineData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export default function BTCChart() {

  useEffect(() => {

    const chart = init('chart') as Chart

    const fetchInitialData = async () => {
      try {
        const response = await axios.get('https://api.binance.com/api/v3/klines', {
          params: {
            symbol: 'BTCUSDT',  // 코인 심볼
            interval: '1s',     // 1분 간격
            limit: 100,         // 최근 100개의 데이터 가져오기
          },
        });
        console.log(response)

        // Binance API 데이터 형식 변환
        const klineData: KlineData[] = response.data.map((kline: any) => ({
          timestamp: kline[0],          // 타임스탬프 (밀리초)
          open: parseFloat(kline[1]),   // 시가
          high: parseFloat(kline[2]),   // 고가
          low: parseFloat(kline[3]),    // 저가
          close: parseFloat(kline[4]),  // 종가
          volume: parseFloat(kline[5]), // 거래량
        }));
        chart.applyNewData(klineData); // 차트에 데이터 적용
        chart.createIndicator('MA', false, { id: 'candle_pane' });
        chart.createIndicator('VOL');

      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
    ws.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      console.log(message, 'mess')
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

    // console.log(ws)

    return () => {
      // ws.close();
      dispose('chart')
    }
  }, [])

  return <div id="chart" style={{ width: 600, height: 600 }} />
}