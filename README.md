# Balistos API
This repository holds API backend for Balistos, YouTube playlist sharing app. 
This app has a frontend counterpart written in React framework.
You can find it at [Balistos-React GitHub repository](https://github.com/neyko5/balistos-react).

This app uses:

* Node.js
* Express.js
* Socket.io
* JWT tokens
* Sequelize.js
* MySql database
* CORS middleware

To use this app, follow these steps:

1. Create local mysql database and name it 'balistos'. Create an user that has read and write access to that database.
2. In folder database you will find script 'empty.sql' for creating database. Import it into you newly created database.
3. Copy file '.env.example' to create new file '.env'. Enter database credentials and endpoint. Set a random string for SECRET parameter.
4. Run node command '**npm install**' to install all necessary node.js modules.
5. Run app with '**npm run dev**'. App will by default start listening to port 3000.




