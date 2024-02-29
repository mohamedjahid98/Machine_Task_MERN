import React, { useState, useEffect } from 'react';
import { FcElectronics } from "react-icons/fc"; import { GiTravelDress } from "react-icons/gi";
import { IoFastFoodSharp } from "react-icons/io5"; import { MdOutlineMiscellaneousServices, MdOutlineEdit, MdOutlineDeleteOutline } from "react-icons/md";
import axios from 'axios'; import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'; import { FaRegFileExcel, FaRegFilePdf, FaRegFileWord } from "react-icons/fa";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Productdata = () => {
  const [electroCount, setElectro] = useState([]);
  const [fashionCount, setFashion] = useState([]);
  const [foodsCount, setFood] = useState([]);
  const [serviceCount, setServices] = useState([]);
  const [productdata, setProduct] = useState([]);
  const [categoryMaster, setCategorymaster] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rowsPerPage, setRowsPerPage] = useState(2);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    axios.get("http://localhost:3001/product/productsdata")
      .then(result => {
        const formattedUsers = result.data.map(user => {
          return {
            ...user,
            createdDate: new Date(user.createdDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }),
          };
        });
        setProduct(formattedUsers);

        const electroCount = formattedUsers.filter(item => item.category === 'Electronics').length;
        const fashionCount = formattedUsers.filter(item => item.category === 'Fashion').length;
        const foodsCount = formattedUsers.filter(item => item.category === 'Food & Drinks').length;
        const serviceCount = formattedUsers.filter(item => item.category === 'Services').length;

        setElectro(electroCount);
        setFashion(fashionCount);
        setFood(foodsCount);
        setServices(serviceCount);
      })
      .catch(err => console.log(err));
  }, []);

  const handleExport = async (format) => {
    switch (format) {
      case 'excel':
        exportToExcel();
        break;
      case 'pdf':
        await handleExportToPDF();
        break;
      case 'word':
        await exportToWord();
        break;
      default:
        break;
    }
  };

  //Download Pdf
  const handleExportToPDF = () => {
    const pdf = new jsPDF();

    pdf.text('Product Data', 10, 10);

    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Product Name', dataKey: 'protname' },
      { header: 'Brand Name', dataKey: 'brandname' },
      { header: 'Category', dataKey: 'category' },
      { header: 'Sales Price', dataKey: 'saleprice' },
      { header: 'Regular price', dataKey: 'regprice' },
      { header: 'Quantity Stock', dataKey: 'quanstack' },
      { header: 'Unit', dataKey: 'unit' },
      { header: 'Stock Status', dataKey: 'stockstatus' },
      { header: 'Created Date', dataKey: 'createdDate' },
    ];

    const rows = productdata.map(item => ({
      id: item.id,
      protname: item.protname,
      brandname: item.brandname,
      category: item.category,
      saleprice: item.saleprice,
      regprice: item.regprice,
      quanstack: item.quanstack,
      unit: item.unit,
      stockstatus: item.stockstatus,
      createdDate: item.createdDate,
    }));

    pdf.autoTable({
      head: [columns.map(column => column.header)],
      body: rows.map(row => columns.map(column => row[column.dataKey])),
      startY: 20,
    });

    pdf.save('Product Data.pdf');
  };


  //Download Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(productdata);
    worksheet['!cols'] = [{ wpx: 20 }, { wpx: 20 }, { wpx: 20 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 80 }, { wpx: 100 }, { wpx: 120 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'productdata');
    const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace("T", "_").split(".")[0];
    const filename = `Product Data-${timestamp}.xlsx`;
    XLSX.writeFile(workbook, filename);
  };


  useEffect(() => {
    axios.get("http://localhost:3001/category/categorydata")
      .then(result => setCategorymaster(result.data))
      .catch(err => console.log(err))
  }, []);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete('http://localhost:3001/product/deleteProducts/' + id)
          .then(res => {
            console.log(res);
            window.location.reload();
          })
          .catch(err => console.log(err));
      }
    });
  };

  const filteredProducts = selectedCategory === 'All'
    ? productdata
    : productdata.filter((item) => item.category === selectedCategory);

  const filteredAndSearchedProducts = filteredProducts.filter((item) => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    return (
      item.protname.toLowerCase().includes(searchTermLowerCase) ||
      item.brandname.toLowerCase().includes(searchTermLowerCase) ||
      item.category.toLowerCase().includes(searchTermLowerCase) ||
      item.stockstatus.toLowerCase().includes(searchTermLowerCase)
    );
  });

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
  };


  const getBadgeColor = (stockStatus) => {
    switch (stockStatus) {
      case 'On-Demand':
        return 'bg-info text-white'; // Light Blue
      case 'In-Stock':
        return 'bg-success text-white'; // Green
      case 'Low-Inventery':
        return 'bg-warning text-dark'; // Yellow
      case 'Out-Of-Stock':
        return 'bg-danger text-white'; // Red
      case 'Temporarily-Unavailable':
        return 'bg-secondary text-white'; // Grey
      default:
        return 'bg-secondary text-white'; // Default to grey for unknown status
    }
  };


  return (
    <div>
      <main className='main-container'>
        <div className='main-title'>
          <h3 style={{ color: 'black' }}>Top Products</h3>
        </div>

        <div className='main-cards'>
          <div className='card1'>
            <div className='card-inner'>
              <h6>ELECTRONICS</h6>
              <FcElectronics className='card_icon' />
            </div>
            <h1>{electroCount}</h1>
          </div>
          <div className='card1'>
            <div className='card-inner'>
              <h6>FASHION</h6>
              <GiTravelDress className='card_icon' />
            </div>
            <h1>{fashionCount}</h1>
          </div>
          <div className='card1'>
            <div className='card-inner'>
              <h6>FOODS & DRIKNS</h6>
              <IoFastFoodSharp className='card_icon' />
            </div>
            <h1>{foodsCount}</h1>
          </div>
          <div className='card1'>
            <div className='card-inner'>
              <h6>SERVICE</h6>
              <MdOutlineMiscellaneousServices className='card_icon' />
            </div>
            <h1>{serviceCount}</h1>
          </div>
        </div>
        <div className='row'>
          <div className='col-sm-4'>
            <label>Filter by Category: </label>
            <select id="categoryFilter" className="form-control" style={{ appearance: 'menulist', WebkitAppearance: 'menulist' }} onChange={handleCategoryChange} value={selectedCategory}>
              <option value="All">All</option>
              {categoryMaster.map(category => (
                <option key={category.id} value={category.categoryname}>
                  {category.categoryname}
                </option>
              ))}
            </select>
          </div>
          <div className='col-sm-3'><br />
            <input type="search" className="form-control" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className='col-sm-5'><br />
            <a href="/products/create" style={{ float: 'right' }} id="addbtn" className="btn btn-success btn-rounded">Add New</a>
          </div>
        </div><br />
        <div className='row'>
          <div className='col' style={{ maxHeight: '300px', overflowY: 'auto' }}>
            <h4 style={{ color: "black" }}>Products Data</h4>

            {filteredProducts.length === 0 ? (
              <p style={{ color: "black" }}>No products found for the selected category.</p>
            ) : (
              <table className='table table-bordered table-striped'>
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Product Name</th>
                    <th>Brand Name</th>
                    <th>Category</th>
                    <th>Sales Price</th>
                    <th>Stock Status</th>
                    <th>Created Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSearchedProducts.slice(0, rowsPerPage).map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.protname}</td>
                      <td>{item.brandname}</td>
                      <td>{item.category}</td>
                      <td>{item.saleprice}</td>
                      <td><span className={`badge ${getBadgeColor(item.stockstatus)}`}>{item.stockstatus}</span></td>
                      <td>{item.createdDate}</td>
                      <td style={{ fontSize: '2em', marginBottom: "10%" }}>
                        <Link to={`/products/update/${item.id}`}>
                          <MdOutlineEdit />
                        </Link>
                        &nbsp;
                        <MdOutlineDeleteOutline color='red' style={{ cursor: 'pointer' }} onClick={() => handleDelete(item._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <div className='col-sm-1'>
            <select className="form-control" onChange={handleRowsPerPageChange} value={rowsPerPage} style={{ appearance: 'menulist', WebkitAppearance: 'menulist' }}>
              <option value={2}>2</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select><br />
            <div className="btn-group">
              <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                Export
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => handleExport('excel')}><FaRegFileExcel /> Excel</button></li>
                <li><button className="dropdown-item" onClick={handleExportToPDF}><FaRegFilePdf /> PDF</button></li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Productdata;