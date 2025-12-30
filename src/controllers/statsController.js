const pool = require('../config/database');

exports.getStats = async (req, res) => {
  const userId = req.userId;

  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_tasks,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress_tasks,
        COUNT(*) FILTER (WHERE status = 'completed') as completed_tasks,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) as today_tasks,
        COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE - INTERVAL '7 days') as week_tasks
      FROM tasks 
      WHERE user_id = $1
    `, [userId]);

    res.json({
      success: true,
      stats: stats.rows[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};