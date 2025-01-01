const express = require('express');
const fs = require('fs');
const Application = require('../models/application');
const router = express.Router();
const Storage = require('../utils/storage');
const app = require('../app');

router.get('/', async (req, res) => {
  console.log(req.user);

  if (!req.user) {
    res.render('main', { user: req.user, applied: false });
    return;
  }
  const user = Storage.get(req.user.discordId);
  res.render('main', { user: req.user, applied: !!user?.applyDate });
});

router.get('/notice', (req, res) => res.render('notice'));

router.get('/apply', (req, res) => res.render('apply', { user: req.user }));

router.post('/apply', async (req, res) => {
  console.log(req.user);
  if (!req.user) return res.redirect('/auth/discord');

  const user = Storage.get(req.user.discordId);

  if (user?.applyDate) {
    return res.json({ success: true, message: '이미 응시하셨습니다.' });
  }

  Storage.apply(req.user.discordId);
  res.json({ success: true, message: '성공적으로 지원되었습니다.' });
});

router.get('/exam', async (req, res) => {
  if (!req.user) return res.redirect('/auth/discord');

  const exam = (await Application.find().sort({ createdAt: -1 }).limit(1)).at(0);


  if (!Storage.get(req.user.discordId)?.applyDate) return res.redirect('/apply');

  console.log(exam.start);
  console.log(exam.start.getTime());

  if (!exam || exam.start.getTime() > Date.now()) {
    return res.render('exam-wait', {
      user: req.user,
      time: exam?.start?.getTime()
    });
  }



  var images = [''];
  for (var i = 1; i <= 20; i++) {
    try {
      im = fs.readFileSync(`./images/${String(i).padStart(2, '0')}.jpg`).toString('base64');
      images.push(im);
    } catch (e) {
      images.push("");
    }
  }

  res.render('exam', { user: req.user, images: images });
});

router.post('/exam', async (req, res) => {
  if (!req.user) return res.redirect('/auth/discord');

  const { answer } = req.body;
  await Answer.create({ userId: req.user.id, answer });
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("로그아웃 중 오류 발생:", err);
      return res.redirect('/');
    }
    res.redirect('/');
  });
});

router.get('/admin', async (req, res) => {
  if (!req.user) return res.redirect('/auth/discord');
  if (!isAdmin(req))
    return res.redirect("/");

  return res.render('admin/main', { user: req.user });
});

let statWs = [];

router.ws('/ans', (ws, req) => {
  ws.on('message', function (msg) {
    if (!req.user) return;
    Storage.ans(req.user.discordId, msg);
    statWs.forEach(x => {
      if (x.readyState != 1) return;
      x.send(JSON.stringify(Storage.json()));
    });
  });
});


router.ws('/stats', (ws, req) => {
  if (!isAdmin(req)) return ws.close();
  statWs.push(ws);
});

module.exports = router;


function isAdmin(req) {
  return ["486794188034408449", "606361328285777930", "302448389423890443"].includes(req.user.discordId);
}