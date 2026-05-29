export default function OnThisDayPage({ params }: { params: { date: string } }) {
  return (
    <main style={{ background: '#1a1a2e', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ color: '#ffffff', fontFamily: 'sans-serif', fontSize: '2rem' }}>
        On This Day: {params.date}
      </h1>
    </main>
  );
}
