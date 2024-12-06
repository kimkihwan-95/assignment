declare module 'klinecharts' {
  export function init(id: string): Chart;
  export function dispose(id: string): void;

  export interface Chart {
    applyNewData(data: Array<{
      timestamp: number;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }>): void;

    updateData(data: {
      timestamp: number;
      open: number;
      high: number;
      low: number;
      close: number;
      volume: number;
    }): void;

    createIndicator(
      name?: string,
      isStack?: boolean,
      options?: Record<string, any>
    ): void;

    dispose(): void;
  }
}
