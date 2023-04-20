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

const updateAPIToken = (domain, newApiToken) => {
  return new Promise((resolve, reject) => {
    // domains 테이블에서 session_key가 일치하는지 확인
    const query = `SELECT * FROM domains WHERE domain = '${ domain }'`;
    connection.query(query, [domain], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length === 0) {
          reject('session_key does not match any record in domains table');
        } else {
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

const verifyUser = (id, password) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM domains WHERE domain = '${id}' AND api_key = '${password}'`;
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else if (results.length > 0) {
        resolve(results[0]); // 첫 번째 row의 데이터를 반환
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  });
}

const getDomain = (id, callback) => {
  connection.query('SELECT * FROM domains WHERE id = ?', [id], (error, results, fields) => {
    if (error) {
      return callback(error);
    }
    callback(null, results[0]);
  });
};

const deleteDomain = (id) => {
  const query = 'DELETE FROM domains WHERE id = ?';
  return new Promise((resolve, reject) => {
    connection.query(query, [id], (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};
connection.connect((err) => {  if (err) {    console.error('Error connecting to the database:', err.stack);    console.log(err);    return;  }  console.log('Connected to the database.');});module.exports = {  createDomain,  getDomain,  verifyUser,  updateAPIToken,  updateDomain,  deleteDomain,};