import 'dotenv/config';
// import { connectMongo } from './src/common/config/mongo.js';
import prisma from './src/common/config/prisma.js';
import app from "./app.js";

import { errorHandler } from './src/middlewares/error.middleware.js';

// app.use(express.json());

// Timeout Middleware
app.use((req, res, next) => {
    res.setTimeout(30000, () => {
        res.status(408).json({
            success: false,
            message: 'Request timeout'
        });
    });

    next();
});

app.get('/', (req, res) => {
    res.send('Hello');
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

try {
    await prisma.$connect();
    console.log('Database Connected');
} catch (error) {
    console.log('Database Connection Failed');
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});