import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';
import { withAuth } from '../../../lib/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).userId;
  if (req.method === 'GET') {
    const r = await query('SELECT * FROM clients WHERE user_id = $1 ORDER BY name', [userId]);
    return res.status(200).json(r.rows);
  }
  if (req.method === 'POST') {
    const { id, name, phone, email, notes, app, created_at } = req.body;
    if (!name) return res.status(400).json({ error: 'Nome obrigatorio' });
    const r = await query(
      `INSERT INTO clients (id,user_id,name,phone,email,notes,app,created_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (id) DO UPDATE SET name=$3,phone=$4,email=$5,notes=$6,updated_at=NOW()
       RETURNING *`,
      [id||'c_'+Date.now(),userId,name,phone,email,notes,app||'fotoagenda',created_at||Date.now()]
    );
    return res.status(201).json(r.rows[0]);
  }
  if (req.method === 'DELETE') {
    await query('DELETE FROM clients WHERE id=$1 AND user_id=$2', [req.query.id, userId]);
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: 'Metodo nao permitido' });
}
export default withAuth(handler);
