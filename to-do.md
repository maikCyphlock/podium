# 🏁 Roadmap de Funcionalidades Podium

---

## 1. Portal Público de Eventos (**Prioridad Alta**)

**Estado actual:** Solo dashboard privado

**Propuesta:**
- Páginas públicas personalizables para cada evento
- Formulario de inscripción público (sin pago online)
- Galería de eventos pasados
- Sistema de búsqueda y filtros
- Integración con redes sociales

**Archivos a crear:**
- `src/app/events/[slug]/page.tsx` — Página pública del evento
- `src/app/events/page.tsx` — Lista pública de eventos
- `src/components/public/` — Componentes para el público
- `src/app/api/public/events/` — APIs públicas

---

## 2. Sistema de Check-in con QR (**Prioridad Alta**)

**Estado actual:** No implementado

**Propuesta:**
- Generación de códigos QR únicos por participante
- App móvil para escanear QR (o web app responsive)
- Registro de asistencia en tiempo real
- Notificaciones automáticas
- Dashboard de check-in

**Archivos a crear:**
- `src/app/checkin/[eventId]/page.tsx` — Página de check-in
- `src/components/qr/` — Componentes de QR
- `src/lib/qr/` — Utilidades de generación de QR
- Actualizar schema con modelo `CheckIn`

---

## 3. Resultados en Tiempo Real (**Prioridad Alta**)

**Estado actual:** Solo subida manual

**Propuesta:**
- Dashboard de resultados en vivo
- Actualizaciones automáticas con WebSockets
- Tabla de posiciones en tiempo real
- Notificaciones push para nuevos resultados
- API para integración con sistemas de cronometraje

**Archivos a crear:**
- `src/app/live/[eventId]/page.tsx` — Dashboard en vivo
- `src/components/live/` — Componentes de resultados en vivo
- `src/lib/websocket/` — Configuración de WebSockets
- `src/app/api/live/` — APIs de resultados en vivo
