import type { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../../lib/db';
import { withAuth } from '../../../lib/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).userId;
  if (req.method === 'GET') {
    const r = await query('SELECT * FROM shoots WHERE user_id = $1 ORDER BY date DESC', [userId]);
    return res.status(200).json(r.rows);
  }
  if (req.method === 'POST') {
    const s = req.body;
    const r = await query(
      `INSERT INTO shoots (id,user_id,client_id,title,is_personal,package_type,date,time,location,
        makeup_artist,makeup_price,price,deposit,payment_status,status,notes,reminder_minutes,reminder_sent,app)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
       ON CONFLICT (id) DO UPDATE SET
         title=$4,date=$7,time=$8,location=$9,price=$12,deposit=$13,
         payment_status=$14,status=$15,notes=$16,updated_at=NOW()
       RETURNING *`,
      [s.id||'s_'+Date.now(),userId,s.clientId,s.title,s.isPersonal||false,
       s.packageType,s.date,s.time,s.location,s.makeupArtist,s.makeupPrice||0,
       s.price||0,s.deposit||0,s.paymentStatus,s.status,s.notes,
       s.reminderMinutes||0,s.reminderSent||false,s.app||'fotoagenda']
    );
    return res.status(201).json(r.rows[0]);
  }
  if (req.method === 'DELETE') {
    await query('DELETE FROM shoots WHERE id=$1 AND user_id=$2', [req.query.id, userId]);
    return res.status(200).json({ success: true });
  }
  return res.status(405).json({ error: 'Metodo nao permitido' });
}
export default withAuth(handler);
