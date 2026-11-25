export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const code = String(req.query.code || "").trim();

  if (!/^CN-[A-F0-9]{10}$/i.test(code)) {
    return res.status(400).json({
      error: "Kode tidak valid."
    });
  }

  try {
    const url =
      `${process.env.SUPABASE_URL}/rest/v1/cans` +
      `?code=eq.${encodeURIComponent(code)}` +
      `&select=recipient,message,anonymous,theme,expires_at&limit=1`;

    const response = await fetch(url, {
      headers: {
        apikey: process.env.SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SECRET_KEY}`
      }
    });

    if (!response.ok) {
      return res.status(500).json({
        error: "Gagal mengambil pesan."
      });
    }

    const rows = await response.json();

    if (
      !rows.length ||
      new Date(rows[0].expires_at) < new Date()
    ) {
      return res.status(404).json({
        error: "Kaleng tidak ditemukan atau sudah kedaluwarsa."
      });
    }

    return res.status(200).json(rows[0]);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Server error"
    });
  }
}
