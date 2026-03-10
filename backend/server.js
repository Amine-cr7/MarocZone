const path = require('path')
const express = require('express');

const morgan = require('morgan')

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });


const cors = require('cors')
const connectDb = require('./config/db');
const { errorHandler } = require('./middlewares/errorMiddleware');
const fileupload = require('express-fileupload');



connectDb()

const port = process.env.PORT || 5000;


const app = express();

app.use(cors());

app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};
app.use(fileupload())
app.use(express.static(path.join(__dirname , 'public')))
const { authRouter, userRouter } = require('./routes/userRoutes');
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/categories',require('./routes/categoryRoutes'));
app.use('/api/subcategories',require('./routes/subcategoryRoutes'));
app.use('/api/fields',require('./routes/fieldTemplateRoutes'));
app.use('/api/ads', require('./routes/adRoutes') )
app.use('/api/tools', require('./routes/search'))
app.use(errorHandler)
app.listen(port, () => console.log('Server Started On Port ' + port));