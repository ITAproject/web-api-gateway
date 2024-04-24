const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const env = require('dotenv');
const axios = require("axios");

env.config();

const app = express();
const router = express.Router();

const currentDirectory = process.cwd();

const packageDefinition = protoLoader.loadSync(
     currentDirectory + '/grpc/discount.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const discount_proto = grpc.loadPackageDefinition(packageDefinition);
const client = new discount_proto.DiscountService(process.env.DISCOUNT_SERVICE_URL, grpc.credentials.createInsecure());

router.get('/:productId', (req, res) => {
    console.log(currentDirectory);

    const productId = req.params.productId;
    client.GetDiscount({productId}, async (err, response) => {
        if (err) {
            await axios.post(process.env.TRACKING_SERVICE_URL, { exception: `[Discount service] ${req.method} - ${req.url}: ${err.message}` });
            res.status(500).json({error: err.message});
        } else {
            res.json({discount: response.discount, productId: response.productId});
        }
    });
});

router.post('/', (req, res) => {
    const { productId, discount } = req.body;
    client.SetDiscount({productId, discount}, async (err, response) => {
        if (err) {
            await axios.post(process.env.TRACKING_SERVICE_URL, { exception: `[Discount service] ${req.method} - ${req.url}: ${err.message}` });
            res.status(500).json({error: err.message});
        } else {
            res.json({message: `Discount set for product: ${response.productId}`});
        }
    });
});

router.delete('/:productId', (req, res) => {
    const productId = req.params.productId;
    client.DeleteDiscount({productId}, async (err, response) => {
        if (err) {
            await axios.post(process.env.TRACKING_SERVICE_URL, { exception: `[Discount service] ${req.method} - ${req.url}: ${err.message}` });
            res.status(500).json({error: err.message});
        } else {
            res.json({message: `Discount deleted for product: ${response.productId}`});
        }
    });
});

router.put('/', (req, res) => {
    const { productId, discount } = req.body;
    client.UpdateDiscount({productId, discount}, async (err, response) => {
        if (err) {
            await axios.post(process.env.TRACKING_SERVICE_URL, { exception: `[Discount service] ${req.method} - ${req.url}: ${err.message}` });
            res.status(500).json({error: err.message});
        } else {
            res.json({message: `Discount updated for product: ${response.productId}`});
        }
    });
});

module.exports = router;