// IMPLEMENTAR MEJOR

/**
 import { test, expect } from '@playwright/test';

// NOTA: Este test asume que existen helpers para crear usuario, evento, carrera, categoría y participante,
// y que la autenticación se puede simular o mockear. Ajusta según tu setup real.
const email = `testuser_${Date.now()}@example.com`;
const password = 'Test1234!';

// Helper para obtener la cookie de sesión de NextAuth
async function getSessionCookie(
  request: import('@playwright/test').APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const res = await request.post('/api/auth/callback/credentials', {
    form: { email, password },
  });
  if (!res.ok()) {
    const text = await res.text();
    throw new Error(`Login falló: ${res.status()} - ${text}`);
  }
  const rawCookies = res.headers()['set-cookie'];
  const cookies = Array.isArray(rawCookies) ? rawCookies : rawCookies ? [rawCookies] : undefined;
  if (!cookies) throw new Error('No se pudo obtener la cookie de sesión');
  const sessionCookie = cookies.find((c: string) => c.startsWith('next-auth.session-token'));
  if (!sessionCookie) throw new Error('No se encontró la cookie de sesión');
  return sessionCookie.split(';')[0];
}

test.describe('API de Resultados', () => {
  let eventId: string;
  let raceId: string;
  let categoryId: string;
  let participantId: string;
  let sessionCookie: string;

  test.beforeAll(async ({ request }) => {
    // Crear usuario
    const userRes = await request.post('/api/auth/register', {
      data: { name: 'Test User', email: email, password: password }
    });
    if (!userRes.ok()) {
      const text = await userRes.text();
      console.error('Respuesta inesperada:', text);
      throw new Error('No se pudo crear el usuario');
    }
    // Login y obtener cookie de sesión
    sessionCookie = await getSessionCookie(request, email, password);

    // Crear evento
    const eventRes = await request.post('/api/events', {
      headers: { cookie: sessionCookie },
      data: {
        title: 'Test Event',
        description: 'Evento de prueba',
        date: '2024-12-01T10:00:00Z',
        location: 'Caracas',
        image: '',
        isPublished: true,
        categoryIds: []
      }
    });
    const eventData = await eventRes.json();
    eventId = eventData.id;

    // Crear carrera
    const raceRes = await request.post(`/api/events/${eventId}/races`, {
      headers: { cookie: sessionCookie },
      data: {
        name: 'Carrera 10K',
        description: '10 kilómetros',
        distance: 10,
        unit: 'km',
        startTime: '2024-12-01T10:00:00Z',
        categoryIds: []
      }
    });
    raceId = (await raceRes.json()).id;

    // Crear categoría
    const categoryRes = await request.post(`/api/events/${eventId}/categories`, {
      headers: { cookie: sessionCookie },
      data: { name: 'Adultos', description: 'Mayores de 18' }
    });
    categoryId = (await categoryRes.json()).id;

    // Crear participante
    const participantRes = await request.post(`/api/events/${eventId}/participants`, {
      headers: { cookie: sessionCookie },
      data: {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@podium.com',
        birthDate: '1990-01-01T00:00:00Z',
        gender: 'MALE',
        country: 'Venezuela',
        city: 'Caracas'
      }
    });
    participantId = (await participantRes.json()).id;
  });

  test('debe rechazar si no está autenticado', async ({ request }) => {
    const res = await request.post(`/api/events/${eventId}/results`, {
      data: {},
    });
    expect(res.status()).toBe(401);
  });

  test('debe rechazar datos inválidos', async ({ request }) => {
    const res = await request.post(`/api/events/${eventId}/results`, {
      headers: { cookie: sessionCookie },
      data: { foo: 'bar' },
    });
    expect(res.status()).toBe(400);
  });

  test('debe crear un resultado válido', async ({ request }) => {
    const res = await request.post(`/api/events/${eventId}/results`, {
      headers: { cookie: sessionCookie },
      data: {
        time: '00:45:12',
        position: 1,
        bibNumber: '123',
        status: 'FINISHED',
        notes: 'Sin incidencias',
        raceId,
        categoryId,
        participantId,
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body).toHaveProperty('id');
    expect(body.time).toBe('00:45:12');
  });

  test('debe rechazar si la carrera, categoría o participante no pertenecen al evento', async ({ request }) => {
    const res = await request.post(`/api/events/${eventId}/results`, {
      headers: { cookie: sessionCookie },
      data: {
        time: '00:50:00',
        position: 2,
        bibNumber: '999',
        status: 'FINISHED',
        notes: '',
        raceId: 'fake',
        categoryId: 'fake',
        participantId: 'fake',
      },
    });
    expect(res.status()).toBe(400);
  });
}); 
 */