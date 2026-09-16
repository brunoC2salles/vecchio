import { createClient } from "@/lib/supabase/server";
import { createEvento, deleteEvento } from "./actions";

function formatarData(iso: string | null) {
  if (!iso) return "Data a definir";
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function EventosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const isAdmin = profile?.role === "admin";

  const { data: eventos } = await supabase
    .from("eventos")
    .select("id, titulo, tipo, data_evento, local_ou_link")
    .order("data_evento", { ascending: true, nullsFirst: false });

  return (
    <div className="space-y-6">
      {error && <p className="border-rosso text-rosso rounded-sm border px-4 py-3 text-sm">{error}</p>}

      <div className="space-y-3">
        {(eventos ?? []).map((ev) => (
          <div key={ev.id} className="border-line bg-char rounded-sm border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-paper text-sm font-semibold">{ev.titulo}</p>
                <p className="text-smoke mt-1 text-xs">
                  {formatarData(ev.data_evento)} · {ev.tipo === "online" ? "Online" : "Presencial"}
                </p>
                {ev.local_ou_link && <p className="text-smoke mt-1 text-xs">{ev.local_ou_link}</p>}
              </div>
              {isAdmin && (
                <form action={deleteEvento.bind(null, ev.id)}>
                  <button type="submit" className="text-rosso text-xs underline underline-offset-2">
                    excluir
                  </button>
                </form>
              )}
            </div>
          </div>
        ))}
        {(eventos ?? []).length === 0 && (
          <p className="text-smoke border-line rounded-sm border px-4 py-6 text-center text-sm">
            Nenhum evento agendado no momento.
          </p>
        )}
      </div>

      {isAdmin && (
        <form action={createEvento} className="border-line bg-char space-y-3 rounded-sm border p-4">
          <p className="text-smoke text-xs">Novo evento</p>
          <input
            name="titulo"
            required
            placeholder="Título"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              name="tipo"
              className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
            >
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
            </select>
            <input
              name="data_evento"
              type="datetime-local"
              className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
            />
          </div>
          <input
            name="local_ou_link"
            placeholder="Local ou link de acesso"
            className="border-line bg-ink text-paper w-full rounded-sm border px-3 py-2 text-sm outline-none focus:border-rosso"
          />
          <button type="submit" className="font-display bg-rosso text-paper rounded-sm px-5 py-2 text-sm tracking-wide">
            Criar evento
          </button>
        </form>
      )}
    </div>
  );
}
