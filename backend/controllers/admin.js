const Ad = require("../models/Ad");
const User = require("../models/User");
const asyncHandler = require("express-async-handler");

const getAdsPerDay = asyncHandler(async (req, res) => {
  try {
    const stats = await Ad.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching ads per day:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const getDashboardStats =  asyncHandler(async (req, res) => {
  try {
    const totalAds = await Ad.countDocuments();
    const totalUsers = await User.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysAds = await Ad.countDocuments({
      createdAt: { $gte: today }
    });

    res.status(200).json({
      totalAds,
      totalUsers,
      todaysAds
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const getAdsBySubCategory = asyncHandler(async (req, res) => {
  try {
    const stats = await Ad.aggregate([
      {
        $group: {
          _id: "$subCat",  
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Error fetching ads by sub-category:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all users (for admin panel)
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Delete a user (admin only)
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update user role (admin only)
const updateUserRole = asyncHandler(async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all ads (with filters for admin)
const getAllAds = asyncHandler(async (req, res) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (category) filter.category = category;
    
    const ads = await Ad.find(filter).populate("user", "FullName email");
    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

const deleteAd = asyncHandler(async (req, res) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    console.error("Error deleting ad:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = {
  getAdsPerDay,
  getDashboardStats,
  getAdsBySubCategory,
  getAllUsers,
  deleteUser,
  updateUserRole,
  getAllAds,
  deleteAd,
};
