import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import common from "../utils/common.util";
import { IAuth } from "../interfaces/auth.interface";
dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || common.JWT_SECRET;

//TODO: remove this function
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized!" });
        return;
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        res.status(404).json({ message: "Access Denied: No token provided" });
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        (req as any).user = decoded; // Attach the user to the request

        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
        return;
    }
};

const checkAuth = (roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const authHeader = req.headers.authorization;
    
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({ message: "Unauthorized-1!" });
            return;
        }
    
        const token = authHeader.split(" ")[1];
    
        if (!token) {
            res.status(404).json({ message: "Access Denied: No token provided" });
            return;
        }
    
        try {
            const decoded = await jwt.verify(token, SECRET_KEY) as IAuth;

            console.log(decoded);
            
            if(!roles.includes(decoded.role)) {
                res.status(401).json({ message: "You're Unauthorized!" });
                return;
            }

            // Attach the user to the request
            (req as any).user = decoded; 
    
            next();
        } catch (error) {
            res.status(403).json({ message: "Invalid Token" });
            return;
        }
    }
};

export default { checkAuth };

//TODO: remove this function
export const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};
