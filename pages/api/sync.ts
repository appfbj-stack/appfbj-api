import type { NextApiRequest, NextApiResponse } from 'next';
import { query, initDB } from '../../lib/db';
import { withAuth } from '../../lib/auth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const userId = (req as any).userId;
  await initDB();
  if (req.method === 'GET') {
    const [c, s] = await Promise.all([
      query('SELECT * FROM clients WHERE user_id = $1', [userId]),
      query('SELECT * FROM shoots WHERE user_id = $1', [userId]),
    ]);
    return res.status(200).json({ clients: c.rows, shoots: s.rows, syncedAt: new Date().toISOString() });
  }
  if (req.method === 'POST') {
    const { clients = [], shoots = [] } = req.body;
    for (const c of clients) {
      await query(
        `INSERT INTO clients (id,user_id,name,phone,email,notes,app,created_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO UPDATE SET name=$3,phone=$4,email=$5,notes=$6,updated_at=NOW()`,
        [c.id,userId,c.name,c.phone,c.email,c.notes,c.app||'fotoagenda',c.createdAt||Date.now()]
      );
    }
    for (const s of shoots) {
      await query(
        `INSERT INTO shoots (id,user_id,client_id,title,is_personal,package_type,date,time,location,
          makeup_artist,makeup_price,price,deposit,payment_status,status,notes,reminder_minutes,reminder_sent,app)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
         ON CONFLICT (id) DO UPDATE SET title=$4,date=$7,price=$12,deposit=$13,status=$15,updated_at=NOW()`,
        [s.id,userId,s.clientId,s.title,s.isPersonal||false,s.packageType,s.date,s.time,s.location,
         s.makeupArtist,s.makeupPrice||0,s.price||0,s.deposit||0,s.paymentStatus,s.status,s.notes,
         s.reminderMinutes||0,s.reminderSent||false,s.app||'fotoagenda']
      );
    }
    return res.status(200).json({ success: true, synced: { clients: clients.length, shoots: shoots.length } });
  }
  return res.status(405).json({ error: 'Metodo nao permitido' });
}
export default withAuth(handler);
