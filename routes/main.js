const express = require('express');
const fs = require('fs');
const Application = require('../models/application');
const Answer = require('../models/answer');
const router = express.Router();

router.get('/', async (req, res) => {
  
  if (!req.user) {
    res.render('main', { user: req.user, applied: false })
    return
  }
  const applicationStatus = await Application.findOne({ userId: req.user.id });
  res.render('main', { user: req.user, applied: !!applicationStatus })
});

router.get('/notice', (req, res) => res.render('notice'));

router.get('/apply', (req, res) => res.render('apply', { user: req.user }));

router.post('/apply', async (req, res) => {
  if (!req.user) return res.redirect('/auth/discord');

  const existingApplication = await Application.findOne({ userId: req.user.id });
  
  if (existingApplication) {
    return res.json({ success: true, message: '이미 응시하셨습니다.' });
  }

  await Application.create({ userId: req.user.id });
  res.json({ success: true, message: '성공적으로 응시되었습니다' });
});

router.get('/exam', async (req, res) => {
  if (!req.user) return res.redirect('/auth/discord');
  
  const applicationStatus = await Application.findOne({ userId: req.user.id });
  
  if (!applicationStatus) return res.redirect('/apply')

  if (applicationStatus.started === false) {
    return res.render('exam-wait', { 
      user: req.user, 
    });
  }

  

  image = fs.readFileSync('./images/1.jpg').toString('base64');

  res.render('exam', { user: req.user, images: image });
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
  if (!["486794188034408449"].includes(req.user.discordId)) 
    return res.redirect("/");

  return res.render('admin/main', { user: req.user });
});

module.exports = router;
