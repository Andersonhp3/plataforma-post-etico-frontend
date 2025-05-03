import type { NextApiRequest, NextApiResponse } from 'next';

const API_BASE = process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE) {
throw new Error('NEXT_PUBLIC_API_URL não definido em .env.local');
}

export default async function handler(
req: NextApiRequest,
res: NextApiResponse
) {
    const url = `${API_BASE}/api/v1/perfil`;
const { method, body, headers } = req;

if (!method) {
return res.status(400).json({ message: 'Método HTTP indefinido' });
}

// Monta cabeçalhos para proxy, mantendo cookie de sessão
const proxyHeaders: Record<string, string> = {
'Content-Type': 'application/json',
};
if (typeof headers.cookie === 'string') {
proxyHeaders['cookie'] = headers.cookie;
}

// Constrói objeto RequestInit
const init: RequestInit = {
method,
headers: proxyHeaders,
};
if (method === 'PUT' || method === 'POST') {
init.body = JSON.stringify(body);
}

try {
const apiRes = await fetch(url, init);
const data = await apiRes.json();
return res.status(apiRes.status).json(data);
} catch (error: any) {
return res.status(500).json({ message: error.message });
}
}