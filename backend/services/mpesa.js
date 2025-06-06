// backend/services/mpesa.js
const axios = require('axios');
const moment = require('moment');
const base64 = require('base-64');

const initiateSTKPush = async (phone, amount) => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = base64.encode(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`);

  // Get access token
  const tokenRes = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    {
      headers: {
        Authorization: 'Basic ' + base64.encode(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`)
      }
    }
  );

  const accessToken = tokenRes.data.access_token;

  // Initiate STK Push
  await axios.post(
    'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phone,
      CallBackURL: process.env.MPESA_CALLBACK,
      AccountReference: 'AgTanHotel',
      TransactionDesc: 'Food Order Payment'
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  );
};

module.exports = initiateSTKPush;
