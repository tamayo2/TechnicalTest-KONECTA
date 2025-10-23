import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    console.error(err); // Muestra el error en consola (útil en desarrollo)
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || 'Server error',
    });
}
