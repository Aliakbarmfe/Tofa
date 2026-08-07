export default async function handler(req, res) {
  const FIREBASE_DB_URL = "https://tafo-b75f7-default-rtdb.firebaseio.com";

  try {
    // دریافت آمار فعلی
    const getRes = await fetch(`${FIREBASE_DB_URL}/stats.json`);
    let data = await getRes.json() || { totalViews: 0, todayViews: 0 };

    // افزایش آمار
    data.totalViews += 1;
    data.todayViews += 1;

    // ثبت در فایربیس
    await fetch(`${FIREBASE_DB_URL}/stats.json`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "خطا در اتصال به فایربیس" });
  }
}
