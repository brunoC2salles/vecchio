-- Marca se o aluno já criou a própria senha (usado para reenviar o link de acesso
-- só para quem ainda não criou). Gravada como true na tela /set-password.
alter table public.profiles
  add column if not exists senha_definida boolean not null default false;

-- Backfill: contas sem convite (criadas direto) e convidados que alteraram a conta
-- depois de confirmar o e-mail (a criação de senha atualiza o usuário no Auth).
update public.profiles p
set senha_definida = true
from auth.users u
where u.id = p.id
  and (
    u.invited_at is null
    or (u.email_confirmed_at is not null and u.updated_at > u.email_confirmed_at + interval '1 minute')
  );
