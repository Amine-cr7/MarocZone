import React from "react";
import PropTypes from "prop-types";
import { FaChartBar } from "react-icons/fa";

const colorMap = {
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600"
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600"
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600"
  },
  // Add more colors as needed
};

const StatCard = ({ title, value, icon: Icon = FaChartBar, color = "blue" }) => {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full">
      <div className="flex items-center space-x-4">
        <div className={`${colors.bg} p-3 rounded-full`}>
          <Icon className={`${colors.text} text-xl`} />
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType,
  color: PropTypes.string,
};

export default StatCard;