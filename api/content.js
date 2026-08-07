export default async function handler(req, res) {
  const FIREBASE_DB_URL = "https://tafo-b75f7-default-rtdb.firebaseio.com";

  try {
    const response = await fetch(`${FIREBASE_DB_URL}/content.json`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "خطا در دریافت اطلاعات" });
  }
}
