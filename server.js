const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ CORS setup (Railway friendly)
app.use(
  cors({
    origin: [
      'http://localhost:5173', // untuk lokal FE
      'https://todolist-ez.vercel.app', // ganti sesuai domain FE kamu
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ✅ Swagger definition (dengan tags)
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Todo API',
    version: '1.0.0',
    description: 'A simple Todo API with auth (with in-memory mode no db)',
  },
  servers: [
    {
      url: process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : `http://localhost:${PORT}`,
      description: 'Development',
    },
  ],
  // ✅ Urutkan tags sesuai keinginan kamu
  tags: [
    {
      name: 'Authentication',
      description: 'Endpoints untuk otentikasi pengguna (register, login)',
    },
    {
      name: 'Todos',
      description: 'Endpoints untuk manajemen todo list',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

// ✅ Swagger options
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // auto load semua dokumentasi dari folder routes
};

// ✅ Generate Swagger spec
const swaggerSpec = swaggerJsdoc(options);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Swagger UI setup (plus custom title & favicon)
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Ezar Todo API Docs',
    customfavIcon: 'https://cdn-icons-png.flaticon.com/512/1041/1041916.png',
  })
);

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

// ✅ Health check endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API is running ✅',
    version: '1.0.0',
    mode: 'in-memory',
  });
});

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ (Opsional) Seed users — tetap biar auth tetap jalan
const users = User.getAll();

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📘 Swagger Docs: http://localhost:${PORT}/api-docs`);
  if (process.env.RAILWAY_PUBLIC_DOMAIN) {
    console.log(`🌍 Live API: https://${process.env.RAILWAY_PUBLIC_DOMAIN}`);
  }
  console.log(`👤 Sample users: ${users.length}`);
});

module.exports = app;
