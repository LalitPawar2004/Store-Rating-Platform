const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate, authorize('owner'));

router.get('/dashboard', async (req,res)=>{
  const ownerId = req.user.id;
  const [stores] = await pool.query('SELECT id,name FROM stores WHERE owner_id=?', [ownerId]);
  if(stores.length===0) return res.json({average:0, raters:[]});
  const storeId = stores[0].id;
  const [[avg]] = await pool.query('SELECT COALESCE(AVG(rating),0) as average FROM ratings WHERE store_id=?', [storeId]);
  const [raters] = await pool.query(
    `SELECT u.name, u.email, r.rating, r.updated_at 
     FROM ratings r JOIN users u ON u.id=r.user_id 
     WHERE r.store_id=? ORDER BY r.updated_at DESC`, [storeId]
  );
  res.json({store: stores[0], average: Number(avg.average).toFixed(2), raters});
});

module.exports = router;
