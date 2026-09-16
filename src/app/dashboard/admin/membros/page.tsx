import { createClient } from "@/lib/supabase/server";
import { updateMembro } from "./actions";

export default async function MembrosPage() {
  const supabase = await createClient();
  const { data: membros } = await supabase
    .from("profiles")
    .select("id, nome, email, role, is_patrocinador, criado_em")
    .order("criado_em", { ascending: false });

  return (
    <div>
      <p className="text-smoke text-sm">
        {(membros ?? []).length} membro{(membros ?? []).length === 1 ? "" : "s"} cadastrado
        {(membros ?? []).length === 1 ? "" : "s"}.
      </p>

      <div className="border-line mt-4 overflow-x-auto rounded-sm border">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-line text-smoke border-b">
              <th className="px-4 py-3 font-normal">Nome</th>
              <th className="px-4 py-3 font-normal">E-mail</th>
              <th className="px-4 py-3 font-normal">Papel</th>
              <th className="px-4 py-3 font-normal">Patrocinador</th>
              <th className="px-4 py-3 font-normal" />
            </tr>
          </thead>
          <tbody>
            {(membros ?? []).map((m) => (
              <tr key={m.id} className="border-line text-paper border-b last:border-0">
                <form action={updateMembro.bind(null, m.id)} className="contents">
                  <td className="px-4 py-3">{m.nome}</td>
                  <td className="text-smoke px-4 py-3">{m.email}</td>
                  <td className="px-4 py-3">
                    <select
                      name="role"
                      defaultValue={m.role}
                      className="border-line bg-ink text-paper rounded-sm border px-2 py-1 text-xs outline-none focus:border-rosso"
                    >
                      <option value="aluno">Aluno</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="checkbox" name="is_patrocinador" defaultChecked={m.is_patrocinador} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="submit" className="text-oro text-xs underline underline-offset-2">
                      salvar
                    </button>
                  </td>
                </form>
              </tr>
            ))}
            {(membros ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="text-smoke px-4 py-6 text-center">
                  Nenhum membro cadastrado ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
