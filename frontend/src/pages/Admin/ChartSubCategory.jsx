import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdsBySubCategory } from "../../features/admin/adminSlice";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaChartPie, FaExclamationTriangle, FaRedo } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042", 
  "#A569BD", "#F1948A", "#5DADE2", "#58D68D",
  "#F7DC6F", "#BB8FCE", "#85C1E9", "#F8C471"
];

const ChartSubCategory = () => {
  const dispatch = useDispatch();
  const { adsBySubCategory, loading, error } = useSelector((state) => state.admin);

  const fetchData = useCallback(() => {
    dispatch(getAdsBySubCategory());
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{`${payload[0].name || 'Unspecified'}`}</p>
          <p className="text-blue-600">
            <span className="font-medium">Count: </span>
            {`${payload[0].value} ads`}
          </p>
          <p className="text-gray-600 text-sm">
            {`${((payload[0].value / adsBySubCategory?.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label formatter
  const renderCustomLabel = (entry) => {
    const total = adsBySubCategory?.reduce((sum, item) => sum + item.count, 0) || 0;
    const percentage = ((entry.count / total) * 100).toFixed(1);
    return percentage > 5 ? `${percentage}%` : ''; // Only show label if slice is > 5%
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-[450px] flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
          <Skeleton height={24} width={200} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="space-y-3 text-center">
            <Skeleton circle height={200} width={200} />
            <div className="space-y-2">
              <Skeleton height={16} width={120} />
              <Skeleton height={16} width={100} />
              <Skeleton height={16} width={140} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-[450px] flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
          <FaChartPie className="text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">Ads by Subcategory</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto" />
            <div>
              <h3 className="text-lg font-medium text-gray-900">Unable to load chart</h3>
              <p className="text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <FaRedo className="text-xs" />
              <span>Retry</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!adsBySubCategory || adsBySubCategory.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-[450px] flex flex-col">
        <div className="flex items-center space-x-2 mb-4">
          <FaChartPie className="text-gray-400" />
          <h2 className="text-lg font-semibold text-gray-800">Ads by Subcategory</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="text-gray-400 text-6xl">📊</div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">No Data Available</h3>
              <p className="text-gray-500 mt-1">No subcategory data to display</p>
            </div>
            <button
              onClick={fetchData}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              <FaRedo className="text-xs" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total for summary
  const totalAds = adsBySubCategory.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[450px] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FaChartPie className="text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Ads by Subcategory</h2>
        </div>
        <div className="text-sm text-gray-500">
          Total: {totalAds} ads
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={adsBySubCategory}
              dataKey="count"
              nameKey="_id"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={30}
              paddingAngle={2}
              label={renderCustomLabel}
              labelLine={false}
            >
              {adsBySubCategory.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={customTooltip} />
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              formatter={(value) => value || 'Unspecified'}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      {adsBySubCategory.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Categories: {adsBySubCategory.length}</span>
            <span>
              Top: {adsBySubCategory.reduce((max, item) => 
                item.count > max.count ? item : max, adsBySubCategory[0]
              )?._id || 'N/A'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartSubCategory;