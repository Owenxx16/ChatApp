const express = require('express');
const app = express();
require('dotenv').config();
const authRoutes = require('./routes/auth.route');
const PORT = process.env.PORT || 5000;
const connectDB = require('./lib/db');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});