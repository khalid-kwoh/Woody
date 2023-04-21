const mysql = require('mysql2');
const constant = require('./Constant');

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

const updateAPIToken = async (domain, newApiToken) => {
  try {
    const domainResults = await findDomain(domain);
    validationDomain(domainResults)
    return new Promise((resolve, reject) => {
      const updateQuery = 'UPDATE domains SET api_token = ? WHERE domain = ?';
      connection.query(updateQuery, [newApiToken, domain], (err, result) => {
        if (err) reject(err);
        resolve(result);
      });
    });
  } catch (err) {
    throw err;
  }
};

const findDomain = (domain) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM domains WHERE domain = ?`;
    connection.query(query, [domain], (err, results) => {
      if (err) reject(err);
      resolve(results);
    });
  });
};

const validationDomain = (domain) => {
  if (domain.length === 0) {
    throw new Error(constant.noInformation)
  }
};


const verifyUser = async (id, password) => {
  try {
    const userData = await getUserById(id);
    const validUser = validateCredentials(userData, password);
    return validUser;
  } catch (error) {
    throw error;
  }
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM domains WHERE domain = ?`;
    connection.query(query, [id], (error, results) => {
      if (error) reject(error);
      resolve(results);
    });
  });
};

const validateCredentials = (userData, password) => {
  if (userData.length === 0) {
    throw new Error('Invalid credentials');
  }

  const user = userData[0];

  if (user.api_key !== password) {
    throw new Error('Invalid credentials');
  }

  return user;
};

const getDomain = (id, callback) => {
  connection.query('SELECT * FROM domains WHERE id = ?', [id], (error, results, fields) => {
    if (error) callback(error);
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