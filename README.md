# Vecchio School

Landing page + plataforma (comunidade e calculadora de CMV) do curso "L'arte della pizza napoletana", da Pizzaria Vecchio Napoletana.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 4
- Framer Motion (animações de scroll)
- pnpm
- Supabase (auth, banco de dados) — plataforma da comunidade, integração em andamento

## Rodando localmente

```bash
pnpm install
pnpm dev
```

## Estrutura da landing page

As 9 seções do storyboard aprovado, em `src/components/sections/`, encadeadas em `src/app/page.tsx` com o componente `SeamDivider` fazendo a transição animada entre cada uma.

## Pendências conhecidas

- Logos dos parceiros Ctrade, Ciao, Bonfiore Latteria e LAB — aguardando envio do cliente
- Texto dos depoimentos da prova social (João Paulo Vilaverde e Luciana Soares) — aguardando envio do cliente
