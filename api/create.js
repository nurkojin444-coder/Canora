
import { randomBytes } from "node:crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      recipient,
      message,
      anonymous = false,
      theme = "orange"
    } = req.body || {};

    if (
      typeof recipient !== "string" ||
      !recipient.trim() ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        error: "Nama dan pesan wajib diisi."
      });
    }

    if (recipient.length > 60 || message.length > 500) {
      return res.status(400).json({
        error: "Pesan atau nama terlalu panjang."
      });
    }

    const code =
      "CN-" + randomBytes(5).toString("hex").toUpperCase();

    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/cans`,
      {
        method: "POST",
        headers: {
          apikey: process.env.SUPABASE_SECRET_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          code,
          recipient: recipient.trim(),
          message: message.trim(),
          anonymous: !!anonymous,
          theme
        })
      }
    );

    if (!response.ok) {
      console.error(await response.text());
      return res.status(500).json({
        error: "Gagal menyimpan pesan."
      });
    }

    return res.status(200).json({ code });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error"
    });
  }
}
