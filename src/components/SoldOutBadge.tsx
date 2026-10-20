// Selo vermelho que fica por cima do card de uma data de turma fechada ou lotada.
// O card pai precisa ser "relative" e ter espaço no topo para o selo não cobrir o conteúdo.
export function SoldOutBadge() {
  return (
    <span className="bg-rosso text-paper font-body absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-sm px-3 py-1 text-xs font-bold uppercase tracking-widest">
      Sold Out
    </span>
  );
}
