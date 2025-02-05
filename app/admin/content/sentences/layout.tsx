import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cümleler',
  description: 'Cümle yönetimi',
}

export default function SentencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 