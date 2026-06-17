const express = require('express');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');
const { userCreate, name, email, address } = require('../utils/validators');

const router = express.Router();
router.use(authenticate, authorize('admin'));

router.get('/dashboard', async (req,res)=>{
  const [[u]] = await pool.query('SELECT COUNT(*) as totalUsers FROM users');
  const [[s]] = await pool.query('SELECT COUNT(*) as totalStores FROM stores');
  const [[r]] = await pool.query('SELECT COUNT(*) as totalRatings FROM ratings');
  res.json({...u, ...s, ...r});
});

router.post('/users', userCreate, async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {name,email,address,password,role} = req.body;
  const hash = await bcrypt.hash(password,12);
  try{
    await pool.query('INSERT INTO users (name,email,address,password_hash,role) VALUES (?,?,?,?,?)',[name,email,address,hash,role]);
    res.json({message:'User added'});
  }catch(e){
    res.status(400).json({error:'Email exists'});
  }
});

router.get('/users', async (req,res)=>{
  const {name='', email='', address='', role='', sort='name', order='asc'} = req.query;
  const sortable = ['name','email','address','role','created_at'];
  const sortBy = sortable.includes(sort) ? sort : 'name';
  const dir = order==='desc'?'DESC':'ASC';
  const [rows] = await pool.query(
    `SELECT id,name,email,address,role,created_at FROM users 
     WHERE name LIKE ? AND email LIKE ? AND address LIKE ? AND (?='' OR role=?)
     ORDER BY ${sortBy} ${dir}`,
    [`%${name}%`,`%${email}%`,`%${address}%`,role,role]
  );
  res.json(rows);
});

router.get('/users/:id', async (req,res)=>{
  const { id } = req.params;
  const [rows] = await pool.query('SELECT id,name,email,address,role,created_at FROM users WHERE id=?', [id]);
  const user = rows[0];
  if(!user) return res.status(404).json({error:'Not found'});
  if(user.role==='owner'){
    const [[avg]] = await pool.query(
      `SELECT COALESCE(AVG(r.rating),0) as ownerRating
       FROM ratings r JOIN stores s ON r.store_id=s.id
       WHERE s.owner_id=?`, [id]
    );
    user.ownerRating = Number(avg.ownerRating).toFixed(2);
  }
  res.json(user);
});

router.get('/stores', async (req,res)=>{
  const {name='', email='', address='', sort='name', order='asc'} = req.query;
  const sortable = ['name','email','address','rating'];
  const sortBy = sortable.includes(sort) ? sort : 'name';
  const dir = order==='desc'?'DESC':'ASC';
  const orderClause = sortBy==='rating' ? `rating ${dir}` : `s.${sortBy} ${dir}`;
  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address, COALESCE(AVG(r.rating),0) as rating
     FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.name LIKE ? AND s.email LIKE ? AND s.address LIKE ?
     GROUP BY s.id ORDER BY ${orderClause}`,
    [`%${name}%`,`%${email}%`,`%${address}%`]
  );
  res.json(rows);
});

router.post('/stores', [name, email.optional({checkFalsy:true}).isEmail(), address], async (req,res)=>{
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
  const {name,email,address,owner_id} = req.body;
  await pool.query('INSERT INTO stores (name,email,address,owner_id) VALUES (?,?,?,?)',[name,email||null,address||null,owner_id||null]);
  res.json({message:'Store added'});
});

module.exports = router;
