const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./backend/routes/orderRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/api/order', orderRoutes);

// Fallback to index.html for any unmatched route (for frontend routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
