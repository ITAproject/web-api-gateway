const express = require('express');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const env = require('dotenv');

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
    client.GetDiscount({productId}, (err, response) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.json({discount: response.discount, productId: response.productId});
        }
    });
});

router.post('/', (req, res) => {
    const { productId, discount } = req.body;
    client.SetDiscount({productId, discount}, (err, response) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.json({message: `Discount set for product: ${response.productId}`});
        }
    });
});

router.delete('/:productId', (req, res) => {
    const productId = req.params.productId;
    client.DeleteDiscount({productId}, (err, response) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.json({message: `Discount deleted for product: ${response.productId}`});
        }
    });
});

router.put('/', (req, res) => {
    const { productId, discount } = req.body;
    client.UpdateDiscount({productId, discount}, (err, response) => {
        if (err) {
            res.status(500).json({error: err.message});
        } else {
            res.json({message: `Discount updated for product: ${response.productId}`});
        }
    });
});

module.exports = router;