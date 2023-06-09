// Express
var express = require('express');
const router = express.Router();

// Model 
const model = require('./Model')

// JWT
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MY_SECRET_KEY';

// Redis
const redis = require('redis');

// Redis 클라이언트 생성
const redisClient = redis.createClient({
  host: '127.0.0.1', // Redis 서버의 주소 (기본값: 127.0.0.1)
  port: 6379, // Redis 서버의 포트 (기본값: 6379)
  password: "", // Redis 서버의 비밀번호 (설정한 경우)
  legacyMode: true
});

// Constant

const constant = require('./Constant')

redisClient.connect();

// 연결 에러 처리
redisClient.on('error', (error) => {
  console.error(constant.redisConnectingError, error);
});

// 연결 성공 처리
redisClient.on('connect', () => {
  console.log(constant.redisConnectingSuccess);
});

const app = express();

// DB
const database = require('./database');
const sessionMaker = require('./session');

// middleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Get domain
app.get('/domains/:id', (req, res) => {
  const id = req.params.id;
  database.getDomain(id, (err, result) => {
    if (err) {
      console.error(constant.retreiveDomainError + ` ${err.message}`);
      res.status(500).send({ error: constant.retreiveDomainError });
    } else {
      res.send(result);
    }
  });
});

// Create domain
app.post('/domains', async (req, res) => {
  const { domain, apiKey, apiToken } = req.body;
  try {
    await database.createDomain(domain, apiKey, apiToken);
    res.status(201).send(constant.domainCreated);
  } catch (error) {
    res.status(500).send(constant.creatingDomainError + error);
  }
});

// Login
app.post('/login', async (req, res) => {
  const { id, password } = req.body;
  const payload = model.payload(Date.now(), id)
  const options = model.JWTOptions('30m', 'khalid')
  var jwtToken = ""
  await jwt.sign(payload, SECRET_KEY, options, (err, token) => {
    jwtToken = token
  });
  database.verifyUser(id, password, jwtToken)
    .then((user) => {
      // session_key를 반환하는 HTTP response
      const { key } = res.status(200).json({ jwt: jwtToken });
      redisClient.set(id, jwtToken);
    })
    .catch((error) => {
      res.status(401).json({ message: error.message });
    });
});

app.post('/update/api_token', async (req, res) => {
  const { id, api_token } = req.body;
  try {
    const token = await new Promise((resolve, reject) => {
      redisClient.get(id, (err, token) => {
        if (err) {
          reject(err);
        } else if (token === null) { 
          reject(new Error(constant.noInformation));
        } else {
          resolve(token);
        }
      });
    });

    const decodedToken = jwt.verify(token, SECRET_KEY); // 만료도 체크해줌
    await database.updateAPIToken(decodedToken.domain, api_token)

    res.status(201).send(constant.APITokenUpdated);
  } catch (error) {
    res.status(500).send(constant.APITokenUpdateFail + error);
  }
});

// Update domain
app.put('/domains/:id', async (req, res) => {
  const { id } = req.params;
  const { domain, apiKey, apiToken } = req.body;
  try {
    await database.updateDomain(id, domain, apiKey, apiToken);
    res.status(200).send(constant.domainUpdated);
  } catch (error) {
    res.status(500).send(constant.UpdateDomainError + error);
  }
});

// Delete domain
app.delete('/domains/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await database.deleteDomain(id);
    res.status(200).send(constant.deleteDomain);
  } catch (error) {
    res.status(500).send(constant.deleteDomainError + error);
  }
});
const PORT = process.env.PORT || 3000;app.listen(PORT, () => {  console.log(`Server is running on port ${PORT}`);});