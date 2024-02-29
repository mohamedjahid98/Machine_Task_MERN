const express = require('express');
const router = express.Router();
const ProductsModel = require('../Models/Products');

// Unique Id Create
async function getNextId() {
    const lastusers = await ProductsModel.findOne({}, {}, { sort: { 'id': -1 } });
    return (lastusers && lastusers.id) ? lastusers.id + 1 : 1;
}

// All Product data 
router.get('/Productdata', (req, res) => {
    ProductsModel.find({})
    .then(products=>res.json(products))
    .catch(err=>res.json(err))
});

// Product Get by Id 
router.get('/getProducts/:id', (req, res) => {
    const id = req.params.id;
    ProductsModel.findOne({ id: id }, { _id: 0, __v: 0 })
        .then(products => {
            if (products) {
                res.json({ id: products.id, quantityvalue: products.quantityvalue});
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        })
        .catch(err => res.json(err));
});

// Create Product 
router.post('/CreateProducts', async (req, res) => {
        try {
        req.body.createdDate = new Date();
        const newProducts = await ProductsModel.create({
            ...req.body,
            id: await getNextId()
        });

        res.json({ success: true, message: 'Products Added Successfully ', Products: newProducts });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Internal server error', error: err.message });
    }
});

// Update Product
router.put('/UpdateProducts/:id', (req, res) => {
    const id = req.params.id;
    req.body.updatedDate = new Date();
    ProductsModel.findOneAndUpdate({ id: id }, req.body, { new: true })
        .then(products => res.json(products))
        .catch(err => res.json(err));
});

// Delete Product
router.delete('/deleteProducts/:id', (req, res) => {
    const id =req.params.id;
    ProductsModel.findByIdAndDelete({_id:id})
    .then(res=>res.json(res))
    .catch(err=>res.json(err))
});

module.exports = router;
