const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const fs = require('fs');
const Category = require('./models/Category');
const Subcategory = require('./models/Subcategory');
const FieldTemplate = require('./models/Fieldtemplate');

// ─── DB Connection ────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => {
    console.error('❌  MongoDB connection error:', err.message);
    process.exit(1);
  });

// ─── Import ───────────────────────────────────────────────────────────────────
const importData = async () => {
  try {
    const rawData = fs.readFileSync(path.join(__dirname, 'seedData.json'), 'utf-8');
    const categoriesData = JSON.parse(rawData);

    let totalCategories = 0;
    let totalSubcategories = 0;
    let totalFields = 0;

    for (const catData of categoriesData) {
      const { subcategories, ...categoryFields } = catData;

      // Upsert category (safe for re-runs)
      const category = await Category.findOneAndUpdate(
        { slug: categoryFields.slug },
        categoryFields,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      totalCategories++;
      console.log(`  📁  Category: ${category.name}`);

      for (const subData of subcategories) {
        const { fields, ...subcategoryFields } = subData;

        // Upsert subcategory linked to parent category
        const subcategory = await Subcategory.findOneAndUpdate(
          { slug: subcategoryFields.slug, category: category._id },
          { ...subcategoryFields, category: category._id },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        totalSubcategories++;
        console.log(`    📂  Subcategory: ${subcategory.name}`);

        // Upsert each field template linked to the subcategory
        for (const fieldData of fields) {
          await FieldTemplate.findOneAndUpdate(
            { name: fieldData.name, subcategory: subcategory._id },
            { ...fieldData, subcategory: subcategory._id },
            { upsert: true, new: true, setDefaultsOnInsert: true }
          );
          totalFields++;
        }
        console.log(`       ✏️   Inserted/updated ${fields.length} field templates`);
      }
    }

    console.log('\n─────────────────────────────────────────────');
    console.log(`✅  Seed completed successfully!`);
    console.log(`   Categories   : ${totalCategories}`);
    console.log(`   Subcategories: ${totalSubcategories}`);
    console.log(`   Field Templates: ${totalFields}`);
    console.log('─────────────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌  Import failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

// ─── Delete ───────────────────────────────────────────────────────────────────
const deleteData = async () => {
  try {
    console.log('🗑️   Deleting all seed data...');

    const [fields, subs, cats] = await Promise.all([
      FieldTemplate.deleteMany({}),
      Subcategory.deleteMany({}),
      Category.deleteMany({}),
    ]);

    console.log('\n─────────────────────────────────────────────');
    console.log('✅  All collections cleared!');
    console.log(`   FieldTemplates deleted : ${fields.deletedCount}`);
    console.log(`   Subcategories deleted  : ${subs.deletedCount}`);
    console.log(`   Categories deleted     : ${cats.deletedCount}`);
    console.log('─────────────────────────────────────────────\n');

    process.exit(0);
  } catch (err) {
    console.error('❌  Delete failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
};

// ─── CLI Entry Point ──────────────────────────────────────────────────────────
if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
} else {
  console.log('Usage:');
  console.log('  node seeder.js -i   →  Import seed data');
  console.log('  node seeder.js -d   →  Delete all data');
  process.exit(0);
}