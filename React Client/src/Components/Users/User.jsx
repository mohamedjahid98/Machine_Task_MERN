import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const User = () => {
  const [users, setUsers] = useState([]);

// To get User data's from Api's
  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/signupdata")
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
        setUsers(formattedUsers);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div><br/>
      <div className='main-title'> 
        <h3 style={{ color: 'black' }}>User Data</h3>
      </div>
      {/* Display Table User details */}
      <DataTable value={users} paginator rows={10} rowsPerPageOptions={[5, 10, 15]} className="p-datatable-striped">
        <Column field="id" header="ID" sortable></Column>
        <Column field="username" header="Username" sortable></Column>
        <Column field="email" header="Email" sortable></Column>
        <Column field="createdDate" header="Created Date" sortable></Column>
      </DataTable>
    </div>
  );
};

export default User;
