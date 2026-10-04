import { Router, Request, Response } from 'express';
import { query } from '../config/db';

const router = Router();

// GET all items
router.get('/items', async (_req: Request, res: Response) => {
  try {
    const result = await query(
      'SELECT id, title, description, category, status, priority, created_at, updated_at FROM items ORDER BY id ASC'
    );
    res.json({
      success: true,
      count: result.rowCount,
      data: result.rows,
    });
  } catch (error) {
    console.error('Failed to fetch items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve items from database',
    });
  }
});

// POST new item
router.post('/items', async (req: Request, res: Response) => {
  try {
    const { title, description, category = 'General', priority = 'medium' } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Title is required and must not be empty',
      });
    }

    const result = await query(
      `INSERT INTO items (title, description, category, status, priority)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING *`,
      [title.trim(), description ? description.trim() : '', category.trim(), priority]
    );

    res.status(201).json({
      success: true,
      message: 'Item created successfully in PostgreSQL container',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to create item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to insert item into database',
    });
  }
});

// PATCH update item status or attributes
router.patch('/items/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid item ID' });
    }

    const { status, title, description, priority } = req.body;

    // Fetch existing item
    const existing = await query('SELECT * FROM items WHERE id = $1', [id]);
    if (existing.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    const item = existing.rows[0];
    const newStatus = status !== undefined ? status : item.status;
    const newTitle = title !== undefined ? title : item.title;
    const newDesc = description !== undefined ? description : item.description;
    const newPriority = priority !== undefined ? priority : item.priority;

    const result = await query(
      `UPDATE items 
       SET status = $1, title = $2, description = $3, priority = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [newStatus, newTitle, newDesc, newPriority, id]
    );

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Failed to update item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update item in database',
    });
  }
});

// DELETE item
router.delete('/items/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: 'Invalid item ID' });
    }

    const result = await query('DELETE FROM items WHERE id = $1 RETURNING id', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, error: 'Item not found' });
    }

    res.json({
      success: true,
      message: `Item #${id} deleted successfully`,
      data: { id },
    });
  } catch (error) {
    console.error('Failed to delete item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete item from database',
    });
  }
});

// GET aggregated stats
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const counts = await query(`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'completed') as completed,
        COUNT(*) FILTER (WHERE status = 'in-progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'pending') as pending
      FROM items
    `);

    res.json({
      success: true,
      data: counts.rows[0],
    });
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve stats' });
  }
});

export default router;
