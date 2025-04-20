import { Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"

ChartJS.register(ArcElement, Tooltip, Legend)

interface Product {
  category: string
  stockLevel: number
}

const StockDistributionChart = ({ products }: { products: Product[] }) => {
  const categories = products.reduce((acc: Record<string, number>, product) => {
    acc[product.category] = (acc[product.category] || 0) + product.stockLevel
    return acc
  }, {})

  const data = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  }

  return <Pie data={data} />
}

export default StockDistributionChart
