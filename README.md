# Confeita Lab 3D · Site catálogo

Site estático: HTML, CSS e JavaScript puros. **Não precisa instalar nada, nem de build, nem de servidor.** Funciona no plano gratuito da Vercel.

## Estrutura

```
confeita-lab-3d/
├── index.html          → estrutura da página
├── css/style.css       → design, cores, animações (cascata do fundo) e versão celular
├── js/app.js           → catálogo, filtros, festividades, fotos, WhatsApp e modo edição
├── data/dados.json     → TODO o conteúdo editável: produtos, categorias, festividades, WhatsApp, Instagram
├── img/
│   ├── logo.webp, logo-sm.webp   → logo
│   ├── padrao.webp               → estampa do fundo em cascata
│   └── produtos/                 → fotos dos produtos
└── vercel.json         → configuração da Vercel (cache)
```

## Dependências externas

| O quê | Para quê | Precisa configurar? |
|---|---|---|
| Google Fonts (Fraunces, Nunito, Dancing Script) | Fontes do site | Não |
| wa.me (WhatsApp) | Botões de pedido | Não. O número fica em `data/dados.json` |
| instagram.com | Link do perfil | Não |
| Google Maps | Link do endereço | Não |

Não há chaves de API, banco de dados nem senhas.

## Publicar na Vercel (grátis)

1. Crie uma conta em **github.com** e um repositório novo (ex.: `confeita-lab-3d`).
2. No repositório, clique em **Add file → Upload files** e arraste **o conteúdo** desta pasta (index.html, css, js, data, img, vercel.json, README.md). Clique em **Commit changes**.
3. Crie uma conta em **vercel.com** entrando com o GitHub.
4. Clique em **Add New → Project**, escolha o repositório e clique em **Deploy**.
   - Framework Preset: **Other**
   - Build Command e Output Directory: deixe em branco
5. Em cerca de 1 minuto você recebe um link como `confeita-lab-3d.vercel.app`. É ele que vai na bio.

Depois disso, **toda vez que um arquivo mudar no GitHub, a Vercel atualiza o site sozinha.**

## Editar o catálogo

1. Abra o site com `#editar` no fim do endereço: `https://confeitalab3d.vercel.app/#editar`
2. Clique em **Editar catálogo**. Dá para:
   - **Adicionar vários**: escolha, cole (Ctrl + V) ou arraste várias fotos de uma vez, preencha categoria, preço e festividade uma vez só e digite só o nome de cada produto. Marque "Cada produto tem 2 fotos" para juntar as fotos de 2 em 2.
   - **Mudar nome e preço direto no cartão** do produto.
   - **Preço em lote**: muda o preço de todos, de uma categoria ou de uma festividade.
   - Lápis do produto: editar tudo, colar foto (botão **Colar**), trocar a ordem e excluir.
3. Clique em **Publicar no site** e digite a senha de edição. Em cerca de 1 minuto o site atualiza para todo mundo.

Se o botão aparecer como **Baixar dados.json**, a publicação direta ainda não foi configurada (veja abaixo). Nesse caso, baixe o arquivo e envie para a pasta `data` do GitHub.

## Configurar o botão "Publicar no site" (uma vez só)

O botão usa a função `api/publicar.js`, que grava o catálogo no GitHub. A Vercel atualiza o site sozinha.

1. **Criar o token no GitHub:** Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
   - Repository access: **Only select repositories** → `confeitalabsite`
   - Permissions → Repository permissions → **Contents: Read and write**
   - Copie o token gerado.
2. **Na Vercel:** projeto → Settings → **Environment Variables**. Adicione:
   - `GITHUB_TOKEN` = o token copiado
   - `GITHUB_REPO` = `vitoriasoy09-hub/confeitalabsite`
   - `SENHA_EDICAO` = uma senha só sua, para publicar
3. **Vercel → Deployments** → no último deploy, clique em ⋯ → **Redeploy**.

Segurança: o token fica guardado só na Vercel e nunca aparece no site. Sem a senha, ninguém consegue publicar.

## Pedir alterações ao Claude no futuro

- **Melhor opção:** conecte o seu GitHub no Claude e peça: *"abra o repositório confeita-lab-3d e faça tal alteração"*. O Claude altera os arquivos e envia direto, e a Vercel publica sozinha.
- **Sem conectar:** envie ao Claude o arquivo do que quer mudar (ou a pasta em .zip). Ele devolve os arquivos alterados para você subir no GitHub.

Dica: o arquivo `data/dados.json` do GitHub é sempre a versão oficial do catálogo.

## Testar no computador (opcional)

Como o site carrega `data/dados.json`, abrir o `index.html` com dois cliques pode não mostrar o catálogo. Para testar localmente, rode na pasta:

```
python3 -m http.server 8000
```

e abra `http://localhost:8000`.
