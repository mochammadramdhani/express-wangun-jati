import express from "express";
import {
  AuthLogin,
  AuthSignUp,
  ChangeAdminData,
  HapusPesan,
  KirimPesan,
  Logout,
  SemuaPesan,
} from "../controller/adminController.js";
import { verifyToken } from "../middleware/jwtVerify.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/admin/login");
});

// Admin Login
router.post("/auth", AuthLogin);

// Register Admin
router.post("/post/admin", AuthSignUp);

router.delete("/message/:id", HapusPesan);

router.put("/change/admin", ChangeAdminData);

router.get('/pesan', SemuaPesan);
router.post('/kirim/pesan', KirimPesan);
router.delete('/hapus/pesan/:id', HapusPesan);

export default router;
