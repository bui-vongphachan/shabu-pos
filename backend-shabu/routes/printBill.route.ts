
import express, { Request, Response } from "express";
const router = express.Router();

router.get("/printBill", async (req: Request, res: Response) => {
 

    return res.json("doc");
});

export { router as printBillRoute };
