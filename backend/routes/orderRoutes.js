// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const sendOrderEmail = require('../services/mailer');
const initiateSTKPush = require('../services/mpesa');

router.post('/checkout', async (req, res) => {
  const { name, phone, cart } = req.body;
  try {
    const orderSummary = cart.map(item => `${item.name} - KES ${item.price}`).join('\n');

    await sendOrderEmail(name, phone, orderSummary);
    await initiateSTKPush(phone, cart.reduce((sum, item) => sum + item.price, 0));

    res.status(200).json({ success: true, message: 'Order received. Payment initiated.' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Server error. Try again.' });
  }
});

module.exports = router;
