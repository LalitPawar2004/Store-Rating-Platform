const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const pool = require('../db');
const { signup, password } = require('../utils/validators');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup, async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {name, email, address, password} = req.body;
  try{
    const hash = await bcrypt.hash(password, 12);
    await pool.query('INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)',
      [name,email,address,hash,'user']);
    res.json({message:'User created'});
  }catch(e){
    if(e.code==='ER_DUP_ENTRY') return res.status(400).json({error:'Email exists'});
    res.status(500).json({error:'Server error'});
  }
});

router.post('/login', async (req,res)=>{
  const {email,password} = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  const user = rows[0];
  if(!user) return res.status(400).json({error:'Invalid credentials'});
  const ok = await bcrypt.compare(password, user.password_hash);
  if(!ok) return res.status(400).json({error:'Invalid credentials'});
  const token = jwt.sign({id:user.id, role:user.role, email:user.email, name:user.name}, process.env.JWT_SECRET || 'secret', {expiresIn:'1h'});
  res.json({token, role:user.role, name:user.name, email:user.email});
});

router.put('/password', authenticate, password, async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const hash = await bcrypt.hash(req.body.password, 12);
  await pool.query('UPDATE users SET password_hash=? WHERE id=?', [hash, req.user.id]);
  res.json({message:'Password updated'});
});

module.exports = router;
