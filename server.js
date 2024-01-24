const express = require('express');
const sequelize = require('./config/connection');
const routes = require('./routes');
require('dotenv').config();
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  
})

// sync sequelize models to the database, then turn on the server
sequelize.sync({ force: false }).then(() => {
app.listen(PORT, () =>
  console.log(`Database connected and server listening on port ${PORT}!`));
});
