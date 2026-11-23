// Publica o catálogo direto no GitHub (e a Vercel atualiza o site sozinha).
// Variáveis de ambiente na Vercel:
//   SENHA_EDICAO  → senha que você digita no modo edição
//   GITHUB_TOKEN  → token do GitHub com permissão "Contents: Read and write" só neste repositório
//   GITHUB_REPO   → ex.: vitoriasoy09-hub/confeitalabsite
//   GITHUB_BRANCH → opcional (padrão: main)
const crypto = require('crypto');
const GH = 'https://api.github.com';

function senhaConfere(a, b){
  const x = crypto.createHash('sha256').update(String(a)).digest();
  const y = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

async function gh(caminho, opcoes = {}){
  const r = await fetch(GH + caminho, {
    ...opcoes,
    headers: {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'confeitalab-site',
      ...(opcoes.body ? {'Content-Type': 'application/json'} : {})
    }
  });
  const texto = await r.text();
  let json; try { json = JSON.parse(texto); } catch { json = {message: texto}; }
  if(!r.ok){ const e = new Error(json.message || ('GitHub ' + r.status)); e.status = r.status; throw e; }
  return json;
}

// Todos os caminhos img/produtos/... citados no catálogo
function fotosUsadas(obj, conj = new Set()){
  if(typeof obj === 'string'){ if(obj.startsWith('img/produtos/')) conj.add(obj); }
  else if(Array.isArray(obj)) obj.forEach(v => fotosUsadas(v, conj));
  else if(obj && typeof obj === 'object') Object.values(obj).forEach(v => fotosUsadas(v, conj));
  return conj;
}

module.exports = async (req, res) => {
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const configurado = !!(process.env.GITHUB_TOKEN && repo && process.env.SENHA_EDICAO);
  res.setHeader('Cache-Control', 'no-store');

  if(req.method === 'GET') return res.status(200).json({configurado});
  if(req.method !== 'POST') return res.status(405).json({erro: 'Método não permitido.'});
  if(!configurado) return res.status(503).json({erro: 'A publicação ainda não foi configurada na Vercel.'});

  let corpo = req.body || {};
  if(typeof corpo === 'string'){ try { corpo = JSON.parse(corpo); } catch { corpo = {}; } }

  if(!senhaConfere(corpo.senha || '', process.env.SENHA_EDICAO)){
    await new Promise(r => setTimeout(r, 1200));
    return res.status(401).json({erro: 'Senha incorreta.'});
  }

  try{
    if(corpo.acao === 'verificar') return res.status(200).json({ok: true});

    if(corpo.acao === 'foto'){
      if(typeof corpo.conteudo !== 'string' || !corpo.conteudo || corpo.conteudo.length > 4000000)
        return res.status(400).json({erro: 'Foto inválida ou grande demais.'});
      const blob = await gh(`/repos/${repo}/git/blobs`, {method: 'POST', body: JSON.stringify({content: corpo.conteudo, encoding: 'base64'})});
      return res.status(200).json({sha: blob.sha});
    }

    if(corpo.acao === 'salvar'){
      let dados;
      try { dados = JSON.parse(corpo.dados); } catch { return res.status(400).json({erro: 'Catálogo inválido.'}); }
      if(!dados || !Array.isArray(dados.produtos) || !Array.isArray(dados.categorias))
        return res.status(400).json({erro: 'Catálogo incompleto.'});
      const fotos = Array.isArray(corpo.fotos) ? corpo.fotos : [];
      for(const f of fotos){
        if(!/^img\/produtos\/[\w.-]+$/.test(f.path || '') || !/^[0-9a-f]{40}$/.test(f.sha || ''))
          return res.status(400).json({erro: 'Foto com nome inválido.'});
      }

      const ref = await gh(`/repos/${repo}/git/ref/heads/${branch}`);
      const base = await gh(`/repos/${repo}/git/commits/${ref.object.sha}`);
      const arvore = await gh(`/repos/${repo}/git/trees/${base.tree.sha}?recursive=1`);

      const usadas = fotosUsadas(dados);
      const novas = new Set(fotos.map(f => f.path));
      const itens = [
        {path: 'data/dados.json', mode: '100644', type: 'blob', content: JSON.stringify(dados, null, 1) + '\n'},
        ...fotos.map(f => ({path: f.path, mode: '100644', type: 'blob', sha: f.sha}))
      ];
      // limpeza: fotos que nenhum produto usa mais e cópias "dados (1).json"
      for(const n of arvore.tree || []){
        if(n.type !== 'blob') continue;
        const fotoSobrando = n.path.startsWith('img/produtos/') && !usadas.has(n.path) && !novas.has(n.path);
        const copiaDados = /^data\/dados \(\d+\)\.json$/.test(n.path);
        if(fotoSobrando || copiaDados) itens.push({path: n.path, mode: '100644', type: 'blob', sha: null});
      }

      const novaArvore = await gh(`/repos/${repo}/git/trees`, {method: 'POST', body: JSON.stringify({base_tree: base.tree.sha, tree: itens})});
      const commit = await gh(`/repos/${repo}/git/commits`, {method: 'POST', body: JSON.stringify({
        message: 'Catálogo atualizado pelo site', tree: novaArvore.sha, parents: [ref.object.sha]
      })});
      await gh(`/repos/${repo}/git/refs/heads/${branch}`, {method: 'PATCH', body: JSON.stringify({sha: commit.sha})});
      return res.status(200).json({ok: true});
    }

    return res.status(400).json({erro: 'Ação inválida.'});
  }catch(e){
    const semPermissao = e.status === 401 || e.status === 403 || e.status === 404;
    return res.status(502).json({erro: semPermissao
      ? 'O GitHub recusou o acesso. Confira o GITHUB_TOKEN e o GITHUB_REPO na Vercel.'
      : 'Não foi possível falar com o GitHub agora: ' + e.message});
  }
};
