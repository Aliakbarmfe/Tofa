export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key تنظیم نشده است' });
  }

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
          { role: 'system', content: "شما دستیار فلکس هستید." },
          { role: 'user', content: message }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    // اگر مشکلی در پاسخ باشد، آن را چاپ کن تا در لاگ ببینیم
    if (!response.ok) {
        console.error("خطای Groq API:", data);
        return res.status(500).json({ error: 'خطا از طرف Groq: ' + JSON.stringify(data) });
    }

    if (data.choices && data.choices[0]) {
        return res.status(200).json({ reply: data.choices[0].message.content });
    } else {
        console.error("پاسخ غیرمنتظره از Groq:", data);
        return res.status(500).json({ error: 'ساختار پاسخ Groq نامعتبر است' });
    }

  } catch (error) {
    console.error("خطای Catch در سرور:", error);
    return res.status(500).json({ error: 'خطای سرور: ' + error.message });
  }
}
