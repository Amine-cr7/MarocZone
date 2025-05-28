import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  Users, 
  Monitor, 
  Flag, 
  Trash2, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle,
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import {
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllAds,
  deleteAd,
  getAllReports,
  acceptReport,
  deleteReport,
} from "../../features/admin/adminSlice";

const ControlPanel = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const { users, ads, reports, loading, error } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllAds());
    dispatch(getAllReports());
  }, [dispatch]);

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await dispatch(deleteUser(id));
      dispatch(getAllUsers());
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await dispatch(updateUserRole({ _id: id, role: newRole }));
    dispatch(getAllUsers());
  };

  const handleDeleteAd = async (id) => {
    if (window.confirm("Are you sure you want to delete this ad?")) {
      await dispatch(deleteAd(id));
      dispatch(getAllAds());
    }
  };

  const handleAcceptReport = async (id) => {
    if (window.confirm("Are you sure you want to accept this report and delete the associated ad?")) {
      await dispatch(acceptReport(id));
      dispatch(getAllReports());
      dispatch(getAllAds());
    }
  };

  const handleDeleteReport = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      await dispatch(deleteReport(id));
      dispatch(getAllReports());
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = user?.Fullname || '';
    const email = user?.email || '';
    const matchesSearch = fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user?.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const filteredAds = ads.filter(ad => {
    const title = ad?.title || '';
    const description = ad?.description || '';
    return title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const filteredReports = reports.filter(report => {
    const reason = report?.reason || '';
    const details = report?.details || '';
    return reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
           details.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="text-red-800 font-medium">Error occurred</h3>
          </div>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const TabButton = ({ id, label, icon: Icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-blue-600 text-white shadow-lg'
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
        activeTab === id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
      }`}>
        {count}
      </span>
    </button>
  );

  const UserCard = ({ user }) => {
    const fullName = user?.Fullname || 'Unknown';
    const email = user?.email || 'No email';
    const role = user?.role || 'user';
    const userId = user?._id || '';

    return (
      <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {fullName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{fullName}</h3>
                <p className="text-gray-500 text-sm">{email}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                  : 'bg-green-100 text-green-800 border border-green-200'
              }`}>
                {role === 'admin' ? 'Administrator' : 'User'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleRoleChange(userId, role)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Change role"
            >
              <UserCheck className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteUser(userId)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete user"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AdCard = ({ ad }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{ad.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{ad.description}</p>
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>By: {ad.user?.FullName || "Unknown"}</span>
          </div>
        </div>
        <button
          onClick={() => handleDeleteAd(ad._id)}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4"
          title="Delete ad"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  const ReportCard = ({ report }) => (
    <div className="bg-white rounded-xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-200">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <Flag className="h-4 w-4 text-orange-500" />
            <span className="font-medium text-gray-900">{report.reason}</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><span className="font-medium">Reported by:</span> {report.user?.FullName || "Unknown"}</p>
            <p><span className="font-medium">Ad:</span> {report.ad?.title || "Deleted ad"}</p>
            {report.details && (
              <p><span className="font-medium">Details:</span> {report.details}</p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => handleAcceptReport(report._id)}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Accept report"
          >
            <CheckCircle className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteReport(report._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete report"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Manage users, ads, and reports</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <TabButton 
            id="users" 
            label="Users" 
            icon={Users} 
            count={users.length} 
          />
          <TabButton 
            id="ads" 
            label="Ads" 
            icon={Monitor} 
            count={ads.length} 
          />
          <TabButton 
            id="reports" 
            label="Reports" 
            icon={Flag} 
            count={reports.length} 
          />
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'users' && (
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All roles</option>
                  <option value="admin">Admins only</option>
                  <option value="user">Users only</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'users' && (
            <div>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No users found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <UserCard key={user._id} user={user} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ads' && (
            <div>
              {filteredAds.length === 0 ? (
                <div className="text-center py-12">
                  <Monitor className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No ads found.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredAds.map((ad) => (
                    <AdCard key={ad._id} ad={ad} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reports' && (
            <div>
              {filteredReports.length === 0 ? (
                <div className="text-center py-12">
                  <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No reports found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredReports.map((report) => (
                    <ReportCard key={report._id} report={report} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;