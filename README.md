# RecicloHub

Plataforma de conexão para reciclagem sustentável, desenvolvida em [Next.js](https://nextjs.org) com foco em facilitar a oferta, busca e negociação de resíduos entre empresas e organizações do estado de Pernambuco.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Explicação das Rotas (API)](#explicação-das-rotas-api)
- [Explicação dos Componentes/Páginas](#explicação-dos-componentespáginas)
- [Padrões e Tecnologias](#padrões-e-tecnologias)
- [Próximos Passos (Backend)](#próximos-passos-backend)
- [Observações](#observações)
- [Contato](#contato)

---

## Visão Geral

O RecicloHub é um marketplace de resíduos, onde empresas podem:
- Publicar ofertas de resíduos (com fotos, descrição, quantidade, condições, disponibilidade e preço)
- Buscar resíduos disponíveis por cidade de Pernambuco, tipo de material e empresa
- Enviar propostas e negociar diretamente via chat
- Gerenciar suas próprias ofertas

---

## Estrutura do Projeto

```
src/
  app/
    feed/                # Página principal do feed de ofertas
    modals/              # Modais reutilizáveis (proposta, match, etc)
    my-offers/           # Página "Minhas Ofertas"
    register/            # Fluxo de cadastro multi-etapas
      step-2/
      step-3/
      success/
    residues/
      register/          # Cadastro de nova oferta de resíduo
    chat/                # Tela de chat e negociações
    api/                 # Rotas de API (Next.js Route Handlers)
      accept-proposal/
      consult-my-residues/
      consult-residues/
      consult-user/
      make-proposals/
      proposal-match-unique/
      proposals-accepted/
      received-proposal/
      register-residues/
      register-user/
    globals.css          # Estilos globais
    layout.tsx           # Layout principal
    page.tsx             # Página de login
public/
  RECICLOHUB_Green.png   # Logo
  favicon.ico
```

---

## Funcionalidades Principais

- **Login Simulado:** Armazena token fake no localStorage e redireciona para o feed.
- **Feed de Ofertas:** Lista resíduos disponíveis apenas de cidades de Pernambuco, com filtros por cidade e busca textual.
- **Proposta e Match:** Usuário pode enviar proposta para uma oferta, abrindo modal de proposta e, após envio, modal de match.
- **Cadastro Multi-etapas:** Cadastro dividido em etapas, com validação de campos e armazenamento temporário no localStorage.
- **Cadastro de Resíduo:** Formulário completo para publicar nova oferta, com upload de até 5 imagens, seleção de tipo, quantidade, condições e disponibilidade.
- **Minhas Ofertas:** Listagem das ofertas cadastradas pelo usuário, com ações de visualizar, editar e excluir (mock).
- **Chat:** Tela de conversas simuladas entre empresas.
- **Componentização:** Todos os modais e formulários são feitos sem bibliotecas de UI externas, apenas TailwindCSS e React.
- **Persistência:** Dados são salvos e consultados no Firestore (Firebase).

---

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Explicação das Rotas (API)

Todas as rotas estão em `src/app/api/` e usam Firestore como backend.

### `/api/register-user/route.ts`
- **POST**: Cadastra um novo usuário. Valida campos obrigatórios, verifica duplicidade de email e CNPJ, salva no Firestore e retorna o ID criado.

### `/api/consult-user/route.ts`
- **GET**: Consulta usuários. Se passado `email` na query, retorna usuário (incluindo senha, para login simulado). Sem parâmetro, retorna todos (sem senha).
- **POST**: Alternativa para cadastro de usuário (não utilizada no fluxo principal).

### `/api/register-residues/route.ts`
- **POST**: Cadastra uma nova oferta de resíduo, incluindo imagens (em base64), dados do resíduo e ID do usuário. Busca o nome da empresa do usuário para salvar junto.

### `/api/consult-residues/route.ts`
- **GET**: Lista todos os resíduos cadastrados no sistema.

### `/api/consult-my-residues/route.ts`
- **GET**: Lista resíduos cadastrados pelo usuário logado (filtra por `userId`).

### `/api/make-proposals/route.ts`
- **POST**: Envia uma proposta para um resíduo. Cria documento em `proposals` com status e IDs dos envolvidos.

### `/api/received-proposal/route.ts`
- **GET**: Lista propostas recebidas pelo usuário (usuário é dono do resíduo).

### `/api/accept-proposal/route.ts`
- **PATCH**: Aceita uma proposta. Atualiza status, move para `proposalAccepted`, marca como notificado e remove da coleção original.

### `/api/proposals-accepted/route.ts`
- **GET**: Lista todas as propostas aceitas onde o usuário está envolvido (userAId ou userBId).

### `/api/proposal-match-unique/route.ts`
- **PATCH**: Marca um usuário como notificado para um match específico (adiciona no array `notifiedUserIds`).

---

## Explicação dos Componentes/Páginas

### `src/app/layout.tsx`
- Layout global do projeto. Inclui fonte, estilos globais e o `MatchModalContainer` (modal de match disponível em todas as páginas).

### `src/app/page.tsx`
- **Login:** Formulário de login simulado. Consulta usuário por email, verifica senha (texto puro, apenas protótipo), salva token fake e userId no localStorage.

### `src/app/feed/page.tsx`
- **Feed de Ofertas:** Lista resíduos disponíveis, com filtros por cidade e busca textual. Permite abrir modal de proposta e visualizar detalhes do resíduo.

### `src/app/my-offers/page.tsx`
- **Minhas Ofertas:** Lista resíduos cadastrados pelo usuário logado. Permite visualizar, editar e excluir (ações de editar/excluir são mock).

### `src/app/my-offers/proposals-received/page.tsx`
- **Propostas Recebidas:** Lista propostas recebidas para os resíduos do usuário. Permite aceitar propostas e visualizar matches.

### `src/app/register/page.tsx`
- **Cadastro (Etapa 1):** Formulário inicial de cadastro (nome da empresa, email, CNPJ).

### `src/app/register/step-2/page.tsx`
- **Cadastro (Etapa 2):** Formulário de endereço (CEP, rua, cidade, estado, país).

### `src/app/register/step-3/page.tsx`
- **Cadastro (Etapa 3):** Criação de senha, aceite de termos e política de privacidade. Ao finalizar, envia dados para a API e faz login automático.

### `src/app/register/success/page.tsx`
- **Cadastro Sucesso:** Página de confirmação de cadastro (opcional, pode ser usada após cadastro).

### `src/app/residues/register/page.tsx`
- **Cadastro de Resíduo:** Formulário completo para cadastrar nova oferta de resíduo, com upload de até 5 imagens, seleção de tipo, quantidade, condições, disponibilidade e preço.

### `src/app/chat/page.tsx`
- **Chat:** Tela de conversas simuladas entre empresas. Mostra lista de matches e últimas mensagens (mock).

### `src/app/modals/proposal.tsx`
- **ProposalModal:** Modal para envio de proposta para uma oferta de resíduo.

### `src/app/modals/match.tsx`
- **MatchModal:** Modal exibido quando há um match aceito entre empresas. O `MatchModalContainer` verifica periodicamente se há matches não notificados para o usuário logado.

---

## Padrões e Tecnologias

- **Next.js App Router** (diretório `/app`)
- **TypeScript** para tipagem estática
- **TailwindCSS** para estilização
- **React Hooks** para controle de estado e efeitos
- **Sem dependências de UI externas** (componentes de formulário e modal feitos manualmente)
- **Firebase Firestore** para persistência de dados
- **Validação de formulários** feita manualmente em cada etapa

---

## Próximos Passos (Backend)

O projeto já utiliza Firestore como backend, mas para evoluir para um backend próprio:

1. Crie uma pasta `backend` na raiz do projeto.
2. Inicialize um projeto Node.js com Express e TypeScript.
3. Implemente rotas REST para:
   - Ofertas de resíduos
   - Cadastro e autenticação de usuários
   - Propostas e negociações
   - Upload de imagens
4. Integre o frontend com o backend usando chamadas HTTP (fetch/axios).
5. Implemente autenticação real (JWT).

---

## Observações

- Todas as cidades listadas nos filtros e nas ofertas são do estado de Pernambuco.
- O fluxo de cadastro e publicação de ofertas é totalmente funcional e persistido no Firestore.
- O projeto está pronto para receber integração com backend REST ou GraphQL, caso queira migrar do Firebase.

---

## Contato

Para dúvidas técnicas ou sugestões, abra uma issue ou entre em contato com os mantenedores do projeto.

---
