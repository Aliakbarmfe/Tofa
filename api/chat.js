export default async function handler(req, res) {
  // تنظیم هدرهای CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    // ارسال درخواست به Cloudflare Worker
    const workerResponse = await fetch('https://Flax1.aliakbarmfe.workers.dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    const data = await workerResponse.json();
    return res.status(workerResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'ارتباط با سرور برقرار نشد.', details: error.message });
  }
}
