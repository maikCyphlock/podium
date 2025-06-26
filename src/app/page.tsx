import { ArrowRight, BarChart, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-50 to-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none">
                Podium: Tu Evento, Tu Victoria
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl dark:text-gray-400">
                La plataforma todo-en-uno para organizar competencias de atletismo. Desde la inscripción hasta los resultados en vivo, lo tenemos cubierto.
              </p>
            </div>
            <div className="space-x-4 pt-4">
              <Button size="lg" asChild>
                <Link href="/register" className="inline-flex items-center">
                  Comenzar Ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">Saber Más</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                El Sistema Operativo para tu Competencia
              </h2>
              <p className="max-w-[800px] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Todo lo que necesitas para un evento exitoso en una sola plataforma.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Inscripciones Fáciles</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Formularios de inscripción online personalizables y pagos seguros integrados.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <BarChart className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Resultados en Vivo</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Publica tiempos y tablas de posiciones en tiempo real para mantener a todos enganchados.
                </p>
              </CardContent>
            </Card>
            <Card className="transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <CardTitle>Experiencia Profesional</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Páginas de evento personalizadas y perfiles de atletas para una experiencia de primer nivel.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-gray-50 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              ¿Listo para llevar tu evento al siguiente nivel?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 md:text-xl/relaxed">
              Únete a cientos de organizadores que ya están usando Podium para sus eventos deportivos.
            </p>
            <Button size="lg" className="mt-6" asChild>
              <Link href="/register">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t bg-white py-6 md:py-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Podium. Todos los derechos reservados.
            </p>
            <nav className="flex gap-4">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
                Privacidad
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
                Términos
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900">
                Contacto
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}