import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProduct = () => {
    const [productname, setProductname] = useState('');
    const [productdate, setProductdate] = useState('');
    const [quantityvalue, setQuantityvalue] = useState('');
    const [price, setPrice] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        let valid = true;
        const errors = {};

        if (!productname) {
            errors.productname = 'Product Name is required';
            valid = false;
        } if (!productdate) {
            errors.productdate = 'Date is required';
            valid = false;
        } if (!quantityvalue) {
            errors.quantityvalue = 'Quantity is required';
            valid = false;
        } if (!price) {
            errors.price = 'Price is required';
            valid = false;
        }
        setErrors(errors);
        return valid;
    };

    //Save for the Product
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const ProductResponse = await axios.post('http://localhost:3001/product/CreateProducts', {
                    productname, productdate, quantityvalue, price,
                });
                console.log('Product submitted:', ProductResponse);
                toast.success(ProductResponse.data.message || 'Product created successfully');
                navigate('/home');
            } catch (error) {
                toast.error(error.response?.data?.message || 'Error during signup. Please try again.');
                console.error(error);
            }
        }
    };
    return (
        <div >
            <div>
                <div>
                    <ToastContainer />
                </div>

            </div>
            <h1 style={{ textAlign: 'center' }}>Add Product's</h1>
            <div>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="/home">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Add Product</li>
                    </ol>
                </nav>
            </div>
            <div className="card-box-emp" style={{ marginTop: '1%' }}>
                {/* Form for Product data's */}
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <label>Product Name:</label>
                            <input type="text" className={`form-control ${errors.productname ? 'is-invalid' : ''}`} value={productname} onChange={(e) => setProductname(e.target.value)} />
                            {errors.productname && <div className="invalid-feedback">{errors.productname}</div>}
                            <br />
                        </div>
                        <div className='col-sm-6'>
                            <label>Product Date:</label>
                            <input type="month" className={`form-control ${errors.productdate ? 'is-invalid' : ''}`} value={productdate} onChange={(e) => setProductdate(e.target.value)} />
                            {errors.productdate && <div className="invalid-feedback">{errors.productdate}</div>}
                            <br />
                        </div>
                        <div className='col-sm-6'>
                            <label>Quantity:</label>
                            <input type="number" className={`form-control ${errors.quantityvalue ? 'is-invalid' : ''}`} value={quantityvalue} onChange={(e) => setQuantityvalue(e.target.value)} />
                            {errors.quantityvalue && <div className="invalid-feedback">{errors.quantityvalue}</div>}
                            <br />
                        </div>
                        <div className='col-sm-3'>
                            <label>Price</label>
                            <input type="number" className={`form-control ${errors.price ? 'is-invalid' : ''}`} value={price} onChange={(e) => setPrice(e.target.value)} />
                            {errors.price && <div className="invalid-feedback">{errors.price}</div>}
                            <br />
                        </div>

                        <div className='row'>
                            <div className='col-sm-8'>
                                <button className='btn btn-primary' type="submit">Save</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CreateProduct
