// 필요한 module 가져오기
const express = require('express');
const bodyParser = require('body-parser');

// db 불러오기
const db = require('./db');

// express server 생성
const app = express();

// test용으로 임시 DB table 생성
db.pool.query(
  `CREATE TABLE lists (
  id INTEGER, AUTO_INCREMENT,
  value TEXT,
  PRIMARY KEY (id)
)`,
  (err, results, fields) => {
    console.log('results: ', results);
  }
);

// middleware
// json 형태로 오는 요청의 본문(body) 해석해 줄 수 있게 등록
app.use(bodyParser.json());

// DB lists 테이블에 있는 모든 데이터를 front server에 보내주기
app.get('/api/values', function (req, res) {
  // DB에서 모든 정보 가져오기
  db.pool.query('SELECT* FROM lists', (err, results, fields) => {
    if (err) return res.status(500).send(err);
    else return res.json(results);
  });
});

// client에서 입력한 데이터를 DB lists 테이블에 넣어주기
app.post('/api/value', function (req, res, next) {
  // DB에 데이터 넣어주기
  db.pool.query(
    `INSERT INTO lists (value) VALUES("${req.body.value}")`,
    (err, results, fields) => {
      if (err) return res.status(500).send(err);
      else return res.json({ success: true, value: req.body.value });
    }
  );
});

// app 실행
app.listen(5000, () => {
  console.log('application이 5000번 port에서 시작되었습니다.');
});
