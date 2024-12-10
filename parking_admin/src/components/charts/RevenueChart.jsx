import { useQuery } from "@tanstack/react-query";
import { Bar } from "react-chartjs-2";

import { getParkingSpots } from "../../api";
import ErrorComponent from "../ErrorComponent";
import Loading from "../Loading";

const RevenueChart = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["spots"],
    queryFn: getParkingSpots,
  });

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return <ErrorComponent label="Parking Places" error={error} />;
  }

  const freeSpots = data.data.filter((spot) => spot.isFree);
  const nonFreeSpots = data.data.filter((spot) => !spot.isFree);

  const spotNames = nonFreeSpots.map((spot) => spot.name);
  const spotRevenues = nonFreeSpots.map((spot) => spot.revenue);

  const chartData = {
    labels: spotNames,
    color: "white",
    datasets: [
      {
        label: "Total Revenue",
        data: spotRevenues,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          color: "white",
          display: true,
          text: "Total Revenue",
          font: {
            size: 18, // Increase the font size for the y-axis title
          },
        },
      },
      x: {
        title: {
          display: true,
          text: "Parking Places",
          color: "white",
          font: {
            size: 18, // Increase the font size for the x-axis title
          },
        },
        ticks: {
          color: "rgb(203 213 225)",
          font: {
            size: 14, // Increase the font size for the x-axis tick labels (dates)
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: "white",
          font: {
            size: 14, // Increase the font size for the legend labels
          },
        },
      },
      title: {
        display: true,
        text: "Total Revenue of Parking Places",
        color: "white",
        font: {
          size: 20, // Increase the font size for the chart title
        },
      },
    },
  };

  return (
    <div className="w-full">
      {freeSpots.length > 0 && (
        <div className="mb-4">
          <h3 className="text-white text-xl mb-2">Free Parking Spots</h3>
          <ul>
            {freeSpots.map((spot) => (
              <li key={spot._id} className="text-white">
                {spot.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {nonFreeSpots.length > 0 ? (
        <Bar data={chartData} options={chartOptions} />
      ) : (
        <p className="text-white">No non-free parking spots available.</p>
      )}
    </div>
  );
};

export default RevenueChart;
