# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Frontend
```bash
npm run dev       # Start dev server (Vite, hot reload) — http://localhost:5173
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Serve production build locally
```

### Backend
```bash
cd backend
python3 -m uvicorn app.main:app --port 8000 --reload  # http://localhost:8000
                                                       # Swagger: http://localhost:8000/docs
```

### Resetar banco de dados (ex: usuário esqueceu o PIN)
```bash
rm backend/colheita.db   # banco é recriado automaticamente no próximo startup
```

No test framework is configured.

## Auto-sync to remote `back` branch

A Claude Code Stop hook (`.claude/settings.json`) automatically stages all local changes, commits them, and pushes to `origin/back` at the end of every response turn that leaves uncommitted changes. The remote is `https://github.com/Henrique-Goncalves-Dev/minha-colheita-repo`.

The hook does nothing when the working tree is already clean.

## Architecture

**Minha Colheita** is a React 19 + TypeScript SPA built with Vite. It targets farmers (low digital literacy), so the UI emphasizes large touch targets, audio cues (`AudioButton`), and minimal text.

### Routing (`src/App.tsx`)

| Path | Screen | Purpose |
|---|---|---|
| `/` | `IdentificationScreen` | Name + phone input |
| `/pin` | `PinScreen` | 4-digit PIN entry |
| `/dashboard` | `HomeScreen` | Main action grid |
| `/plantio` | `PlantioScreen` | Register a new planting |
| `/plantacao` | `PlantacaoScreen` | List + edit plantings |
| `/tempo-plantacao` | `TempoPlantacaoScreen` | Estimated harvest time per seed (aggregated) |
| `/renda` | `RendaScreen` | Last sale, expenses per seed, profit estimator, sales history |
| `/renda/registrar` | `RegistrarVendaScreen` | New sale form (debits stock FIFO) |
| `/perfil` | `PerfilScreen` | User info + totals + logout |

Navigation is always forward (`/` → `/pin` → `/dashboard`); the back button on `PinScreen` uses `navigate(-1)`. Nome and telefone are passed from `IdentificationScreen` to `PinScreen` via React Router location state.

### Component roles

- **`AudioButton`** — plays audio instructions; two variants: `pill` (with waveform label) and `circle` (icon only). Appears on every screen.
- **`ActionCard`** — a square tappable card used in the dashboard grid; accepts `title`, `icon` (ReactNode), optional `bgColor` (Tailwind class), and optional `onClick`.
- **`CustomInput`** — labeled text/tel input with a leading icon; accepts `value` and `onChange` for controlled usage.
- **`PinPad`** — numeric keypad (0–9 + delete + confirm) rendered as a 3-column grid; state lives in `PinScreen`.
- **`EditModal`** — generic bottom-sheet/centered modal used by `PlantacaoScreen` and `RendaScreen` for editing plantio/venda records.

### Frontend API service (`src/services/api.ts`)

Centralizes all HTTP calls to the backend. Key exports:

- Auth: `registrar`, `entrar`, `getPerfil`, `logout`, `getToken`, `authHeaders`
- Plantio: `criarPlantio`, `listarPlantios`, `atualizarPlantio`, `excluirPlantio`, `listarEstoque`
- Venda: `registrarVenda`, `listarVendas`, `getResumoFinanceiro`, `getEstimativaLucro`, `atualizarVenda`, `excluirVenda`

Base URL defaults to `http://localhost:8000/api/v1`; override with `VITE_API_URL` env var.

### Styling

Tailwind CSS (utility-first via `index.css` and inline classes). The brand green palette uses literal hex values (`#345348`, `#4A6F62`, `#658B7D`, etc.) directly in JSX — no design token abstraction yet. Background color across all screens is `#EEF2F0`.

---

## Backend

Python + FastAPI. Pasta `backend/` na raiz do repositório. Banco de dados: SQLite (dev) com SQLAlchemy 2.x como ORM. Autenticação via JWT (python-jose) com PIN em hash bcrypt (passlib).

### Banco de Dados — Esquema Definitivo

```sql
-- Usuários
CREATE TABLE tab_usuario (
    id      INTEGER PRIMARY KEY,
    nome    VARCHAR(100) NOT NULL,
    telefone VARCHAR(11) NOT NULL,
    pin     VARCHAR(255) NOT NULL  -- hash bcrypt do PIN de 4 dígitos
);

-- Sementes/plantas (cadastro mestre)
CREATE TABLE tab_planta (
    id          INTEGER PRIMARY KEY,
    nome_planta VARCHAR(100) NOT NULL,
    descricao   VARCHAR(500)
);

-- Registro de plantios
CREATE TABLE tab_plantio (
    id             INTEGER PRIMARY KEY,  -- adicionado
    id_planta      INTEGER NOT NULL,
    id_usuario     INTEGER NOT NULL,
    quantidade     INTEGER NOT NULL,     -- alterado de VARCHAR(4)
    custo          FLOAT   NOT NULL,
    data_plantacao DATETIME,
    CONSTRAINT fk_planta  FOREIGN KEY (id_planta)  REFERENCES tab_planta   (id) ON DELETE CASCADE,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES tab_usuario  (id) ON DELETE CASCADE
);

-- Vendas
CREATE TABLE tab_venda (
    id              INTEGER PRIMARY KEY,
    id_usuario      INTEGER NOT NULL,
    id_planta       INTEGER NOT NULL,
    quantidade      INTEGER NOT NULL,        -- alterado: era quatidade_planta VARCHAR(5)
    valor_recebido  FLOAT NOT NULL,
    data_da_compra  DATETIME,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES tab_usuario (id) ON DELETE CASCADE,
    CONSTRAINT fk_planta  FOREIGN KEY (id_planta)  REFERENCES tab_planta  (id) ON DELETE CASCADE
);

-- Itens de venda (rastreio FIFO de quanto saiu de cada plantio)
CREATE TABLE tab_venda_item (
    id         INTEGER PRIMARY KEY,
    id_venda   INTEGER NOT NULL,
    id_plantio INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    CONSTRAINT fk_venda   FOREIGN KEY (id_venda)   REFERENCES tab_venda   (id) ON DELETE CASCADE,
    CONSTRAINT fk_plantio FOREIGN KEY (id_plantio) REFERENCES tab_plantio (id) ON DELETE CASCADE
);
```

#### Decisões de esquema registradas

| Tabela | Decisão |
|---|---|
| `tab_plantio` | Adicionado `id INTEGER PRIMARY KEY` — sem ele era impossível identificar/editar registros individuais |
| `tab_usuario` | Adicionado `pin VARCHAR(255) NOT NULL` — armazena hash bcrypt do PIN de 4 dígitos do frontend |
| `tab_plantio.quantidade` | Alterado de `VARCHAR(4)` para `INTEGER NOT NULL` — evita dados inválidos |
| `tab_plantio.quantidade` (semântica) | Representa **estoque atual** (mutável). Vendas debitam diretamente desta coluna via FIFO (ordenado por `data_plantacao`, depois por `id`). Não há `quantidade_inicial` — se precisar do histórico, terá que ser adicionado. |
| `tab_venda.quantidade` | Renomeado de `quatidade_planta` (typo) e tipo alterado de `VARCHAR(5)` para `INTEGER NOT NULL` |
| `tab_venda_item` | Tabela nova. Registra de qual plantio (FIFO) saiu cada parcela da venda. Permite estornar com precisão ao excluir/editar uma venda. |
| `tab_renda` | **Não implementada.** Toda informação financeira é derivada agregando `tab_venda` por usuário (vide `GET /api/v1/vendas/resumo` e `GET /api/v1/auth/me`). |

### Estrutura do Backend

```
backend/
└── app/
    ├── main.py             # instância FastAPI + CORS + criação de tabelas no startup
    ├── database.py         # engine SQLAlchemy + SessionLocal + Base
    ├── dependencies.py     # get_db(), get_current_user() (decodifica JWT)
    ├── models/
    │   ├── usuario.py      # ORM: tab_usuario
    │   ├── plantio.py      # ORM: tab_planta + tab_plantio
    │   └── venda.py        # ORM: tab_venda + tab_venda_item
    ├── schemas/
    │   ├── usuario.py      # Pydantic: Registro, Login, Token, PerfilResponse
    │   ├── plantio.py      # Pydantic: PlantioCreate/Update/Response
    │   └── venda.py        # Pydantic: VendaCreate/Update/Response, ResumoFinanceiro, EstoqueItem, EstimativaLucro
    ├── routers/
    │   ├── auth.py         # /api/v1/auth/registro, /login, /me
    │   ├── plantio.py      # CRUD /api/v1/plantios + /estoque
    │   └── venda.py        # CRUD /api/v1/vendas + /resumo, /estimativa
    └── services/
        ├── auth_service.py    # hash_pin, verify_pin, create_access_token
        ├── plantio_service.py # queries de plantio
        └── venda_service.py   # vendas com débito FIFO, resumo financeiro, estimativa de lucro
```

### Endpoints

**Auth**

| Método | Rota | Ação |
|---|---|---|
| `POST` | `/api/v1/auth/registro` | Cria novo usuário |
| `POST` | `/api/v1/auth/login` | Retorna JWT |
| `GET` | `/api/v1/auth/me` | Perfil + totais agregados (plantios, sementes, vendas, arrecadado) |

**Plantio** (todos exigem `Authorization: Bearer <token>`):

| Método | Rota | Ação |
|---|---|---|
| `POST` | `/api/v1/plantios` | Criar plantio (cria/reutiliza planta em tab_planta) |
| `GET` | `/api/v1/plantios` | Listar plantios do usuário autenticado |
| `GET` | `/api/v1/plantios/estoque` | Estoque atual agregado por planta (`SUM(quantidade) HAVING > 0`) |
| `GET` | `/api/v1/plantios/{id}` | Buscar plantio específico |
| `PUT` | `/api/v1/plantios/{id}` | Atualizar plantio |
| `DELETE` | `/api/v1/plantios/{id}` | Excluir plantio |

**Venda** (todos exigem `Authorization: Bearer <token>`):

| Método | Rota | Ação |
|---|---|---|
| `POST` | `/api/v1/vendas` | Registrar venda. Valida estoque, debita FIFO em `tab_plantio.quantidade`, cria `tab_venda_item`. Retorna 400 se estoque insuficiente. |
| `GET` | `/api/v1/vendas` | Listar vendas do usuário (mais recente primeiro) |
| `GET` | `/api/v1/vendas/resumo` | `{ gastos_por_semente, ultima_venda, vendas[] }` |
| `GET` | `/api/v1/vendas/estimativa?id_planta=X&quantidade=Y` | Estima custo (média por unidade dos plantios) e receita/lucro (média por unidade das vendas anteriores). Retorna `sem_historico=true` se nunca houve venda da planta. |
| `PUT` | `/api/v1/vendas/{id}` | Editar quantidade/valor. Se quantidade muda, estorna itens antigos e debita FIFO de novo. |
| `DELETE` | `/api/v1/vendas/{id}` | Exclui e estorna o estoque dos plantios via `tab_venda_item` |

### Fluxo de autenticação

1. `IdentificationScreen` → usuário informa nome + telefone; ao avançar, ambos são passados via React Router state para `PinScreen`
2. `PinScreen` → ao confirmar o PIN, tenta `POST /api/v1/auth/login`
   - **404** → telefone não existe → chama `POST /api/v1/auth/registro` automaticamente, depois faz login (primeiro acesso transparente para o usuário)
   - **401** → PIN errado → exibe erro e reseta os círculos do PIN em vermelho
   - **200** → JWT salvo em `localStorage` (`mc_token`) → navega para `/dashboard`

### Dependências Python (`backend/requirements.txt`)

```
fastapi
uvicorn[standard]
sqlalchemy
aiosqlite
python-jose[cryptography]
passlib[bcrypt]
python-dotenv
```

### Variáveis de ambiente (`backend/.env` — nunca versionar)

```
SECRET_KEY=<string aleatória longa>
ACCESS_TOKEN_EXPIRE_HOURS=8
DATABASE_URL=sqlite+aiosqlite:///./colheita.db
```
