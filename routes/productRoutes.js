const express = require('express');
const router = express.Router();
const axios = require('axios');
const env = require('dotenv');

env.config();

const BASE_URL = process.env.PRODUCT_SERVICE_URL;

// Route to get all products
router.get('/', async (req, res) => {
    try {
        const response = await axios.get(BASE_URL);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route to get a product by ID
router.get('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const response = await axios.get(`${BASE_URL}/${productId}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to add a new product
router.post('/', async (req, res) => {
    const product = req.body;
    try {
        const response = await axios.post(BASE_URL, product);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update a product
router.put('/:productId', async (req, res) => {
    const { productId } = req.params;
    const updatedProduct = req.body;
    try {
        const response = await axios.put(`${BASE_URL}/${productId}`, updatedProduct);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to delete a product
router.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        await axios.delete(`${BASE_URL}/${productId}`);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
