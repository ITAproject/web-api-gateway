const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const discountRoutes = require('./routes/discountRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const env = require('dotenv');

env.config();

const app = express();
const port = 3003;



app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Routes
app.use('/products', require('./routes/productRoutes'));
app.use('/discounts', require('./routes/discountRoutes'));
app.use('/notifications', require('./routes/notificationRoutes'));



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
