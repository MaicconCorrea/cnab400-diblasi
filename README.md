# 🍕 Di Blasi Franchising — Gerador CNAB 400

Sistema interno para geração de remessa CNAB 400 (Banco do Brasil) a partir da planilha de faturamento mensal.

## ✨ O que faz

1. **Importa** a planilha de faturamento do cliente (`.xlsx` com abas Royalties 4% e Marketing 2%)
2. **Cruza** automaticamente com a base de 47 franqueados (CNPJ, endereço, razão social)
3. **Gera** dois boletos por franqueado: um de Royalties (R) e um de Marketing (M)
4. **Permite** revisar, editar Nr. Documento, Nosso Nº, vencimento e marcar quais entram no CNAB
5. **Exporta** o arquivo `.rem` pronto para o Gerenciador Financeiro BB + Excel de controle

---

## 🚀 Deploy (primeira vez)

### Pré-requisitos
- [Node.js 18+](https://nodejs.org)
- Conta no [GitHub](https://github.com)
- Conta no [Vercel](https://vercel.com) (grátis)

### Passo 1 — Subir no GitHub

```bash
# No terminal, dentro desta pasta:
git init
git add .
git commit -m "feat: gerador CNAB 400 Di Blasi"

# Criar repositório no GitHub (github.com → New repository)
# Nome sugerido: cnab400-diblasi  (deixe PRIVADO)
# Depois copie o endereço e execute:

git remote add origin https://github.com/SEU_USUARIO/cnab400-diblasi.git
git branch -M main
git push -u origin main
```

### Passo 2 — Conectar ao Vercel

1. Acesse [vercel.com](https://vercel.com) → **Add New Project**
2. Clique em **Import Git Repository** → selecione `cnab400-diblasi`
3. Framework: **Vite** (detectado automaticamente)
4. Clique em **Deploy**
5. Em ~1 minuto o app estará em `https://cnab400-diblasi.vercel.app`

---

## 🔄 Atualizar o sistema

Sempre que fizer alterações:

```bash
git add .
git commit -m "descrição da alteração"
git push
```

O Vercel faz o novo deploy automaticamente em ~30 segundos.

---

## 💻 Rodar localmente (desenvolvimento)

```bash
npm install
npm run dev
# Acesse http://localhost:5173
```

---

## 📁 Estrutura do projeto

```
cnab400-diblasi/
├── src/
│   ├── main.jsx        # Entry point React
│   └── App.jsx         # App completo (lógica + interface)
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```

---

## 🔐 Segurança

- Manter o repositório **PRIVADO** no GitHub
- Nenhum dado sensível é enviado para servidores externos
- Todo processamento acontece no **navegador** do usuário
- Os arquivos `.rem` e `.xlsx` são gerados e baixados localmente
