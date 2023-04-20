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

redisClient.connect();

// 연결 에러 처리
redisClient.on('error', (error) => {
  console.error('Error connecting to Redis:', error);
});

// 연결 성공 처리
redisClient.on('connect', () => {
  console.log('Connected to Redis successfully');
});

const app = express();

// DB
const database = require('./database');
const sessionMaker = require('./session');

// middleWare
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create domain
app.post('/domains', async (req, res) => {
  const { domain, apiKey, apiToken } = req.body;
  try {
    await database.createDomain(domain, apiKey, apiToken);
    res.status(201).send('Domain created successfully.');
  } catch (error) {
    res.status(500).send('Error creating domain: ' + error);
  }
});
