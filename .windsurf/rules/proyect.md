---
trigger: always_on
---
Contexto del Proyecto: Podium
1. Visión y Enfoque del Producto:
    1.1 **Visión:** Ser el sistema operativo para organizadores de eventos deportivos, centralizando todo el ciclo de vida de una competencia.
    1.2 **Enfoque:** Desarrollar un producto **escalable**, **modular** y que ofrezca **valor recurrente**.
2. Módulos Clave:
    2.1 * **Configuración de Eventos (Panel de Admin):** Creación y gestión de eventos, categorías, precios, cupones y páginas personalizables.
    2.2 * **Registro y Participantes (Portal del Atleta):** Registro online con pagos, perfiles de atletas, comunicaciones por email.

3. Plan de Desarrollo (MVP):
    3.1 * **Fase 1 (Core):** Cuentas de organizadores, creación de eventos simple, subida manual de resultados, página pública de resultados.

4. Filosofía de Desarrollo:
    Adhiero a un enfoque de rigor y fiabilidad. Cada sugerencia de código, refactorización o generación debe alinearse con estos principios:
    4.1 * Evita la lógica condicional compleja; prefiere `if/else` y `switch`.
    4.2 * Usa `map`, `filter`, `reduce` solo cuando mejoren la claridad, sin encadenamientos excesivos.
    4.3 * `async/await` es el estándar para operaciones asíncronas.
    4.4 * `try/catch` debe estar siempre (donde tenga sentido), para que haya seguridad
    4.5 * Asegúrate de que todos los bucles (`for`, `while`) tengan una condición de salida clara, y declara siempre un max_iteration aparte.
    4.6 * Para funciones recursivas, garantiza que el caso base siempre sea alcanzable.
    4.7 * Considera paginación o fragmentación para grandes conjuntos de datos.
    4.8 * Prefiere `const` sobre `let` para inmutabilidad.
    4.9 * Evita la mutación directa de objetos/arrays; usa el spread syntax (`...`) o librerías inmutables (ej. Immer).
    4.10 * Inicializa todas las variables en su declaración.
    4.11 * **Usa TypeScript al máximo, evita `any`.**
    4.12 * Usa Type Guards y aserciones para asegurar la forma de los datos, especialmente en límites de API.
    4.13 * `strict` mode en `tsconfig.json` está habilitado.
    4.12 * Declara variables y funciones en el ámbito más pequeño posible.
    4.13 * Usa modificadores `private` o `protected` en clases para encapsular el estado interno.
    4.14 * haz tests  unitarios cuando hagas una implementación.

5. Modularidad y Responsabilidad Única:
    5.1 * Las funciones y clases deben ser pequeñas y enfocadas en una única tarea (SRP).
    5.2 * Mantén los archivos concisos y organizados por característica o módulo.
    5.3 * **Prioriza la co-localización de archivos relacionados** (componente, estilos, tests, tipos) dentro de la misma carpeta.
    5.4 * Siempre busca el código más desacoplado posible, pero sin caer en la sobre-ingeniería (no crees abstracciones innecesarias).
6. Sin "Magic Strings" o Números:
    6.1 * Usa `enum` o `const` para literales de cadena y constantes numéricas.

7. Herramientas Estrictas e Integración Continua (CI):
   7.1 * Habilita y exige reglas de linter estrictas (ej. ESLint).
   7.2 * Todo el código debe pasar las verificaciones de linter y compilador (`tsc --noEmit`) sin advertencias ni errores.
   7.3 ejecuta los tests para comprobar que el código no dejo de funcionar

Comandos de Desarrollo (para referencia)
    npm run dev,
    npm run build,
    npm run start,
    npm run lint,
    npm run db:generate
    npm run db:migrate
    npm run db:studio
    npm run db:seed
    npm run db:reset
    npm run db:deploy
    npm run test
    npm run test:ui
    npm run test:run
    npm runtest:e2e

lista de los Gitmojis más comunes y su significado:

✨ :sparkles: - Introducir una nueva característica.

🐛 :bug: - Corregir un error.

📝 :memo: - Escribir documentación.

♻️ :recycle: - Refactorizar código.

🚀 :rocket: - Desplegar cambios.

✅ :white_check_mark: - Añadir o actualizar pruebas.

🎉 :tada: - Primera confirmación.

⬆️ :arrow_up: - Actualizar dependencias.

⬇️ :arrow_down: - Bajar dependencias.

🩹 :adhesive_bandage: - Corrección rápida.

🔧 :wrench: - Cambios en archivos de configuración.

➕ :heavy_plus_sign: - Añadir una dependencia.

➖ :heavy_minus_sign: - Eliminar una dependencia.

💡 :bulb: - Añadir o actualizar comentarios en el código.