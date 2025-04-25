const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const Category = require('./models/Category');
 
mongoose.connect(process.env.MONGO_URI);


const electronics = JSON.parse(
  fs.readFileSync(path.join(__dirname, './_data', 'electronics.json'), 'utf-8')
);

const importData = async () => {
  try {
    await Category.create(electronics)
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
