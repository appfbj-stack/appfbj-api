/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  }
  
  module.exports = nextConfig */import { Pool } from 'pg';

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('localhost') ? false : { rejectUnauthorized: false },
      });

      export async function query(text: string, params?: any[]) {
        const client = await pool.connect();
          try {
              const result = await client.query(text, params);
                  return result;
                    } finally {
                        client.release();
                          }
                          }

                          export async function initDB() {
                            await query(`
                                CREATE TABLE IF NOT EXISTS users (
                                      id SERIAL PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
                                                  email VARCHAR(255) UNIQUE NOT NULL,
                                                        password VARCHAR(255) NOT NULL,
                                                              app VARCHAR(100) NOT NULL DEFAULT 'fotoagenda',
                                                                    created_at TIMESTAMP DEFAULT NOW()
                                                                        )
                                                                          `);

                                                                            await query(`
                                                                                CREATE TABLE IF NOT EXISTS clients (
                                                                                      id VARCHAR(100) PRIMARY KEY,
                                                                                            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                                                                                                  name VARCHAR(255) NOT NULL,
                                                                                                        phone VARCHAR(50),
                                                                                                              email VARCHAR(255),
                                                                                                                    notes TEXT,
                                                                                                                          app VARCHAR(100) NOT NULL DEFAULT 'fotoagenda',
                                                                                                                                created_at BIGINT,
                                                                                                                                      updated_at TIMESTAMP DEFAULT NOW()
                                                                                                                                          )
                                                                                                                                            `);

                                                                                                                                              await query(`
                                                                                                                                                  CREATE TABLE IF NOT EXISTS shoots (
                                                                                                                                                        id VARCHAR(100) PRIMARY KEY,
                                                                                                                                                              user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                                                                                                                                                                    client_id VARCHAR(100),
                                                                                                                                                                          title VARCHAR(255) NOT NULL,
                                                                                                                                                                                is_personal BOOLEAN DEFAULT FALSE,
                                                                                                                                                                                      package_type VARCHAR(100),
                                                                                                                                                                                            date VARCHAR(20),
                                                                                                                                                                                                  time VARCHAR(10),
                                                                                                                                                                                                        location TEXT,
                                                                                                                                                                                                              makeup_artist VARCHAR(255),
                                                                                                                                                                                                                    makeup_price DECIMAL(10,2) DEFAULT 0,
                                                                                                                                                                                                                          price DECIMAL(10,2) DEFAULT 0,
                                                                                                                                                                                                                                deposit DECIMAL(10,2) DEFAULT 0,
                                                                                                                                                                                                                                      payment_status VARCHAR(50),
                                                                                                                                                                                                                                            status VARCHAR(50),
                                                                                                                                                                                                                                                  notes TEXT,
                                                                                                                                                                                                                                                        reminder_minutes INTEGER DEFAULT 0,
                                                                                                                                                                                                                                                              reminder_sent BOOLEAN DEFAULT FALSE,
                                                                                                                                                                                                                                                                    app VARCHAR(100) NOT NULL DEFAULT 'fotoagenda',
                                                                                                                                                                                                                                                                          created_at TIMESTAMP DEFAULT NOW(),
                                                                                                                                                                                                                                                                                updated_at TIMESTAMP DEFAULT NOW()
                                                                                                                                                                                                                                                                                    )
                                                                                                                                                                                                                                                                                      `);
                                                                                                                                                                                                                                                                                      }