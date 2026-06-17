const express = require('express');
const pool = require('../db');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', authorize('user','admin'), async (req,res)=>{
  const {name='', address='', sort='name', order='asc'} = req.query;
  const userId = req.user.id;
  const sortable = ['name','address','overallRating'];
  const sortBy = sortable.includes(sort) ? sort : 'name';
  const dir = order === 'desc' ? 'DESC' : 'ASC';
  const orderClause = sortBy === 'overallRating' ? `overallRating ${dir}` : `s.${sortBy} ${dir}`;

  const [rows] = await pool.query(
    `SELECT s.id, s.name, s.address,
      COALESCE(AVG(r.rating),0) as overallRating,
      (SELECT rating FROM ratings WHERE user_id=? AND store_id=s.id) as userRating
     FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.name LIKE ? AND s.address LIKE ?
     GROUP BY s.id ORDER BY ${orderClause}`,
    [userId, `%${name}%`, `%${address}%`]
  );
  res.json(rows);
});

module.exports = router;
