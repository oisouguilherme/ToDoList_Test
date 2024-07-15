const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./routes');
const { sequelize } = require('./models');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/api', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  await sequelize.authenticate();
  console.log(`Server is running on http://localhost:${PORT}`);
});
