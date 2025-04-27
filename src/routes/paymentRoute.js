const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Add your Razorpay Key ID in .env
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Add your Razorpay Key Secret in .env
});

// Route to create an order
router.post('/create-order', async (req, res) => {
    const { amount } = req.body;
    try {
        const options = {
            amount: amount * 100, // Convert to smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        };
        const order = await razorpayInstance.orders.create(options);

        // Log the necessary details if the order is successful
        console.log('Order created successfully:');
        console.log(`Order ID: ${order.id}`);
        console.log(`Amount: ${order.amount}`);
        console.log(`Currency: ${order.currency}`);
        console.log(`Receipt: ${order.receipt}`);
        console.log(`Status: ${order.status}`);

        res.status(200).json(order);
    } catch (error) {
        console.error('Error creating Razorpay order:', error); // Log the error
        res.status(500).json({ error: 'Failed to create order', details: error.message });
    }
});

// Route to verify payment (optional, for added security)
router.post('/verify-payment', (req, res) => {
    const crypto = require('crypto');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (generatedSignature === razorpay_signature) {
        res.status(200).json({ message: 'Payment verified successfully' });
    } else {
        res.status(400).json({ error: 'Invalid signature' });
    }
});

module.exports = router;