const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const bcrypt = require('bcrypt');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const FieldTemplate = require('./models/Fieldtemplate');
const User = require('./models/User');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

const importCategories = async () => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'seedData.json'), 'utf-8');
    const categoriesData = JSON.parse(rawData);

    let totalCategories = 0;
    let totalSubcategories = 0;
    let totalFields = 0;

    for (const catData of categoriesData) {
      const { subcategories, ...categoryFields } = catData;

      const category = await Category.findOneAndUpdate(
        { slug: categoryFields.slug },
        categoryFields,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      totalCategories++;

      for (const subData of subcategories) {
        const { fields, ...subcategoryFields } = subData;

        const subcategory = await Subcategory.findOneAndUpdate(
          { slug: subcategoryFields.slug, category: category._id },
          { ...subcategoryFields, category: category._id },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        totalSubcategories++;

        for (const fieldData of fields) {
          await FieldTemplate.findOneAndUpdate(
            { name: fieldData.name, subcategory: subcategory._id },
            { ...fieldData, subcategory: subcategory._id },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          totalFields++;
        }
      }
    }

    console.log('Categories seed completed');
    console.log('Categories     :', totalCategories);
    console.log('Subcategories  :', totalSubcategories);
    console.log('Field Templates:', totalFields);
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err.message);
    process.exit(1);
  }
};

const deleteCategories = async () => {
  try {
    const [fields, subs, cats] = await Promise.all([
      FieldTemplate.deleteMany({}),
      Subcategory.deleteMany({}),
      Category.deleteMany({}),
    ]);

    console.log('Categories collections cleared');
    console.log('FieldTemplates deleted :', fields.deletedCount);
    console.log('Subcategories deleted  :', subs.deletedCount);
    console.log('Categories deleted     :', cats.deletedCount);
    process.exit(0);
  } catch (err) {
    console.error('Delete failed:', err.message);
    process.exit(1);
  }
};

const importAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.email);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    await User.create({
      fullName: 'Super Admin',
      email: process.env.ADMIN_EMAIL ,
      password: hashedPassword,
      phone: process.env.ADMIN_PHONE,
      role: 'admin',
      status: 'active',
      location: {
        city: 'Casablanca',
        region: 'Casablanca-Settat',
      },
    });

    console.log('Admin seeded successfully');
    console.log('Email   :', process.env.ADMIN_EMAIL);
    console.log('Password:', process.env.ADMIN_PASSWORD);
    process.exit(0);
  } catch (err) {
    console.error('Admin seed failed:', err.message);
    process.exit(1);
  }
};

const deleteAdmin = async () => {
  try {
    const result = await User.deleteMany({ role: 'admin' });
    console.log('Admins deleted:', result.deletedCount);
    process.exit(0);
  } catch (err) {
    console.error('Delete admin failed:', err.message);
    process.exit(1);
  }
};

const action = process.argv[2];
const target = process.argv[3];

if (action === '-i' && target === '-categories') {
  importCategories();
} else if (action === '-d' && target === '-categories') {
  deleteCategories();
} else if (action === '-i' && target === '-admin') {
  importAdmin();
} else if (action === '-d' && target === '-admin') {
  deleteAdmin();
} else {
  console.log('Usage:');
  console.log('  node seeder.js -i -categories');
  console.log('  node seeder.js -d -categories');
  console.log('  node seeder.js -i -admin');
  console.log('  node seeder.js -d -admin');
  process.exit(0);
}