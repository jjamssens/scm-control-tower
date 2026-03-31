// Demand Forecasting module
import { ModulePage } from "@/components/module-page"

export default function ForecastingPage() {
  return (
    <ModulePage
      title="Demand Forecasting"
      status="coming-soon"
      concepts={[
        {
          term: "The Iron Law",
          definition:
            "All forecasts are wrong. The goal is to be wrong in a measurable, manageable way. Forecast error drives safety stock. Smaller error = less buffer needed.",
        },
        {
          term: "Simple Moving Average",
          definition:
            "Average of the last N periods. Easy to compute. Lags badly when demand trends up or down. N=3 is reactive; N=12 is smooth but slow.",
        },
        {
          term: "Exponential Smoothing",
          definition:
            "Weighted average giving more weight to recent data. F(t+1) = α × A(t) + (1-α) × F(t). Alpha close to 1 = highly reactive. Alpha close to 0 = heavily smoothed.",
        },
        {
          term: "MAD — Mean Absolute Deviation",
          definition:
            "Average absolute error across periods. MAD = Σ|actual - forecast| / n. Used to size safety stock: safety stock ≈ Z × 1.25 × MAD.",
        },
        {
          term: "MAPE — Mean Absolute Percentage Error",
          definition:
            "MAD expressed as % of actual demand. Allows comparison across products with different scales. MAPE < 10% is considered good for most supply chain applications.",
        },
        {
          term: "Bias",
          definition:
            "Systematic over- or under-forecasting. Bias = Σ(actual - forecast) / n. Positive bias = you consistently under-forecast. Fix the model, not the safety stock.",
        },
      ]}
      gmAnalog="eBay sell-through rate is demand sensing without forecasting infrastructure. Listing 50 items and watching which sells in 24 hours vs. 30 days IS qualitative demand forecasting. That intuition is what exponential smoothing tries to formalize."
    />
  )
}
