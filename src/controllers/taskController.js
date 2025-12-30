// Obtenir toutes les tâches avec pagination
exports.getAllTasks = async (req, res) => {
  const userId = req.userId;
  
  // Paramètres de pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  // Paramètres de filtrage
  const status = req.query.status;
  const search = req.query.search;

  try {
    // Construire la requête dynamiquement
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    let countQuery = 'SELECT COUNT(*) FROM tasks WHERE user_id = $1';
    const params = [userId];
    let paramIndex = 2;

    // Filtrer par statut
    if (status) {
      query += ` AND status = $${paramIndex}`;
      countQuery += ` AND status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    // Recherche par titre ou description
    if (search) {
      query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      countQuery += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Tri et pagination
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);

    // Exécuter les requêtes
    const [tasks, totalCount] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, -2)) // Enlever limit et offset pour le count
    ]);

    const total = parseInt(totalCount.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      pagination: {
        currentPage: page,
        totalPages,
        totalTasks: total,
        tasksPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      tasks: tasks.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur' 
    });
  }
};