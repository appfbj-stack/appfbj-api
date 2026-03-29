export default function Home() {
  return (
    <div style={{fontFamily:'sans-serif',padding:'2rem',maxWidth:'600px',margin:'0 auto'}}>
      <h1>appfbj-api</h1>
      <p>Backend API para apps appfbj-stack com PostgreSQL</p>
      <h2>Endpoints:</h2>
      <ul>
        <li><b>POST</b> /api/auth/register</li>
        <li><b>POST</b> /api/auth/login</li>
        <li><b>GET/POST/DELETE</b> /api/clients (Bearer token)</li>
        <li><b>GET/POST/DELETE</b> /api/shoots (Bearer token)</li>
        <li><b>GET/POST</b> /api/sync (Bearer token)</li>
      </ul>
    </div>
  );
}
