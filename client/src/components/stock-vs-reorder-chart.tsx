import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface Product {
  name: string
  stockLevel: number
  reorderPoint: number
}

const StockVsReorderChart = ({ products }: { products: Product[] }) => {
  const data = {
    labels: products.map((product) => product.name),
    datasets: [
      {
        label: "Stock Level",
        data: products.map((product) => product.stockLevel),
        backgroundColor: "#36A2EB",
      },
      {
        label: "Reorder Point",
        data: products.map((product) => product.reorderPoint),
        backgroundColor: "#FF6384",
      },
    ],
  }

  return <Bar data={data} />
}

export default StockVsReorderChart
