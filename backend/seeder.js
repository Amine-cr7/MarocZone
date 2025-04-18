const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const Category = require('./models/Category');
const fs = require('fs');
const path = require('path');
mongoose.connect(process.env.MONGO_URI);
const informatique = JSON.parse(
  fs.readFileSync(path.join(__dirname, './_data', 'informatique.json'), 'utf-8')
);
const cars = JSON.parse(
  fs.readFileSync(path.join(__dirname, './_data', 'cars.json'), 'utf-8')
);
const importData = async () => {
  try {
    await Category.create(informatique)
    // await Category.create(cars)
    console.log(`✅ ALL DATA IMPORTED`);
    process.exit();
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

const deletedData = async () => {
  try {
    await Category.deleteMany();
    console.log(`🗑️ DELETED Data`);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deletedData();
}
