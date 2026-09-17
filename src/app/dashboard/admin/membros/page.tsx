import { createClient } from "@/lib/supabase/server";
import { updateMembro, excluirMembro } from "./actions";
import { ConfirmButton } from "@/components/ConfirmButton";

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
            {(membros ?? []).map((m) => {
              const formId = `membro-form-${m.id}`;
              return (
                <tr key={m.id} className="border-line text-paper border-b last:border-0">
                  <td className="px-4 py-3">{m.nome}</td>
                  <td className="text-smoke px-4 py-3">{m.email}</td>
                  <td className="px-4 py-3">
                    <select
                      name="role"
                      form={formId}
                      defaultValue={m.role}
                      className="border-line bg-ink text-paper rounded-sm border px-2 py-1 text-xs outline-none focus:border-rosso"
                    >
                      <option value="aluno">Aluno</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <input type="checkbox" name="is_patrocinador" form={formId} defaultChecked={m.is_patrocinador} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button type="submit" form={formId} className="text-oro text-xs underline underline-offset-2">
                        salvar
                      </button>
                      <form action={excluirMembro.bind(null, m.id)}>
                        <ConfirmButton
                          type="submit"
                          confirmMessage={`Excluir ${m.nome} definitivamente? Isso apaga a conta, matrículas, posts e comentários. Não tem volta.`}
                          className="text-rosso text-xs underline underline-offset-2"
                        >
                          excluir
                        </ConfirmButton>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}
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

      {/* Um <form> não pode ficar dentro de <tr>/<table> (HTML inválido faz o navegador
          descartar o conteúdo). Por isso os forms de "salvar" ficam aqui fora, e os campos
          de cada linha se ligam a eles pelo atributo form="...". O botão "excluir" já tem
          seu próprio form (excluirMembro), que não precisa de campos extras. */}
      {(membros ?? []).map((m) => (
        <form key={m.id} id={`membro-form-${m.id}`} action={updateMembro.bind(null, m.id)} />
      ))}
    </div>
  );
}
