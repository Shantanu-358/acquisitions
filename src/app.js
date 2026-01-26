// All about setting up an Express application in Node.js
import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.status(200).send('Hello from Aquisitions!');
});

export default app;
