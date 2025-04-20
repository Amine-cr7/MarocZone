const mongoose = require("mongoose");
const connectDb = require("./config/db");
const Category = require("./models/Category");
const path = require('path')

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const importCarsFromBack4App = async () => {

  const vehicleCategory = await Category.create({ name: "Vehicle"});

  let skip = 0;
  const limit = 10000;
  const allCars = {};

  while (true) {
    const res = await fetch(`https://parseapi.back4app.com/classes/Car_Model_List?limit=${limit}&skip=${skip}`, {
      headers: {
        "X-Parse-Application-Id": "hlhoNKjOvEhqzcVAJ1lxjicJLZNVv36GdbboZj3Z",
        "X-Parse-Master-Key": "SNMJJF0CZZhTPhLDIqGhTlUNV9r60M2Z5spyWfXW",
      },
    });

    const data = await res.json();
    if (data.results.length === 0) break;

    data.results.forEach((car) => {
      const brand = car.Make || "Unknown";
      const model = car.Model || "Unknown";

      if (!allCars[brand]) {
        allCars[brand] = new Set();
      }
      allCars[brand].add(model);
    });

    skip += limit;
  }
    const Car = await Category.create({
      name: 'Car',
      parent : vehicleCategory._id
        })
  for (const brand in allCars) {
    const brandCategory = await Category.create({
      name: brand,
      parent: Car._id,
    });

    const modelPromises = Array.from(allCars[brand]).map(model =>
      Category.create({
        name: model,
        parent: brandCategory._id,
      })
    );

    await Promise.all(modelPromises);
  }

  console.log("✅ All car data has been successfully imported into Category > Vehicle.");

  // غلق الاتصال بقاعدة البيانات
  await mongoose.disconnect();
};

const start = async () => {
  try {
    await connectDb(); // تأكد من الاتصال
    console.log("✅ Connected to MongoDB");
    await importCarsFromBack4App(); // ثم نفذ الإدخال
  } catch (err) {
    console.error("❌ Error during import:", err);
    process.exit(1);
  }
};

start();
