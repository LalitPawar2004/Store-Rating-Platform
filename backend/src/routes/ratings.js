const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, authorize('user'));

router.post('/', async (req,res)=>{
  const {store_id, rating} = req.body;
  const r = parseInt(rating);
  if(r<1 || r>5) return res.status(400).json({error:'Rating 1-5'});
  try{
    await pool.query('INSERT INTO ratings (user_id, store_id, rating) VALUES (?,?,?) ON DUPLICATE KEY UPDATE rating=VALUES(rating)', [req.user.id, store_id, r]);
    res.json({message:'Rating saved'});
  }catch(e){ res.status(500).json({error:'Error'}); }
});

router.put('/:storeId', async (req,res)=>{
  const {rating} = req.body;
  const r = parseInt(rating);
  await pool.query('UPDATE ratings SET rating=? WHERE user_id=? AND store_id=?', [r, req.user.id, req.params.storeId]);
  res.json({message:'Updated'});
});

module.exports = router;
