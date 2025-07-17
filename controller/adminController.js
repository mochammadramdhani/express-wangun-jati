import { supabase } from "../config/supabaseClient.js";
import { CONFIG } from "../config/main.config.js";
import jwt from "jsonwebtoken";
import { getInitials } from "../utils/getInitials.js";
import { formatTanggal } from "../utils/dateFormat.js";
import {
  createAdmin,
  createMessage,
  deleteMessage,
  getAdminByEmail,
  updateAdmin,
  verifyPassword,
} from "../model/adminModel.js";
const { sign } = jwt;

const ChangeAdminData = async (req, res, next) => {
  try {
    console.log("ChangeAdminData");
    const { email, password } = req.body;

    const currentEmail = req.cookies?.AdminData?.email || "";

    const updateData = {};
    if (email) updateData.email = email;

    if (password && password.trim() !== "") {
      console.log("password trimmed");
      updateData.password = password;
    }

    if (Object.keys(updateData).length === 0) {
      console.log("Tidak ada data yang diubah");
      return res.status(400).json({
        message: "Tidak ada data yang diubah",
      });
    }

    const updatedAdmin = await updateAdmin(currentEmail, updateData);

    res.status(200).json({
      message: "Data admin berhasil diupdate",
      data: {
        email: updatedAdmin.email,
      },
    });
  } catch (error) {
    console.error("Error while change admin data:", error);
    res.status(400).json({
      message: error.message || "Gagal mengupdate data admin",
    });
  }
};

const AuthLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const isMatch = await verifyPassword(password, admin.password);

    if (!isMatch) {
      console.log("Email atau password salah");
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = sign(
      { id: admin.id, email: admin.email },
      CONFIG.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("AdminData", {
      email: admin.email || email,
      role: "Administrator",
    });

    res.cookie("WJKTOKEN_COOKIE", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });

    res.status(200).json({
      message: "Login berhasil",
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const AuthSignUp = async (req, res) => {
  const { email, password } = req.body;

  try {
    const data = await createAdmin(email, password);

    res.status(201).json({
      message: "Data added successfully",
      admin: { email },
      data: data,
    });
  } catch (err) {
    console.error("Error: ", err.message);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

const Logout = (req, res, next) => {
  res.clearCookie("WJKTOKEN_COOKIE", {
    httpOnly: true,
    secure: true,
  });
  res.clearCookie("AdminData", {
    httpOnly: true,
    secure: true,
  });

  res.redirect("/admin/login");
};

const HapusPesan = async (req, res, next) => {
  try {
    const { id } = req.params;

    await deleteMessage(id);

    res.status(200).json({
      message: "Berhasil menghapus pesan",
      deletedId: id,
    });
  } catch (error) {
    console.error("Error in HapusPesan:", error);
    res.status(400).json({
      message: error.message || "Gagal menghapus pesan",
    });
  }
};

// KLIEN KIRIM PESAN
const KirimPesan = async (req, res, next) => {
  try {
    const { nama, email, pesan } = req.body;

    const result = await createMessage(nama, email, pesan);

    res.status(201).json({
      message: "Pesan berhasil dikirim!",
      data: result[0],
    });
  } catch (error) {
    console.error("Error while kirim pesan:", error);
    res.status(400).json({
      message: error.message || "Gagal mengirim pesan",
    });
  }
};

const SemuaPesan = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("pesan")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    const formattedData = data.map((item) => ({
      ...item,
      tanggal: formatTanggal(item.created_at),
    }));

    res.status(200).json({
      message: "Data pesan berhasil diambil",
      data: formattedData,
    });
  } catch (error) {
    console.error("Error saat mengambil semua pesan:", error);
    res.status(500).json({
      message: "Gagal mengambil data pesan",
      error: error.message,
    });
  }
};

export {
  AuthLogin,
  AuthSignUp,
  Logout,
  HapusPesan,
  ChangeAdminData,
  KirimPesan,
  SemuaPesan,
};
