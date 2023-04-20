const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'db_scheme'
});

const createDomain = (domain, apiKey, apiToken) => {
  const query = 'INSERT INTO domains (domain, api_key, api_token) VALUES (?, ?, ?)';
  return new Promise((resolve, reject) => {
    connection.query(query, [domain, apiKey, apiToken], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

const updateDomain = (id, domain, apiKey, apiToken) => {
  const query = 'UPDATE domains SET domain = ?, api_key = ?, api_token = ? WHERE id = ?';
  return new Promise((resolve, reject) => {
    connection.query(query, [domain, apiKey, apiToken, id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
