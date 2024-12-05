require('dotenv').config()
const express = require('express');
const sequelize = require('./config/database');
const Item = require('./models/Item'); // Import Item model
const app = express();
const itemRoutes = require('./routes/itemRoutes'); // Import item routes
const bodyParser = require("body-parser")
const cors = require('cors');
const PORT = 3000;

// console.log(process.env.DATABASE_NAME)
app.use(cors({ origin: true }));

// app.use(express.json()); // for parsing JSON requests
// app.use(bodyParser.urlencoded({ extended: true })); // for parsing URL-encoded requests

app.use(bodyParser.json());

// Sync the database (this will create the 'items' table if it doesn't exist)
sequelize.sync()
    .then(() => console.log('Database synced and Item table created'))
    .catch(err => console.error('Error syncing database:', err));


// Use item routes
app.use('/items', itemRoutes);

// app.get('/', (req, res) => {
//     res.send('Welcome to the Item Inventory System');
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});