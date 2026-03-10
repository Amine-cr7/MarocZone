const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [50, "Full name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^(\+212|0)([ \-]?\d){9}$/, "Please provide a valid Moroccan phone number"],
    },
    location: {
      city: { type: String, trim: true },
      region: {
        type: String,
        enum: [
          "Casablanca-Settat",
          "Rabat-Salé-Kénitra",
          "Marrakech-Safi",
          "Fès-Meknès",
          "Tanger-Tétouan-Al Hoceïma",
          "Souss-Massa",
          "Oriental",
          "Béni Mellal-Khénifra",
          "Drâa-Tafilalet",
          "Guelmim-Oued Noun",
        ],
      },
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);