"use client";
import React, { useEffect, useRef, useState } from "react";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from "chart.js";
import axios from "axios";
import { Stack } from "@mui/material";

// Register required components
Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

// Helper function to get days in the current month
const getDaysInCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed (0 = January, 11 = December)

  const days = new Date(year, month + 1, 0).getDate(); // Get the last day of the current month
  return Array.from({ length: days }, (_, i) => i + 1); // Create an array [1, 2, ..., days]
};

// Define the TypeScript interface for the API response
interface VoucherData {
  day: number; // Represents the day of the month
  totalExpense: number;
  totalIncome: number;
}

// Extend HTMLCanvasElement to include a 'chart' property
declare global {
  interface HTMLCanvasElement {
    chart?: Chart;
  }
}

const LineChart = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch data from your API
        const { data } = await axios.get<VoucherData[]>("/api/vouchers/last-month");

        // Prepare data for the chart
        const daysInMonth = getDaysInCurrentMonth();
        const expenses = new Array(daysInMonth.length).fill(0); // Default to 0 for all days
        const incomes = new Array(daysInMonth.length).fill(0);

        // Map API data to the arrays
        data.forEach(({ day, totalExpense, totalIncome }) => {
          const index = day - 1; // Adjust day to 0-indexed
          expenses[index] = totalExpense;
          incomes[index] = totalIncome;
        });

        // Update chart data state
        setChartData({
          labels: daysInMonth.map((day) => `${day}`), // X-axis labels
          datasets: [
            {
              label: "Income",
              data: incomes,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
            },
            {
              label: "Expenses",
              data: expenses,
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
          ],
        });
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current && chartData) {
      // Check if there's an existing chart and destroy it before creating a new one
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy(); // Destroy the previous chart instance
      }

      // Create a new chart instance
      const chartInstance = new Chart(chartRef.current, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Monthly Financial Overview",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Days",
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Amount",
              },
            },
          },
        }
      })

      // Store the chart instance in the canvas ref to access it later for destruction
      chartRef.current.chart = chartInstance;
    }
  }, [chartData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return <Stack height={"100%"} width={"100%"} alignItems={"center"}>
    <canvas ref={chartRef} />
  </Stack>;
};

export default LineChart;
