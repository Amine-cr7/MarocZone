import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdsPerDay } from "../../features/admin/adminSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, isValid } from "date-fns";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { ads, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getAdsPerDay());
  }, [dispatch]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );

  const chartData = ads
    .map((item) => {
      const rawDate = item._id;
      const parsedDate = new Date(`${rawDate}T00:00:00Z`); // ← تصحيح توقيت ISO
      return {
        date: isValid(parsedDate)
          ? format(parsedDate, "MMM dd, yyyy")
          : "Invalid date",
        count: item.count,
        rawDate: parsedDate,
      };
    })
    .filter((item) => item.date !== "Invalid date")
    .sort((a, b) => a.rawDate - b.rawDate);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Daily Ads Analytics</h1>

      {/* Chart Section */}
      <div
        className="bg-white p-4 rounded-lg shadow-md mb-6"
        style={{ height: "400px" }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              label={{
                value: "Date",
                position: "insideBottomRight",
                offset: -5,
              }}
            />
            <YAxis
              label={{
                value: "Number of Ads",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip
              formatter={(value) => [`${value} ads`, "Count"]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="count"
              fill="#8884d8"
              name="Ads Count"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table Section */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Detailed Statistics</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ads Count
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {chartData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
                    {item.date}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {item.count}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
