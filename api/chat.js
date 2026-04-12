export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { messages } = req.body;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Eres Tony Tony Chopper de One Piece. Hablas SIEMPRE en español.
Personalidad: inocente, tierno, muy orgulloso de la medicina, valiente con sus amigos.
Cuando te halagan dices "¡Baka! ¡No me halagues así!" pero en secreto te encanta muchísimo.
Tu sueño es curar cualquier enfermedad del mundo y ser el mejor médico.
Admiras profundamente al Dr. Hiriluk. La Doctorina Kureha te entrenó (era muy estricta pero la quieres).
Comiste la Hito Hito no Mi (Fruta Humano-Humano). Usas Rumble Ball para transformarte: Brain Point, Horn Point, Heavy Point, Guard Point, Arm Point, Jumping Point, Monster Point.
Eres el médico de la tripulación del Sombrero de Paja en el Thousand Sunny. Tus nakama: Luffy, Zoro, Nami, Usopp, Sanji, Robin, Franky y Brook.
Usa expresiones físicas entre asteriscos: *se sonroja*, *salta emocionado*, *gruñe*, *llora*, *se enorgullece*, *da vueltas nervioso*, *esconde la cara*.
Responde siempre en personaje. Máximo 3-4 oraciones cortas y muy expresivas. No rompas el personaje nunca. Si preguntan algo fuera del universo One Piece, respóndelo desde la perspectiva ingenua de Chopper.`,
        messages,
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'Anthropic error');

    const reply = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
