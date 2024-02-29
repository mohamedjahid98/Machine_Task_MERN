Client (Frontend: React)<br>
	1.npm init vite ->react ->js //optional<br>
	2.npm install //mandatory
	3.npm install bootstrap axios react-router-dom
	4.Go to Signup page to fill the form and relocate the Login page to Put the e-mail and password.
    5.next ,Home page to display product data's for Line Chart, Pie chart and Table 
    6.Initial not data's to show because the db is empty to fill data an to display Line Chart, Pie chart and Table .
    7.Add New button to click to add the product data and display dynamically data in Line Chart, Pie chart and Table.
    8.User Page to display how many user to signup.
    9.Blog page click in my personal portfolio page display.
    10.npm run dev

Server (Backend: Node js, Express) & (Database:Mongodb)
	1.npm init -y //optional
	2.npm i express cors mongoose nodemon // first time install all and next time only npm install
	3.package.json ->     "start": "nodemon index.js" 
	4.Next ,Models folder to create a models name eg:Product.js and next to initialize the value eg:productname,quantity,price ...  
    5.Next,Routes Folder to create a Routes name eg:ProductRoutes.js it's for CRUD operation Declare Get,Getbyid,Create,Update and Delete.
    6.index.js file to import all routes and connect DB.
    7.npm start
