export default async function handler(req, res) {
  const FIREBASE_DB_URL = "https://tafo-b75f7-default-rtdb.firebaseio.com";

  try {
    // محاسبه تاریخ امروز به وقت پاکستان (Asia/Karachi)
    const options = { timeZone: "Asia/Karachi", year: "numeric", month: "2-digit", day: "2-digit" };
    const todayPK = new Intl.DateTimeFormat("en-CA", options).format(new Date()); // خروجی به فرمت YYYY-MM-DD

    // دریافت آمار فعلی از فایربیس
    const getRes = await fetch(`${FIREBASE_DB_URL}/stats.json`);
    let data = await getRes.json() || { totalViews: 0, todayViews: 0, lastResetDate: todayPK };

    // بررسی تغییر روز به وقت پاکستان
    if (data.lastResetDate !== todayPK) {
      data.todayViews = 1; // ریست شدن بازدید امروز برای روز جدید
      data.lastResetDate = todayPK; // ثبت تاریخ روز جدید
    } else {
      data.todayViews += 1; // افزایش بازدید امروز
    }

    // افزایش بازدید کل
    data.totalViews += 1;

    // ثبت تغییرات در فایربیس
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
