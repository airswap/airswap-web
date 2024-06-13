const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://app.safe.global',
  methods: 'GET',
  allowedHeaders: 'X-Requested-With, content-type, Authorization',
  credentials: true
}));

app.use(express.static('./build'));

app.listen(process.env.PORT || 3000);
