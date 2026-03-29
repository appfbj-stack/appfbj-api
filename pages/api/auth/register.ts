import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { query, initDB } from '../../../lib/db';
import { generateToken } from '../../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Metodo nao permitido' });
  const { name, email, password, app = 'fotoagenda' } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'Campos obrigatorios' });
  try {
    await initDB();
    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) return res.status(409).json({ error: 'Email ja cadastrado' });
    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      'INSERT INTO users (name, email, password, app) VALUES ($1, $2, $3, $4) RETURNING id, name, email, app',
      [name, email, hash, app]
    );
    const token = generateToken(result.rows[0].id, result.rows[0].email);
    return res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno' });
  }
}
