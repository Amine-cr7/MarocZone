import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChartAdsPerDay from "./ChartAds-Per-Day";
import StatCard from "./StatCard";
import { FaAd, FaCalendarDay, FaUser } from "react-icons/fa";
import { getDashboardStats } from "../../features/admin/adminSlice";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ChartSubCategory from "./ChartSubCategory";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(getDashboardStats());
  }, [dispatch]);

  // if (loading) {
  //   return (
  //     <div className="p-4">
  //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
  //         {[1, 2, 3].map((item) => (
  //           <Skeleton key={item} height={100} />
  //         ))}
  //       </div>
  //       <Skeleton height={400} className="mb-6" />
  //       <Skeleton height={300} />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-4">No data available</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Ads"
          value={stats.totalAds}
          icon={FaAd}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={FaUser}
          color="green"
        />
        <StatCard
          title="Today's Ads"
          value={stats.todaysAds}
          icon={FaCalendarDay}
          color="purple"
        />
      </div>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ flex: "0 0 60%" }}>
          <ChartAdsPerDay />
        </div>
        <div style={{ flex: "0 0 40%" }}>
          <ChartSubCategory />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
