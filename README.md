# TITAN CRM 360

CRM comercial em desenvolvimento, com frontend React/TypeScript, API Node.js/Express e Supabase.

## Integrações
- Supabase: banco de dados e autenticação.
- WhatsApp: adaptador WPPConnect experimental.
- GitHub: versionamento do código.

## Como publicar o projeto local
Abra a pasta `titan-crm-360` no VS Code, verifique o `.gitignore`, então configure o remoto `https://github.com/matheusqueirozdocarmo2-svg/TITAN.git` e faça o primeiro push dos arquivos do código. **Nunca publique arquivos `.env` ou credenciais.**

## Configuração
Copie `.env.example` para `.env` e `apps/web/.env.example` para `apps/web/.env`. Preencha as configurações somente no computador local ou nas variáveis seguras do ambiente de hospedagem.

## Estado
Banco inicial migrado no projeto Supabase confirmado pelo proprietário. Código da aplicação ainda precisa ser sincronizado a partir da pasta local. Não está implantado em produção.
