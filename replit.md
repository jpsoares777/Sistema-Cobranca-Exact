# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Main product: **Sistema de Cobrança** (billing/loan collection app).

## Artifacts

- `artifacts/cobranca-app` — React/Vite mobile-style PWA (main app, port via $PORT)
- `artifacts/api-server` — Express 5 API server (currently minimal)
- `artifacts/mockup-sandbox` — Vite component preview server for canvas mockups

## Sistema de Cobrança — Architecture

**PIN**: `10600` (5 digits, hardcoded in `PinLogin.tsx`)

### Key Files
- `src/App.tsx` — Root, wraps app in 430px mobile container, manages PIN lock state
- `src/pages/ListaClientes.tsx` — Main app (~1870 lines), all core logic
- `src/pages/PinLogin.tsx` — PIN login screen with gradient header
- `src/pages/RelatorioFinanceiro.tsx` — Financial report + Fechar Caixa + WhatsApp share
- `src/pages/EmprestimosDoDia.tsx` — Loan management, `emprestimentosIniciais` data
- `src/pages/ClienteDetalhe.tsx` — Client detail, payment types
- `src/lib/storage.ts` — localStorage JSON persistence layer

### Data Persistence (localStorage)
- Key: `cobranca_db_v1`
- **Daily-reset** (new day): `cobrados`, `ausentes`, `cobradosValores`
- **Persistent**: `emprestimentos`, `registroPagamentos`, `quitadosClientes`, `ordemClientesIds`, `cobradosExtras`, `novosClientesIds`, `renovacoesIds`, `clientesAdicionaisHoje`, `novosClientesOutras`, `agendamentos`, `despesas`, `rendimentos`
- Saves automatically via `useEffect` on every state change

### Constants
- `CAIXA_INICIAL = 3000` (in RelatorioFinanceiro.tsx)
- `RETIRADA = 0`
- Header gradient: `#2d4f6b → #3A5F82 → #4A6F8E`

## Stack

- **Monorepo**: pnpm workspaces
- **Frontend**: React 19 + Vite 7 + Tailwind CSS
- **Backend**: Express 5 + TypeScript
- **Build**: esbuild
