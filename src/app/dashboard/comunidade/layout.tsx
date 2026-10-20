export default function ComunidadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-paper text-4xl">Comunidade</h1>
      <div className="mt-8 w-full max-w-6xl">{children}</div>
    </div>
  );
}
