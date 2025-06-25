import { ArrowRight, BarChart, CheckCircle, Star } from 'lucide-react';

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-800 font-[family-name:var(--font-geist-sans)]">
      {/* Hero Section */}
      <main className="min-h-screen flex flex-col items-center justify-center text-center p-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            Podium: Tu Evento, Tu Victoria
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            La plataforma todo-en-uno para organizar competencias de atletismo. Desde la inscripción hasta los resultados en vivo, lo tenemos cubierto.
          </p>
          <a
            href="/register"
            className="inline-flex items-center justify-center bg-blue-600 text-white font-medium rounded-full h-12 px-8 text-lg hover:bg-blue-700 transition-colors"
          >
            Organiza tu Evento <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight">El Sistema Operativo para tu Competencia</h2>
            <p className="text-lg text-gray-600 mt-2">Todo lo que necesitas para un evento exitoso.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inscripciones Fáciles</h3>
              <p className="text-gray-600">Formularios de inscripción online personalizables y pagos seguros integrados.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <BarChart className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Resultados en Vivo</h3>
              <p className="text-gray-600">Publica tiempos y tablas de posiciones en tiempo real para mantener a todos enganchados.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Experiencia Profesional</h3>
              <p className="text-gray-600">Páginas de evento personalizadas y perfiles de atletas para una experiencia de primer nivel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Podium. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}