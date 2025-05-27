# RecicloHub

Plataforma de conexão para reciclagem sustentável, desenvolvida em [Next.js](https://nextjs.org) com foco em facilitar a oferta, busca e negociação de resíduos entre empresas e organizações do estado de Pernambuco.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Como rodar o projeto](#como-rodar-o-projeto)
- [Padrões e Tecnologias](#padrões-e-tecnologias)
- [Próximos Passos (Backend)](#próximos-passos-backend)

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
    residues/
      register/          # Cadastro de nova oferta de resíduo
    chat/                # Tela de chat e negociações
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

## Padrões e Tecnologias

- **Next.js App Router** (diretório `/app`)
- **TypeScript** para tipagem estática
- **TailwindCSS** para estilização
- **React Hooks** para controle de estado e efeitos
- **Sem dependências de UI externas** (componentes de formulário e modal feitos manualmente)
- **Mock de dados** para ofertas, usuários e chat (sem backend ainda)
- **Validação de formulários** feita manualmente em cada etapa

---

## Próximos Passos (Backend)

O projeto atualmente é apenas frontend. Para iniciar o backend:

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
- O fluxo de cadastro e publicação de ofertas é totalmente funcional no frontend, mas não persiste dados em banco.
- O projeto está pronto para receber integração com backend REST ou GraphQL.

---

## Contato

Para dúvidas técnicas ou sugestões, abra uma issue ou entre em contato com os mantenedores do projeto.

---
