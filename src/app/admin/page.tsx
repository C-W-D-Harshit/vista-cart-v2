"use client";

import "@/styles/admin/overview.scss";
import { Separator } from "@radix-ui/react-separator";
import { AiFillFire, AiOutlineShoppingCart } from "react-icons/ai";
import { FiBarChart2 } from "react-icons/fi";
import { Bar, Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  PointElement,
  LineElement,
} from "chart.js";
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler
);

const options = {
  responsive: true,
  tension: 0.5,
  plugins: {
    legend: {
      position: "top" as const,
      display: false,
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Noverber",
  "December",
];

const days_of_week = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const data = {
  labels,
  datasets: [
    {
      label: "Sales",
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: "#5c59e8",
    },
  ],
};

const Page = () => {
  const { theme, setTheme } = useTheme();
  const dat = {
    labels: days_of_week,
    datasets: [
      {
        fill: true,
        label: "Dataset 2",
        data: labels.map(() => faker.number.int({ min: 1000, max: 500000 })),
        borderColor: "#5c59e8",
        pointColor: "#5c59e8",
        backgroundColor: theme === "dark" ? "#2e2d74" : "#dedefa",
      },
    ],
  };

  const opts = {
    responsive: true,
    tension: 0.7,
    plugins: {
      legend: {
        position: "top" as const,
        display: false,
      },
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
    },
  };
  return (
    <div className="adminOverview">
      <div className="adminOverview_top">
        <div>
          <div>
            <AiOutlineShoppingCart />
          </div>
          <div>
            <p>Orders Completed</p>
            <p>1.27k</p>
          </div>
        </div>
        <div className="vertical-seprator" />
        <div className="purple">
          <div>
            <AiOutlineShoppingCart />
          </div>
          <div>
            <p>Total Revenue Made</p>
            <p>₹168k</p>
          </div>
        </div>
        <div className="vertical-seprator" />
        <div className="blue">
          <div>
            <AiOutlineShoppingCart />
          </div>
          <div>
            <p>Total Store Visits</p>
            <p>2.7m</p>
          </div>
        </div>
        <div className="vertical-seprator" />
        <div className="red">
          <div>
            <AiOutlineShoppingCart />
          </div>
          <div>
            <p>Total Sales Made</p>
            <p>52,712</p>
          </div>
        </div>
      </div>
      <div className="adminOverview_">
        <div className="adminOverview_chart">
          <div>
            <div>
              <p>Revenue this week</p>
              <p>₹80,792</p>
            </div>
            <div>
              <FiBarChart2 />
            </div>
          </div>
          <div>
            {/* <Bar options={options} data={data} /> */}
            <Line options={opts} data={dat} />
          </div>
        </div>
        <div></div>
        <div className="adminOverview_chart">
          <div>
            <div>
              <p>Sales this year</p>
              <p>87932</p>
            </div>
            <div>
              <AiFillFire />
            </div>
          </div>
          <div>
            <Bar options={options} data={data} />
            {/* <Line options={opts} data={dat} /> */}
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
