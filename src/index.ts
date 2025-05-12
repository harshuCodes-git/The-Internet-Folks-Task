import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/database';
import { validateEnv } from './config/validateEnv';
import { seedRoles } from './config/seeder';
import authRoutes from './routes/auth';
import communityRoutes from './routes/community';
import memberRoutes from './routes/member';
import roleRoutes from './routes/role';

// Load environment variables
dotenv.config();

// Validate environment variables
validateEnv();

// Connect to MongoDB and seed roles
const startServer = async () => {
    try {
        await connectDB();
        await seedRoles();

        const app = express();

        // Middleware
        app.use(express.json());
        app.use(cors());
        if (process.env.NODE_ENV === 'development') {
            app.use(morgan('dev'));
        }

        // Routes
        app.get('/', (req: express.Request, res: express.Response) => {
            res.json({
                status: true,
                message: 'Community Management API is running',
                version: '1.0.0',
                endpoints: {
                    auth: '/v1/auth',
                    community: '/v1/community',
                    member: '/v1/member',
                    role: '/v1/role'
                }
            });
        });

        app.use('/v1/auth', authRoutes);
        app.use('/v1/community', communityRoutes);
        app.use('/v1/member', memberRoutes);
        app.use('/v1/role', roleRoutes);

        // 404 handler for undefined routes
        app.use((req: express.Request, res: express.Response) => {
            res.status(404).json({
                status: false,
                error: {
                    message: `Route ${req.originalUrl} not found`
                }
            });
        });

        // Error handling middleware
        app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            console.error(err.stack);
            res.status(err.status || 500).json({
                status: false,
                error: {
                    message: err.message || 'Internal server error',
                    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
                }
            });
        });

        const PORT = parseInt(process.env.PORT || '5000', 10);

        // Function to try starting server on a port
        const tryStartServer = (port: number): Promise<void> => {
            return new Promise((resolve, reject) => {
                const server = app.listen(port)
                    .on('error', (err: any) => {
                        if (err.code === 'EADDRINUSE') {
                            console.log(`Port ${port} is busy, trying ${port + 1}`);
                            server.close();
                            resolve(tryStartServer(port + 1));
                        } else {
                            reject(err);
                        }
                    })
                    .on('listening', () => {
                        console.log(`Server running on port ${port}`);
                        resolve();
                    });
            });
        };

        // Start server with port retry logic
        tryStartServer(PORT).catch((error) => {
            console.error('Failed to start server:', error);
            process.exit(1);
        });

        // Handle process termination
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully');
            process.exit(0);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
