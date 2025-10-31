/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Endpoints untuk manajemen todo list (in-memory)
 */

const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ✅ Setup CORS (Railway friendly)
router.use(
  cors({
    origin: [
      'http://localhost:5173', // local dev
      'https://yourfrontend.railway.app', // ganti sesuai domain FE kamu
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Semua route wajib login
router.use(authenticateToken);

// 🧠 In-memory data
let todos = [];

// Helper: ambil todo milik user
const findByUserId = (userId) => todos.filter((todo) => todo.userId === userId);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Tambah todo baru
 *     description: Membuat todo baru untuk user yang sedang login.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - task
 *               - priority
 *               - date
 *             properties:
 *               task:
 *                 type: string
 *                 example: "Belajar React + Tailwind"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *     responses:
 *       201:
 *         description: Todo berhasil dibuat
 *         content:
 *           application/json:
 *             example:
 *               message: "Todo created successfully"
 *               todo:
 *                 id: "3f7e5a7a-30c3-4bba-8769-c08f51b25b3b"
 *                 task: "Belajar React + Tailwind"
 *                 priority: "high"
 *                 date: "2025-11-01T00:00:00.000Z"
 *                 completed: false
 *                 createdAt: "2025-10-31T14:33:00.000Z"
 *       400:
 *         description: Data tidak valid
 *         content:
 *           application/json:
 *             example:
 *               message: "Task, priority, dan date wajib diisi"
 *       401:
 *         description: Token tidak valid
 *       500:
 *         description: Kesalahan server
 */
router.post('/', (req, res) => {
  try {
    const { task, priority, date } = req.body;
    const userId = req.user.id;

    if (!task || !priority || !date) {
      return res
        .status(400)
        .json({ message: 'Task, priority, dan date wajib diisi' });
    }

    if (!['low', 'medium', 'high'].includes(priority)) {
      return res
        .status(400)
        .json({ message: 'Priority harus low, medium, atau high' });
    }

    const todoDate = new Date(date);
    if (isNaN(todoDate.getTime())) {
      return res.status(400).json({ message: 'Format tanggal tidak valid' });
    }

    const todo = {
      id: randomUUID(),
      userId,
      task,
      priority,
      date: todoDate,
      completed: false,
      createdAt: new Date(),
    };

    todos.push(todo);
    res.status(201).json({ message: 'Todo created successfully', todo });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Ambil semua todo milik user
 *     description: Mengambil daftar todo milik user yang sedang login.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar todo user
 *         content:
 *           application/json:
 *             example:
 *               todos:
 *                 - id: "abc123"
 *                   task: "Belajar Swagger"
 *                   priority: "medium"
 *                   completed: false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', (req, res) => {
  try {
    const userId = req.user.id;
    const userTodos = findByUserId(userId);
    res.json({ todos: userTodos });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /todos/completed:
 *   get:
 *     summary: Ambil semua todo yang sudah selesai
 *     description: Mengambil daftar todo yang memiliki status completed = true.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar todo yang sudah selesai
 *         content:
 *           application/json:
 *             example:
 *               todos:
 *                 - id: "xyz789"
 *                   task: "Fix API bug"
 *                   priority: "medium"
 *                   completed: true
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/completed', (req, res) => {
  try {
    const userId = req.user.id;
    const completedTodos = findByUserId(userId).filter((t) => t.completed);
    res.json({ todos: completedTodos });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /todos/{id}/complete:
 *   patch:
 *     summary: Tandai todo selesai atau batal selesai
 *     description: Toggle status completed pada todo berdasarkan ID.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID todo
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Status todo berhasil diubah
 *         content:
 *           application/json:
 *             example:
 *               message: "Todo updated"
 *               todo:
 *                 id: "71bfa98c"
 *                 task: "Makan"
 *                 completed: true
 *       404:
 *         description: Todo tidak ditemukan
 *         content:
 *           application/json:
 *             example:
 *               message: "Todo tidak ditemukan"
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.patch('/:id/complete', (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    const userId = req.user.id;

    const index = todos.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    todos[index].completed = completed ?? !todos[index].completed;
    res.json({ message: 'Todo updated', todo: todos[index] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update todo (task, priority, date)
 *     description: Mengubah data todo berdasarkan ID.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *                 example: "Update UI design"
 *               priority:
 *                 type: string
 *                 example: "medium"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-03"
 *     responses:
 *       200:
 *         description: Todo berhasil diupdate
 *         content:
 *           application/json:
 *             example:
 *               message: "Todo updated"
 *               todo:
 *                 id: "9b3a1824"
 *                 task: "Update UI design"
 *                 priority: "medium"
 *                 date: "2025-11-03T00:00:00.000Z"
 *       404:
 *         description: Todo tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { task, priority, date } = req.body;
    const userId = req.user.id;

    const index = todos.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    if (task) todos[index].task = task;
    if (priority) todos[index].priority = priority;
    if (date) todos[index].date = new Date(date);

    res.json({ message: 'Todo updated', todo: todos[index] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Hapus todo
 *     description: Menghapus todo berdasarkan ID milik user yang login.
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo berhasil dihapus
 *         content:
 *           application/json:
 *             example:
 *               message: "Todo deleted"
 *               todo:
 *                 id: "71bfa98c"
 *                 task: "Fix API bug"
 *       404:
 *         description: Todo tidak ditemukan
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const index = todos.findIndex((t) => t.id === id && t.userId === userId);
    if (index === -1) {
      return res.status(404).json({ message: 'Todo tidak ditemukan' });
    }

    const deleted = todos.splice(index, 1)[0];
    res.json({ message: 'Todo deleted', todo: deleted });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
