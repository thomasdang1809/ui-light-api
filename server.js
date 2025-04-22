const jsonServer = require('json-server');
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const server = express();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const PORT = process.env.PORT || 3001;

// Middleware
server.use(middlewares);
server.use(bodyParser.json());

// === CUSTOM API ===
const DB_PATH = path.join(__dirname, 'db.json');

function readDB() {
  const raw = fs.readFileSync(DB_PATH);
  return JSON.parse(raw);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// POST /entities -> tạo entity mới (nếu chưa có)
server.post('/posts', (req, res) => {
  const { name } = req.body;
  const db = readDB();
  if (!db[name]) {
    db[name] = [];
    writeDB(db);
    return res.status(201).json({ message: `Entity abcd '${name}' created.` });
  } else {
    return res.status(400).json({ error: 'Entity already exists SDS' });
  }
});

// POST /entities/:name -> thêm dữ liệu vào entity
server.post('/posts/:name', (req, res) => {
  const entity = req.params.name;
  const db = readDB();

  if (!db[entity]) {
    return res.status(404).json({ error: 'Entity not found' });
  }

  const newItem = { id: Date.now(), ...req.body };
  db[entity].push(newItem);
  writeDB(db);
  res.status(201).json(newItem);
});

// === JSON SERVER API ===
server.use(jsonServer.rewriter({
  '/api/*': '/$1',
}));

server.use(router);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server is running at https://ui-light-api.onrender.com/:${PORT}`);
});
