import { compare, hash } from "bcrypt";
import { supabase } from "../config/supabaseClient.js";

export const createAdmin = async (email, plainPassword) => {
  try {
    const hashedPassword = await hash(plainPassword, 10);

    const { data, error } = await supabase
      .from("admin")
      .insert([{ email, password: hashedPassword }], {
        returning: "representation",
      });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    throw new Error(`createAdmin failed: ${err.message}`);
  }
};

export const getAdminByEmail = async (email) => {
  const { data: users, error } = await supabase
    .from("admin")
    .select("*")
    .eq("email", email)
    .limit(1);

  if (error) throw new Error(error.message);

  return users.length > 0 ? users[0] : null;
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await compare(plainPassword, hashedPassword);
};


export const deleteMessage = async (id) => {
  try {
    if (!id) {
      throw new Error('ID pesan tidak valid');
    }

    const { error } = await supabase
      .from('pesan')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  } catch (err) {
    throw new Error(`deleteMessage failed: ${err.message}`);
  }
};

export const createMessage = async (nama, email, pesan) => {
  try {
    if (!nama || !email || !pesan) {
      throw new Error("Semua field harus diisi");
    }

    const { data, error } = await supabase
      .from("pesan")
      .insert([
        {
          nama: nama.trim(),
          email: email.trim(),
          pesan: pesan.trim(),
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    throw new Error(`${err.message}`);
  }
};


export const updateAdmin = async (email, newData) => {
  try {
    if (!email || Object.keys(newData).length === 0) {
      throw new Error('Data yang akan diupdate tidak valid');
    }

    const updatePayload = { ...newData };

    if (updatePayload.password) {
      const saltRounds = 10;
      updatePayload.password = await hash(updatePayload.password, saltRounds);
    }

    const { data, error } = await supabase
      .from('admin')
      .update(updatePayload)
      .eq('email', email)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      throw new Error('Admin tidak ditemukan');
    }

    return data[0];
  } catch (err) {
    throw new Error(`updateAdmin failed: ${err.message}`);
  }
};