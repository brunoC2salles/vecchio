-- Datas (edições) dentro de uma mesma turma/produto de venda.
-- Os links de pagamento continuam na tabela turmas; o aluno escolhe a data
-- e ela fica registrada na matrícula (controle do admin).

create table if not exists public.turma_datas (
  id uuid primary key default gen_random_uuid(),
  turma_id uuid not null references public.turmas(id) on delete cascade,
  rotulo text not null,
  data_inicio date not null,
  vagas integer not null default 10 check (vagas >= 0),
  ativa boolean not null default true,
  criado_em timestamptz not null default now()
);

create index if not exists turma_datas_turma_id_idx on public.turma_datas (turma_id);

alter table public.matriculas
  add column if not exists turma_data_id uuid references public.turma_datas(id) on delete set null;

create index if not exists matriculas_turma_data_id_idx on public.matriculas (turma_data_id);

-- Leitura pública (são só rótulos e datas). Escrita apenas pela service role.
alter table public.turma_datas enable row level security;

drop policy if exists "turma_datas leitura" on public.turma_datas;
create policy "turma_datas leitura" on public.turma_datas
  for select to anon, authenticated using (true);

-- Seed: as duas datas na turma presencial ativa mais próxima,
-- e todas as matrículas já existentes dela vão para 24 e 25 de outubro.
do $$
declare
  v_turma uuid;
  v_outubro uuid;
begin
  select id into v_turma
  from public.turmas
  where status = 'ativa' and tipo = 'presencial_comunidade'
  order by data_evento asc nulls last
  limit 1;

  if v_turma is null then
    raise notice 'Nenhuma turma presencial ativa encontrada; seed ignorado.';
    return;
  end if;

  if not exists (select 1 from public.turma_datas where turma_id = v_turma) then
    insert into public.turma_datas (turma_id, rotulo, data_inicio, vagas)
    values (v_turma, '24 e 25 de outubro', '2026-10-24', 10)
    returning id into v_outubro;

    insert into public.turma_datas (turma_id, rotulo, data_inicio, vagas)
    values (v_turma, '7 e 8 de novembro', '2026-11-07', 10);

    update public.matriculas
    set turma_data_id = v_outubro
    where turma_id = v_turma and turma_data_id is null;
  end if;
end $$;
