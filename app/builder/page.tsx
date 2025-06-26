'use client';

import dynamic from 'next/dynamic';

// Dynamically import to ensure client-side rendering
const Builder = dynamic(() => import('../components/Builder'), {
  ssr: false
});

export default function BuilderPage() {
  return <Builder />;
}