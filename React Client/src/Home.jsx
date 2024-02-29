import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { Chart } from 'react-google-charts';

function Home() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [lineChartData, setLineChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  // To Get all Product's data's
  useEffect(() => {
    axios
      .get("http://localhost:3001/product/Productdata")
      .then(result => {
        const formattedProducts = result.data.map(product => {
          return {
            ...product,
            productdate: new Date(product.productdate).toLocaleDateString('en-GB', {
              month: 'short',
              year: 'numeric'
            }),
          };
        });
        setProducts(formattedProducts);

        // Process data for line chart (productdate vs quantityvalue)
        const aggregatedData = {};
        formattedProducts.forEach(product => {
          if (!aggregatedData[product.productdate]) {
            aggregatedData[product.productdate] = 0;
          }
          aggregatedData[product.productdate] += parseInt(product.quantityvalue, 10);
        });

        // Prepare data for Line Chart
        const lineData = [['Month', 'Quantity']];
        Object.keys(aggregatedData).forEach(monthYear => {
          lineData.push([monthYear, aggregatedData[monthYear]]);
        });
        setLineChartData(lineData);

        // Process data for pie chart (productname vs quantityvalue)
        const pieData = [['Product Date', 'Quantity']];
        formattedProducts.forEach(product => {
          pieData.push([product.productdate, parseInt(product.quantityvalue, 10)]);
        });
        setPieChartData(pieData);
      })
      .catch(err => console.log(err));
  }, []);

  const onEditorValueChange = (productKey, value) => {
    setEditingProduct(prevState => ({
      ...prevState,
      [productKey]: value
    }));
  };

  const onEdit = (product) => {
    setEditingProduct({ ...product });
  };

  const onCancelEdit = () => {
    setEditingProduct(null);
  };

  // Save on Updata data in Table
  const onSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/product/UpdateProducts/${editingProduct.id}`, editingProduct);
      setEditingProduct(null);

      // Fetch updated data after save
      axios
        .get("http://localhost:3001/product/Productdata")
        .then(result => {
          const formattedProducts = result.data.map(product => {
            return {
              ...product,
              productdate: new Date(product.productdate).toLocaleDateString('en-GB', {
                month: 'short',
                year: 'numeric'
              }),
            };
          });
          setProducts(formattedProducts);

          // Update line chart data
          const aggregatedData = {};
          formattedProducts.forEach(product => {
            if (!aggregatedData[product.productdate]) {
              aggregatedData[product.productdate] = 0;
            }
            aggregatedData[product.productdate] += parseInt(product.quantityvalue, 10);
          });

          // Prepare data for Line Chart
          const lineData = [['Month', 'Quantity']];
          Object.keys(aggregatedData).forEach(monthYear => {
            lineData.push([monthYear, aggregatedData[monthYear]]);
          });
          setLineChartData(lineData);

          // Update pie chart data
          const pieData = [['Product Name', 'Quantity']];
          formattedProducts.forEach(product => {
            pieData.push([product.productname, parseInt(product.quantityvalue, 10)]);
          });
          setPieChartData(pieData);

        })
        .catch(err => console.log(err));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  // Filter on Table
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  // After edit Save or Cancel button
  const actionTemplate = (rowData) => {
    if (editingProduct && editingProduct.id === rowData.id) {
      return (
        <div>
          <Button icon="pi pi-check" className="p-button-rounded p-button-success" onClick={onSave} iconOnly={true} />&nbsp;
          <Button icon="pi pi-times" className="p-button-rounded p-button-danger" onClick={onCancelEdit} iconOnly={true} />
        </div>
      );
    }

    // Edit button
    return (
      <div>
        <Button icon="pi pi-pencil" className="p-button-rounded p-button-primary" onClick={() => onEdit(rowData)} />
      </div>
    );
  };

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3 style={{ color: 'black' }}>DASHBOARD</h3>
      </div>
      <div className='row charts'>
        {/* Line chart */}
        <div className="col">
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="LineChart"
            loader={<div>Loading Chart</div>}
            data={lineChartData}
            options={{
              title: 'Product Quantity Over Time',
              hAxis: {
                title: 'Product Date',
              },
              vAxis: {
                title: 'Quantity',
              },
              pointSize: 5,
              pointShape: 'circle',
              series: {
                0: {
                  pointSize: 5,
                  animation: {
                    easing: 'out', // Easing function for animation
                    startup: true,
                    duration: 1000,
                  },
                },
              },
              legend: {
                position: 'top',
                alignment: 'center',
                textStyle: {
                  fontSize: 12,
                },
              },
              chartArea: {
                width: '80%',
                height: '70%',
              },
              backgroundColor: '#f9f9f9',
              curveType: 'function',
              lineWidth: 2,
              explorer: {
                actions: ['dragToZoom', 'rightClickToReset'],
                axis: 'horizontal',
                keepInBounds: true,
                maxZoomIn: 10.0,
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />

        </div>
        <div className="col">
        {/* Pie chart */}
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="PieChart"
            loader={<div>Loading Chart</div>}
            data={pieChartData}
            options={{
              title: 'Product Quantity by Month',
              pieSliceBorderColor: '#ffffff',
              pieSliceText: 'label',
              sliceVisibilityThreshold: 0.01,
              legend: {
                position: 'right',
                alignment: 'center',
                textStyle: {
                  fontSize: 12,
                },
              },
              chartArea: {
                width: '80%',
                height: '70%',
              },
              backgroundColor: '#f9f9f9',
              animation: {
                easing: 'out', // Easing function for animation
                startup: true,
                duration: 1000,
              },
            }}
            rootProps={{ 'data-testid': '1' }}
          />

        </div>
      </div><br /><br />
{/* To display Table Data's and Edit Table */}
      <div className='row charts'>
        <div className="col-sm-12">
          <h3 style={{ color: "black" }}>Product Assets</h3>
        </div>
        <div className='col'>
          <a href="/products/create" style={{ float: 'right' }} id="addbtn" className="btn btn-success btn-rounded">Add New</a>
          <div className="flex justify-content-start">
            <span className="p-input-icon-left">
              <i className="pi pi-search" />
              <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
            </span>
          </div>
          <DataTable value={products} paginator rows={5} rowsPerPageOptions={[5, 10, 15]} tableStyle={{ minWidth: '50rem' }}
            emptyMessage="No Products found." filters={filters}
            globalFilterFields={['productname', 'productdate', 'quantityvalue', 'price']}>
            <Column field="id" header="ID" sortable></Column>
            <Column field="productname" header="Product Name" sortable
              editor={(props) => (
                <InputText
                  value={editingProduct ? editingProduct.productname : props.rowData.productname}
                  onChange={(e) => onEditorValueChange('productname', e.target.value)}
                />
              )}
            ></Column>
            <Column field="productdate" header="Product Date" sortable
              editor={(props) => (
                <InputText
                  value={editingProduct ? editingProduct.productdate : props.rowData.productdate}
                  onChange={(e) => onEditorValueChange('productdate', e.target.value)}
                />
              )}
            ></Column>
            <Column field="quantityvalue" header="Quantity" sortable
              editor={(props) => (
                <InputText
                  value={editingProduct ? editingProduct.quantityvalue : props.rowData.quantityvalue}
                  onChange={(e) => onEditorValueChange('quantityvalue', e.target.value)}
                />
              )}
            ></Column>
            <Column field="price" header="Price" sortable
              editor={(props) => (
                <InputText
                  value={editingProduct ? editingProduct.price : props.rowData.price}
                  onChange={(e) => onEditorValueChange('price', e.target.value)}
                />
              )}
            ></Column>
            <Column header="Action" body={actionTemplate}></Column>
          </DataTable>
        </div>
      </div>
    </main>
  );
}

export default Home;
