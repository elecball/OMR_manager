require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const Storage = require('./utils/storage');

Storage.load();

const app = express();
const expressWs = require('express-ws');


// MongoDB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected successful"))
  .catch((err) => console.error(err));

// 미들웨어 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(__dirname + '/public'));
expressWs(app);

// 뷰 엔진 설정
app.set('view engine', 'ejs');

const mainRoutes = require('./routes/main');
const authRoutes = require('./routes/auth');
// 라우터 설정
app.use('/', mainRoutes);
app.use('/auth', authRoutes);

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
