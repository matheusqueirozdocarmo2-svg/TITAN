# TITAN CRM 360

Monorepo real com React/Vite, API Node/Express, Supabase e interface de provedores WhatsApp.

## Incluído
- Login Supabase Auth (contas criadas pelo administrador).
- Painel com indicadores reais vindos do banco.
- Leads PF/PJ e múltiplos números por cliente (schema), criação, pesquisa e importação CSV/XLSX.
- Funil visual com mudança de estágio persistida.
- Papéis líder/vendedor, com filtro de leitura de leads do vendedor na API.
- Esquema SQL com RLS, tabelas de campanhas, grupos, oportunidades, tarefas e trilha de auditoria.
- Interface WhatsappProvider, provedor desabilitado seguro e adapter WPPConnect experimental.
- Testes unitários de importação.

## Requisitos
Node 22+, npm 10+, projeto Supabase novo. NÃO execute a migração em banco de produção sem revisão/backup.

## Instalação
1. `npm install` na raiz.
2. Copie `.env.example` para `.env` e `apps/web/.env.example` para `apps/web/.env` e configure as chaves. **Nunca coloque service_role em `apps/web/.env`.**
3. No Supabase SQL Editor, execute `supabase/migrations/001_init.sql`.
4. Em Supabase Authentication, crie os usuários e confirme que foram criados em `profiles`.
5. Execute no SQL Editor (substitua pelo UUID verdadeiro): `update public.profiles set role='leader' where id='UUID-DO-LIDER';`.
6. `npm run dev`. Frontend: http://localhost:5173, API: http://localhost:3001/health.
7. `npm test` e `npm run build`.

## Segurança
A API exige JWT Supabase em `/api/*`. O backend consulta o papel no banco e usa `service_role` somente no servidor. RLS bloqueia acesso direto do browser às tabelas comerciais. Para produção, configurar HTTPS, reverse proxy, backup, limites de requisição, logs, observabilidade e credenciais de curta duração.

## Limites conhecidos da primeira entrega
- WPPConnect adapter experimental: endpoints e payloads variam com a versão, requer teste real; QR/pairing e envio NÃO estão expostos pela UI. Padrão `WHATSAPP_PROVIDER=disabled`.
- Painel inclui métricas de oportunidades e tarefas; telas de edição dessas entidades serão feitas na próxima fase.
- `campaigns` são apenas schema e tela informativa. Sem scheduler ou envio automático nesta versão.
- Importação em lotes de até 5.000 linhas, sequencial; para volumes maiores adotar fila e transações RPC. Duplicação é checada por telefone, sem merge automático.
- API de leitura limitada a 200 leads por resposta, paginação pendente.
- Permissões de escrita mais granulares, rate limiting, auditoria automática, políticas LGPD e testes end-to-end devem ser fortalecidos antes de produção.
- Nunca vincule contas WhatsApp sem autorização ou use envios não solicitados.

## Sincronização de grupos (arquivados e não arquivados)

O TITAN consulta `GET /api/titan/all-groups`, `GET /api/titan/all-chats` e
`GET /api/titan/all-chats-archived` no WPPConnect Server. Os resultados são
combinados por ID `@g.us`, removendo contatos individuais e duplicados.
A interface permite filtrar e selecionar os grupos. A seleção é apenas local;
nenhuma campanha é enviada automaticamente nesta versão.

Exige `WHATSAPP_PROVIDER=wppconnect`, `WPP_BASE_URL`, `WPP_TOKEN` e sessão
`titan` previamente conectada no servidor WPPConnect. Verifique os endpoints
contra a versão específica instalada. Se qualquer chamada falhar, a API
retorna erro em vez de afirmar que encontrou todos os grupos.


## Gestão de usuários pelo TITAN (atualização)

1. Faça login com o usuário líder. Para o primeiro líder, use uma única vez o SQL abaixo, substituindo pelo UUID do usuário criado no Supabase Authentication:
   `update public.profiles set role='leader' where id='SEU-UUID';`
2. No Supabase, em **Authentication > URL Configuration**, configure **Site URL** como `http://localhost:5173` e adicione `http://localhost:5173/**` nas URLs de redirecionamento permitidas.
3. No `.env` do backend, configure `INVITE_REDIRECT_URL=http://localhost:5173/set-password`; configure SMTP no Supabase para convites reais e operação de produção (o serviço padrão tem limites).
4. Reinicie `npm run dev`, entre no TITAN e clique em **Gestão de usuários**. Informe nome, e-mail e papel. O convite usa Supabase Auth Admin **somente no backend**, com JWT válido e perfil de líder.
5. Quem receber o convite deve acessar o link do e-mail, definir a senha no fluxo do Supabase e entrar no TITAN. O comportamento exato de recuperação/criação de senha depende do template e fluxo configurado no Auth.

**Importante:** a primeira conta de líder ainda requer promoção inicial no SQL Editor. Convites exigem servidor configurado, um usuário líder autenticado e entrega de e-mail ativa. Não coloque `SUPABASE_SERVICE_ROLE_KEY` no frontend. O formulário não oferece cadastro público sem convite. A ação de desativar usuários ainda não foi implementada.
