const express = require('express');
const router = express.Router();
require("dotenv").config();
const Razorpay = require("razorpay");
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_SECRET,
        });

        const options = {
            amount: 50000, // amount in smallest currency unit
            currency: "INR",
            receipt: uuidv4(),
        };
        const order = await instance.orders.create(options);
        if (!order) return res.status(500).json("Some error occured");

        console.log(order)

        res.json(order);

    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});


router.post("/success", async (req, res) => {
    try {
        // getting the details back from our font-end
        const {
            orderCreationId,
            razorpayPaymentId,
            razorpayOrderId,
            razorpaySignature,
        } = req.body;

        console.log(orderCreationId)
        console.log(razorpayPaymentId)
        console.log(razorpayOrderId)
        console.log(razorpaySignature)

        // Creating our own digest
        // The format should be like this:
        // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
        const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);

        shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

        const digest = shasum.digest("hex");

        console.log(digest)

        // comaparing our digest with the actual signature
        if (digest !== razorpaySignature)
            return res.status(400).json({ msg: "Transaction not legit!" });

        // THE PAYMENT IS LEGIT & VERIFIED
        // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

        res.json({
            msg: "success",
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
});


module.exports = router;