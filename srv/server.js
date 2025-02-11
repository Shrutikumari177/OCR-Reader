const express = require('express');
const cds = require('@sap/cds');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

cds.serve('all').in(app);

