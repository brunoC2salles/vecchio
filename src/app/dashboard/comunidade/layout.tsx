export default function ComunidadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="font-display text-paper text-4xl">Comunidade</h1>
      <div className="mx-auto mt-8 max-w-2xl">{children}</div>
    </div>
  );
}
