import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth/options';
import OnboardingPageClient from './OnboardingPageClient';

export const metadata: Metadata = {
  title: 'Completa tu perfil',
  description: 'Completa tu perfil para comenzar a usar Podium',
};

export default async function OnboardingPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login?callbackUrl=/onboarding');
  }
  if ((session.user as any).onboardingCompleted) {
    redirect('/dashboard');
  }

  return <OnboardingPageClient />;
}
