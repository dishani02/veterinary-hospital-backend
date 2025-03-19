import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ProductRoutes from "./controllers/product.controller";
import mongoose from "mongoose";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ping", (req, res, next) => {
    res.status(200).json({ message: "pong" });
});

app.use("/api/products", ProductRoutes);


app.use((req, res, next) => {
    res.status(404).json({ message: "API Endpoint Not Found!" });
});

const start = () => {
    try {
        const port = process.env.PORT || 5000;
        const mongoDbUrl = process.env.MONGODB_URL || "";

        app.listen(port, async () => {
            await mongoose.connect(mongoDbUrl, { retryWrites: true, w: 'majority' })
                .then(() => console.log('MongoDB connected!'))
                .catch((err) => console.error(err));
            console.log(`Server started. port: ${port}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();