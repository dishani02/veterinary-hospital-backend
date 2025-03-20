import { Router, Request, Response } from "express";
import StaffModel from "../models/staff.model";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middleware/auth.middleware";

const router = Router();

const SECRET_KEY = "2effbd077fc5422316f52484b98626a977015811df825445e398ba55e5391b9d";

const decodeToken = (token: string) => {
    return jwt.verify(token, SECRET_KEY);
};

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "No token provided" });
            return;
        }

        const decoded: any = decodeToken(token);
        if (decoded.role !== "admin") {
            res.status(403).json({ message: "Only admins can add staff members." });
            return;
        }

        const staff = new StaffModel({
            name: req.body.name,
            address: req.body.address,
            nic: req.body.nic,
            email: req.body.email,
            phone: req.body.phone,
            role: req.body.role,
        });

        await staff.save();

        res.status(201).json({
            message: "Staff member successfully created!",
            payload: staff,
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating staff member", error: (error as Error).message });
    }
});

//router.get("/admin/staff", async (req, res) => {
   // const token = req.headers.authorization?.split(' ')[1];
    
   // try {
     //   if (!token) return res.status(401).json({ message: "No token provided" });

      //  const decoded: any = decodeToken(token);
      //  if (decoded.role !== "admin") {
      //      return res.status(403).json({ message: "Admins only." });
      //  }

    //    const staff = await StaffModel.find();
     //   res.status(200).json({ message: "Staff list retrieved successfully", payload: staff });
  //  } catch (error) {
      //  res.status(500).json({ message: "Error fetching staff members", error: (error as Error).message });
//}
//});

//router.delete("/:staffId", async (req, res) => {
   // const { staffId } = req.params;
  //  const token = req.headers.authorization?.split(' ')[1];

   // try {
      //  if (!token) return res.status(401).json({ message: "No token provided" });

      //  const decoded: any = decodeToken(token);
      //  if (decoded.role !== "admin") {
          //  return res.status(403).json({ message: "Only admins can delete staff members." });
     //   }

      //  const staff = await StaffModel.findById(staffId);
     //   if (!staff) {
         //   return res.status(404).json({ message: "Staff member not found" });
       // }

      //  await StaffModel.findByIdAndDelete(staffId);
      //  res.status(200).json({ message: "Staff member deleted successfully" });
   // } catch (error) {
      //  res.status(500).json({ message: "Error deleting staff member", error: (error as Error).message });
  //  }
//});

export default router;
