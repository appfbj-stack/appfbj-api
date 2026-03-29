import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { query, initDB } from '../../../lib/db';
import { generateToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo nao permitido' });
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatorios' });
  try {
    await initDB();
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Email ou senha invalidos' });
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Email ou senha invalidos' });
    const token = generateToken(user.id, user.email);
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ user: safeUser, token });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
}
