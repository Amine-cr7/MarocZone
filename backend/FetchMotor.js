const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const connectDb = require('./config/db'); 
const Category = require('./models/Category'); 
const path = require('path')

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const brands = [
  "Honda", "Kawasaki", "Yamaha", "BMW", "Suzuki", "Ducati", "Harley-Davidson", 
  "Triumph", "KTM", "Aprilia", "Moto Guzzi", "Indian Motorcycle", "MV Agusta", 
  "Bajaj", "Royal Enfield", "Honda", "Kawasaki", "Yamaha", "BMW", "Ducati"
];

const models = {
  "Honda": ["CBR 600", "CBR 1000RR", "CB500F", "CRF 450R", "CBR 250R"],
  "Kawasaki": ["Ninja ZX-6R", "Z1000", "Ninja 400", "KX250", "Versys 650"],
  "Yamaha": ["R6", "R1", "MT-09", "YZF-R3", "FZ-07"],
  "BMW": ["S1000RR", "R1250GS", "K1600GTL", "F900R", "G310R"],
  "Suzuki": ["GSX-R1000", "Hayabusa", "V-Strom 650", "SV650", "GSX250R"],
  "Ducati": ["Panigale V4", "Monster 821", "Scrambler 800", "Diavel 1260", "Multistrada V4"],
  "Harley-Davidson": ["Iron 883", "Fat Boy", "Street Glide", "Road King", "Heritage Softail"],
  "Triumph": ["Bonneville T120", "Street Triple", "Tiger 900", "Rocket 3", "Speed Triple"],
  "KTM": ["RC 390", "Duke 390", "790 Adventure", "125 Duke", "390 Adventure"],
  "Aprilia": ["RS 660", "Tuono V4", "RSV4", "Shiver 900", "Dorsoduro 900"],
  "Moto Guzzi": ["V85 TT", "California Touring 1400", "V7 III", "Eldorado", "Griso 1200"],
  "Indian Motorcycle": ["Scout Bobber", "Chieftain Dark Horse", "Chief Vintage", "FTR 1200", "Roadmaster"],
  "MV Agusta": ["F3 800", "Brutale 800", "Dragster 800", "Turismo Veloce", "Rush 1000"]
};


async function generateData(num) {
    let data = [];
    
      const vehicleCategory = await Category.findOne({ name: "Vehicle"});

    for (let i = 0; i < num; i++) {
      const brandIndex = Math.floor(Math.random() * brands.length);
      const brand = brands[brandIndex];
      const model = models[brand] && models[brand].length > 0
        ? models[brand][Math.floor(Math.random() * models[brand].length)]
        : null;
  

      if (!brand || !model) {
        console.warn(`Skipped invalid brand or model for index: ${i}`);
        continue; 
      }
    
       const Motorsycles = await Category.create({
            name: 'Motor',
            parent : vehicleCategory._id
        })
      const brandCategory = new Category({
        name: brand,
        parent: Motorsycles._id,
      });
  
      try {
        await brandCategory.save(); 
  
        const modelCategory = new Category({
          name: model,
          parent: brandCategory._id, 
        });
  
        await modelCategory.save(); 
        data.push({ brand: brandCategory, model: modelCategory });
  
      } catch (err) {
        console.error(`❌ Error saving brand or model for index: ${i}`, err);
      }
    }
  
    return data;
  }
  


const start = async () => {
  try {
    await connectDb();
    console.log('✅ Connected to MongoDB');
    
    const generatedData = await generateData(50); 
    console.log("✅ Data generation completed.");

  } catch (err) {
    console.error("❌ Error during data generation:", err);
  } finally {
    await mongoose.disconnect(); 
  }
};

start();
