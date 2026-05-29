export default function DaysUntilPage({ params }: { params: { slug: string } }) {
  return (
    <main style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#ffffff', fontFamily: 'sans-serif', fontSize: '2rem' }}>
        Days Until: {params.slug}
      </h1>
    </main>
  );
}
