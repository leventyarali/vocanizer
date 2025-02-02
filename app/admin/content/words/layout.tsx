import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelimeler',
  description: 'Kelime yönetimi',
}

export default function WordsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 