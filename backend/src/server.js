require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');

const app = express();
app.use(cors());
app.use(express.json({ limit: '5mb' }));

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/apsara_report', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err.message);
});

app.use('/api/customers', customerRoutes);

app.get('/', (req, res) => res.send({ ok: true, message: 'Apsara Report API' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
