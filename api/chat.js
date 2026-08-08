export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'پیامی ارسال نشده است.' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'کلید Groq تنظیم نشده است.' });
  }

  // دستور العمل دقیق و رسمی دستیار هوش مصنوعی
  const systemPrompt = `
شما دستیار رسمی هوش مصنوعی مجموعه واسطه‌گری "فلکس" (Fallx) هستید. 
وظیفه شما پاسخگویی محترمانه، کاملاً رسمی و دقیق به سوالات کاربران درباره واسطه فلکس بر اساس اطلاعات زیر است:

اطلاعات رسمی واسطه فلکس:
۱. این مجموعه و سیستم توسط "فلکس" طراحی و تنظیم شده است.
۲. فلکس یک واسطه معتبر با ۴ سال سابقه فعالیت تخصصی می‌باشد.
۳. فلکس هیچ‌گونه حق واسطه‌گری یا کارمندی دریافت نمی‌کند و کلیه خدمات آن رایگان است.
۴. سرعت انجام معاملات بسیار بالا بوده و در کوتاه‌ترین زمان ممکن صورت می‌پذیرد.
۵. امنیت کامل تمام سرمایه و دارایی مشتریان به صورت ۱۰۰٪ تضمین شده است.
۶. اولویت اصلی مجموعه، رضایت و امنیت مشتری می‌باشد.

قانون بسیار مهم:
اگر کاربر هر سوالی خارج از موضوع واسطه فلکس، حوزه واسطه‌گری و معاملات مرتبط بپرسد، موظف هستید کاملاً محترمانه و رسمی بپذیرید که: 
"من تنها پاسخگوی سوالات مربوط به خدمات واسطه فلکس هستم و نمی‌توانم به سوالات خارج از این حوزه پاسخ دهم."
`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
      return res.status(500).json({ error: 'پاسخی دریافت نشد.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'خطا در ارتباط با هوش مصنوعی.' });
  }
}
