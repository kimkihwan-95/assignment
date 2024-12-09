import BTCChart from "@/components/BTCChart";
import OrderBook from "@/components/OrderBook";
import PriceDisplay from "@/components/PriceDisplay";
import Search from "@/components/Search";

export default function Btcusdt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex gap-5 items-start">
        <OrderBook />
        <div className="flex flex-col items-center">
          <BTCChart />
          <PriceDisplay />
        </div>
        <Search />
      </div>
    </div>
  );
}
