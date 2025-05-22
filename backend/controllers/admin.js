const Ad = require("../models/Ad");
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

module.exports = {
  getAdsPerDay,
};
