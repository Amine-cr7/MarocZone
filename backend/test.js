const fs = require('fs');

// قراءة البيانات القديمة
const oldData = require('./_data/cars.json'); // تأكد من تعديل المسار حسب ملف البيانات الذي لديك

// بناء خرائط id -> category و parentId -> children
const idToCategory = {};
const parentToChildren = {};

oldData.forEach(item => {
  idToCategory[item.name] = item; // بناء الخارطة بين الإسم والفئة
  const parentId = item.parent || 'root'; // تحديد الأب أو الجذر
  if (!parentToChildren[parentId]) {
    parentToChildren[parentId] = [];
  }
  parentToChildren[parentId].push(item); // إضافة الفئة إلى الأب
});

// دالة لبناء الشجرة مع الحقول الخاصة بالسيارات
function buildCategoryTree(parentId) {
  const categories = parentToChildren[parentId] || [];

  return categories.map(category => {
    const children = parentToChildren[category.name] || [];

    return {
      name: category.name,
      subcategories: children.map(sub => {
        const brands = parentToChildren[sub.name] || [];

        return {
          name: sub.name,
          brands: brands.map(brand => {
            const models = parentToChildren[brand.name] || [];

            return {
              name: brand.name,
              models: models.map(model => {
                const modelData = {
                  name: model.name
                };

                // إضافة الحقول الخاصة بالسيارات
                if (model.engineSize) {
                  modelData.engineSize = model.engineSize;
                }

                if (model.fuelType) {
                  modelData.fuelType = model.fuelType;
                }

                if (model.year) {
                  modelData.year = model.year;
                }

                if (model.transmissionType) {
                  modelData.transmissionType = model.transmissionType;
                }

                if (model.mileage) {
                  modelData.mileage = model.mileage;
                }

                return modelData;
              })
            };
          })
        };
      })
    };
  });
}

// بناء الشجرة من الجذر
const newData = buildCategoryTree('root');

// كتابة البيانات الجديدة
fs.writeFileSync('newCarDataWithSpecificFields.json', JSON.stringify(newData, null, 2));

console.log('✅ تم إنشاء ملف newCarDataWithSpecificFields.json بنجاح!');
