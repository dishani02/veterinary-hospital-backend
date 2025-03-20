import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const SECRET_KEY = process.env.JWT_SECRET || "your_fallback_secret";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        (req as any).user = decoded; // Attach the user to the request
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};

// ✅ Helper function for manually decoding token when needed
export const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};
