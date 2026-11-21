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

## Editar o catálogo (sem precisar de programador)

1. Abra o seu site com `#editar` no fim do endereço:
   `https://confeita-lab-3d.vercel.app/#editar`
2. Clique em **Editar catálogo**. Você pode adicionar, editar, reordenar ou excluir produtos, colocar até 2 fotos, marcar festividades, editar categorias e mudar WhatsApp e Instagram (botão **Contatos**).
3. Clique em **Baixar dados.json**.
4. No GitHub, abra a pasta **data**, clique em **Add file → Upload files**, envie o `dados.json` baixado (ele substitui o antigo) e clique em **Commit changes**.
5. Em cerca de 1 minuto o site está atualizado.

Observações:
- Quem visita o site normalmente não vê o botão de edição. Mesmo que alguém abra com `#editar`, só baixa um arquivo no próprio computador. Só quem tem acesso ao seu GitHub consegue publicar.
- O botão **Abrir dados.json** retoma uma edição a partir de um arquivo que você já baixou.
- As fotos novas ficam guardadas dentro do `dados.json`. Com muitas fotos novas o arquivo cresce. Quando quiser, peça ao Claude para "separar as fotos do dados.json em arquivos", e o site fica mais leve.

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
