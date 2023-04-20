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

const updateAPIToken = (sessionKey, newApiToken) => {
  return new Promise((resolve, reject) => {
    // sessionKey가 유효한지 확인
    const [sessionValue, expirationTime] = sessionKey.split('.');
    if (!sessionValue || !expirationTime || Date.now() > parseInt(expirationTime) + 30 * 60 * 1000) {
      reject(new Error('session_key is invalid or has expired'));
    }

    // domains 테이블에서 session_key가 일치하는지 확인
    const query = 'SELECT * FROM domains WHERE session_key = ?';
    connection.query(query, [sessionKey], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          reject('session_key does not match any record in domains table');
        } else {
          const domain = results[0].domain;
          const updateQuery = 'UPDATE domains SET api_token = ? WHERE domain = ?';
          connection.query(updateQuery, [newApiToken, domain], (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        }
      }
    });
  });
};
