/* ===== Dados do catálogo (editados pelo modo de edição do próprio site) ===== */
/* Os dados vêm de data/dados.json (Vercel) ou de um bloco embutido (versão no Claude) */
let DADOS = null;
let SALVO = '';
let modoArquivo = false; // true = edição fora do Claude (baixa o dados.json)
let filtroAtual = 'todos';
let festAtual = '';
const DESC_PADRAO = 'Mais definição e qualidade nas suas produções🧁💖\nDimensão do produto aprox. 3,5x3,5x3cm📏\nConsultar disponibilidade de cor.';
function normalizar(d){
  d.config = d.config || {whatsapp:'', instagram:''};
  if(!Array.isArray(d.categorias)) d.categorias = [];
  if(!Array.isArray(d.produtos)) d.produtos = [];
  if(!Array.isArray(d.festividades)) d.festividades = [];
  d.produtos.forEach(p=>{ if(!Array.isArray(p.fest)) p.fest = []; });
  return d;
}
async function carregarDados(){
  const emb = document.getElementById('dados');
  if(emb && emb.textContent.trim()) return JSON.parse(emb.textContent);
  const r = await fetch('data/dados.json', {cache:'no-cache'});
  if(!r.ok) throw new Error('dados');
  return r.json();
}
let editando = false;

const ILUS = {
  ejetor:`<svg viewBox="0 0 100 100"><rect x="38" y="8" width="24" height="40" rx="10" fill="#EE8FA3"/><rect x="30" y="44" width="40" height="12" rx="6" fill="#D9707F"/><circle cx="50" cy="76" r="18" fill="#F4DCC7" stroke="#D9707F" stroke-width="4"/><path d="M50 84c-6-4-10-7-10-11 0-3 2-5 5-5 2 0 4 1 5 3 1-2 3-3 5-3 3 0 5 2 5 5 0 4-4 7-10 11z" fill="#EE8FA3"/></svg>`,
  realista:`<svg viewBox="0 0 100 100"><path d="M50 92C28 80 18 62 22 46c4-14 18-18 28-12 10-6 24-2 28 12 4 16-6 34-28 46z" fill="#EE8FA3"/><path d="M38 24c4 6 8 8 12 8s8-2 12-8c-4-2-8 0-12 3-4-3-8-5-12-3z" fill="#7CBFB1"/><g fill="#FFF1E8">${[[36,50],[50,46],[64,50],[42,62],[58,62],[50,74],[34,64],[66,64]].map(p=>`<ellipse cx="${p[0]}" cy="${p[1]}" rx="2" ry="3"/>`).join('')}</g></svg>`,
  carimbo:`<svg viewBox="0 0 100 100"><ellipse cx="50" cy="18" rx="14" ry="10" fill="#EE8FA3"/><rect x="43" y="22" width="14" height="30" fill="#D9707F"/><rect x="22" y="50" width="56" height="16" rx="8" fill="#EE8FA3"/><ellipse cx="50" cy="80" rx="30" ry="10" fill="#5B2E1F"/><path d="M50 84c-5-3-8-5-8-8 0-2 2-4 4-4 2 0 3 1 4 2 1-1 2-2 4-2 2 0 4 2 4 4 0 3-3 5-8 8z" fill="#EE8FA3"/></svg>`,
  cortador:`<svg viewBox="0 0 100 100"><path d="M28 70c-10 0-16-7-16-15s6-14 14-14c2-11 11-18 22-18 9 0 17 5 20 13 2-1 4-1 6-1 9 0 16 7 16 16s-7 19-16 19z" fill="none" stroke="#E7C3A6" stroke-width="10" stroke-linejoin="round"/><path d="M28 70c-10 0-16-7-16-15s6-14 14-14c2-11 11-18 22-18 9 0 17 5 20 13 2-1 4-1 6-1 9 0 16 7 16 16s-7 19-16 19z" fill="none" stroke="#F4DCC7" stroke-width="5" stroke-linejoin="round"/></svg>`,
  rolinho:`<svg viewBox="0 0 100 100"><rect x="4" y="44" width="16" height="10" rx="5" fill="#5B2E1F"/><rect x="80" y="44" width="16" height="10" rx="5" fill="#5B2E1F"/><rect x="18" y="30" width="64" height="38" rx="12" fill="#9FD3C9"/><g fill="#fff">${[...Array(12)].map((_,i)=>`<circle cx="${28+(i%6)*9}" cy="${40+Math.floor(i/6)*18+(i%2?4:0)}" r="3"/>`).join('')}</g></svg>`
};
const IC = {
  lapis:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  lixo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>',
  esq:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  dir:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>',
  foto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="3"/><circle cx="12" cy="12.5" r="3.5"/><path d="M8 5l1.5-2h5L16 5"/></svg>',
  colar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="3" width="8" height="4" rx="1"/><path d="M16 5h2a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2"/></svg>',
  mais:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>'
};

const esc = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $ = id => document.getElementById(id);
const cat = id => DADOS.categorias.find(c=>c.id===id) || DADOS.categorias[0] || {};
const zapLink = msg => `https://wa.me/${DADOS.config.whatsapp}?text=${encodeURIComponent(msg)}`;
const novoId = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2,6);
const imgOuIlus = (img, c, cls='') => img ? `<img class="${cls}" src="${img}" alt="" loading="lazy">` : (ILUS[c.ilus]||'');

/* ===== Render ===== */
function renderTudo(){
  renderCats(); renderFests(); renderFiltros(); renderGrade(); renderContatos(); marcarPendente();
}
function renderCats(){
  $('cats').innerHTML = DADOS.categorias.map(c=>`
    <div class="cat" data-cat="${c.id}">
      <div class="ilus ${c.img?'com-foto':''}" style="background:${c.cor}">${imgOuIlus(c.img,c)}
        <div class="ed-tools"><button class="ed-btn" data-acao="editCat" data-id="${c.id}" title="Editar categoria">${IC.lapis}</button></div>
      </div>
      <h3>${esc(c.nome)}</h3><p>${esc(c.desc)}</p>
      <span class="btn btn-rosa">Ver modelos</span>
    </div>`).join('');
  $('cats').querySelectorAll('.cat').forEach(el=>el.addEventListener('click',ev=>{
    if(ev.target.closest('.ed-tools')) return;
    filtrar(el.dataset.cat,true);
  }));
  $('rodCats').innerHTML = DADOS.categorias.map(c=>`<a href="#catalogo" data-f="${c.id}">${esc(c.nome)}</a>`).join('');
  $('rodCats').querySelectorAll('a').forEach(a=>a.onclick=()=>filtrar(a.dataset.f));
}
function renderFiltros(){
  $('filtros').innerHTML = `<button data-f="todos">Todos</button>` +
    DADOS.categorias.map(c=>`<button data-f="${c.id}">${esc(c.nome)}</button>`).join('');
  $('filtros').querySelectorAll('button').forEach(b=>{
    b.classList.toggle('ativo',b.dataset.f===filtroAtual);
    b.onclick=()=>filtrar(b.dataset.f);
  });
}
function renderFests(){
  $('fests').innerHTML = DADOS.festividades.map(f=>{
    const n = DADOS.produtos.filter(p=>p.fest.includes(f)).length;
    return `<button class="fest" data-fest="${esc(f)}"><b>${esc(f)}</b><small>${n?n+(n>1?' modelos':' modelo'):'Sob encomenda'}</small></button>`;
  }).join('');
  $('fests').querySelectorAll('.fest').forEach(b=>b.onclick=()=>filtrarFest(b.dataset.fest));
}
function filtrarFest(f){
  festAtual = f; filtroAtual = 'todos';
  $('filtros').querySelectorAll('button').forEach(b=>b.classList.toggle('ativo',b.dataset.f==='todos'));
  renderGrade();
  $('catalogo').scrollIntoView({behavior:'smooth'});
}
const visivel = p => festAtual ? p.fest.includes(festAtual) : (filtroAtual==='todos' || p.cat===filtroAtual);
function filtrar(f, rolar){
  filtroAtual = f; festAtual = '';
  $('filtros').querySelectorAll('button').forEach(b=>b.classList.toggle('ativo',b.dataset.f===f));
  renderGrade();
  if(rolar) $('catalogo').scrollIntoView({behavior:'smooth'});
}
function renderGrade(){
  const lista = DADOS.produtos.filter(visivel);
  $('festAtiva').hidden = !festAtual;
  if(festAtual) $('festAtiva').innerHTML = `Festividade: <span>${esc(festAtual)}<button type="button" id="festLimpar" aria-label="Limpar">×</button></span>`;
  if(festAtual) $('festLimpar').onclick = ()=>filtrar('todos');
  let html = editando ? `<button class="prod novo" data-acao="novo">${IC.mais}<span>Adicionar produto</span></button>` : '';
  html += lista.map(p=>{
    const c = cat(p.cat);
    return `<div class="prod">
      <div class="foto ${p.img?'com-foto':''} ${p.img&&p.img2?'duas':''}" style="background:${c.cor}">
        ${p.tag?`<span class="tag">${esc(p.tag)}</span>`:''}${imgOuIlus(p.img,c)}${p.img&&p.img2?`<img class="img2" src="${p.img2}" alt="" loading="lazy"><span class="pontos" data-troca><i></i><i></i></span>`:''}
        <div class="ed-tools">
          <button class="ed-btn" data-acao="mover" data-dir="-1" data-id="${p.id}" title="Mover para trás">${IC.esq}</button>
          <button class="ed-btn" data-acao="mover" data-dir="1" data-id="${p.id}" title="Mover para frente">${IC.dir}</button>
          <button class="ed-btn" data-acao="editar" data-id="${p.id}" title="Editar">${IC.lapis}</button>
          <button class="ed-btn perigo" data-acao="excluir" data-id="${p.id}" title="Excluir">${IC.lixo}</button>
        </div>
      </div>
      <div class="info">
        <h3>${esc(p.nome)}</h3><p>${esc(p.desc)}</p>
        <div class="preco">${p.preco?esc(p.preco):'<small>Sob consulta</small>'}</div>
        <a class="btn btn-rosa" target="_blank" rel="noopener" href="${zapLink(`Olá! Vi no site e quero o *${p.nome}*`)}">Pedir no WhatsApp</a>
      </div>
    </div>`;}).join('');
  if(!lista.length && !editando) html = festAtual
    ? `<div class="vazio">Fazemos modelos de <b>${esc(festAtual)}</b> sob encomenda. Chame no WhatsApp e peça o seu!<br><a class="btn btn-rosa" target="_blank" rel="noopener" href="${zapLink(`Olá! Quero modelos para ${festAtual}`)}">Quero modelos de ${esc(festAtual)}</a></div>`
    : `<p class="vazio">Em breve novos modelos nesta categoria. Chame no WhatsApp e peça o seu personalizado!</p>`;
  $('grade').innerHTML = html;
}
function renderContatos(){
  const w = DADOS.config.whatsapp, ig = DADOS.config.instagram.replace(/^@/,'');
  document.querySelectorAll('[data-zap]').forEach(a=>{a.href=zapLink(a.dataset.zap);a.target='_blank';a.rel='noopener'});
  const fmt = w.replace(/^55(\d{2})(\d{4,5})(\d{4})$/,'($1) $2-$3');
  document.querySelectorAll('.numZap').forEach(e=>e.textContent=fmt);
  const url = `https://instagram.com/${ig}`;
  ['linkInsta'].forEach(id=>{$(id).href=url;$(id).target='_blank';});
  document.querySelectorAll('.instaRod').forEach(a=>{a.href=url;a.target='_blank';});
  $('userInsta').textContent='@'+ig;
  document.querySelectorAll('.userInsta2').forEach(e=>e.textContent='@'+ig);
}

/* ===== Modo de edição ===== */
let artifactApi = null;

async function iniciarEdicao(){
  try{
    const user = await claude.use('user');
    const pode = user ? ((await user.canEdit()) || (await user.isOwner())) : false;
    if(!pode) return;
    if(modoArquivo) return;
    artifactApi = await claude.use('artifact');
    if(!artifactApi) return;
    $('btnEditar').hidden = false;
  }catch(e){ /* visitante comum: sem edição */ }
}
function alternarEdicao(on){
  editando = on;
  document.body.classList.toggle('editando',on);
  $('barraEd').hidden = !on;
  $('btnEditar').hidden = on;
  renderGrade();
  if(on) $('catalogo').scrollIntoView({behavior:'smooth'});
}
function pendente(){ return JSON.stringify(DADOS)!==SALVO; }
function marcarPendente(){
  const p = pendente();
  $('edStatus').textContent = p ? (modoArquivo?'Alterações ainda não baixadas':'Alterações ainda não publicadas') : (modoArquivo?'Sem alterações novas':'Tudo publicado');
  $('edStatus').classList.toggle('pend',p);
  $('btnPublicar').disabled = modoArquivo ? false : !p;
  $('btnDescartar').disabled = !p;
}

document.addEventListener('click', ev=>{
  const ft = ev.target.closest('.foto.duas');
  if(ft && !ev.target.closest('.ed-tools')) ft.classList.toggle('v2');
  const b = ev.target.closest('[data-acao]'); if(!b) return;
  ev.preventDefault(); ev.stopPropagation();
  const id = b.dataset.id, a = b.dataset.acao;
  if(a==='novo') abrirProduto(null);
  if(a==='editar') abrirProduto(id);
  if(a==='excluir') confirmarExcluir(id);
  if(a==='editCat') abrirCategoria(id);
  if(a==='mover'){
    const arr = DADOS.produtos, i = arr.findIndex(p=>p.id===id);
    // move dentro da lista visível (respeita o filtro)
    const vis = arr.map((p,k)=>k).filter(k=>visivel(arr[k]));
    const pos = vis.indexOf(i), alvo = vis[pos + Number(b.dataset.dir)];
    if(alvo===undefined) return;
    [arr[i],arr[alvo]]=[arr[alvo],arr[i]];
    renderGrade(); marcarPendente();
  }
});

/* --- Imagem: reduz e comprime para caber no site --- */
function lerImagem(file, max=800){
  return new Promise((res,rej)=>{
    const fr = new FileReader();
    fr.onerror = ()=>rej(new Error('Não consegui ler a imagem'));
    fr.onload = ()=>{
      const im = new Image();
      im.onerror = ()=>rej(new Error('Formato de imagem não suportado'));
      im.onload = ()=>{
        const s = Math.min(1, max/Math.max(im.width,im.height));
        const cv = document.createElement('canvas');
        cv.width = Math.round(im.width*s); cv.height = Math.round(im.height*s);
        const cx = cv.getContext('2d');
        cx.fillStyle='#fff'; cx.fillRect(0,0,cv.width,cv.height);
        cx.drawImage(im,0,0,cv.width,cv.height);
        let url = cv.toDataURL('image/webp',0.8);
        if(!url.startsWith('data:image/webp')) url = cv.toDataURL('image/jpeg',0.82);
        res(url);
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* --- Modal genérico --- */
function abrirModal(html){
  SLOTS = {}; slotAtivo = null;
  $('modalCorpo').innerHTML = html;
  $('modal').hidden = false;
  document.body.style.overflow='hidden';
}
function fecharModal(){ $('modal').hidden = true; document.body.style.overflow=''; }
$('modal').addEventListener('click',e=>{ if(e.target.id==='modal' || e.target.closest('[data-fechar]')) fecharModal(); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape' && !$('modal').hidden) fecharModal(); });

function campoFoto(img, c, suf='', rotulo=''){
  return `<div class="f-slot">${rotulo?`<div class="f-rot">${rotulo}</div>`:''}<div class="f-foto" style="background:${c.cor}" id="fPrev${suf}">${img?`<img src="${img}" alt="">`:(suf==='2'?`<span class="f-vazio">${IC.foto}</span>`:(ILUS[c.ilus]||''))}</div>
    <div class="f-foto-btns">
      <label class="btn btn-rosa btn-p">${IC.foto}<span id="fLbl${suf}">${img?'Trocar':'Adicionar'}</span><input type="file" accept="image/*" id="fArq${suf}" hidden></label>
      <button type="button" class="btn btn-claro btn-p" id="fColar${suf}" title="Colar uma imagem copiada">${IC.colar}<span>Colar</span></button>
      <button type="button" class="btn btn-claro btn-p" id="fTirar${suf}" ${img?'':'hidden'}>Remover</button>
    </div><p class="f-msg" id="fMsg${suf}"></p></div>`;
}
const DICA_COLAR = `<p class="f-dica">Dica: copie uma foto (no celular, segure a foto e toque em <b>Copiar</b>; no computador, botão direito → <b>Copiar imagem</b>) e toque em <b>Colar</b>. No computador também dá para apertar <b>Ctrl + V</b> ou arrastar a foto para o quadrinho.</p>`;

/* --- Colar imagem: guarda quais quadrinhos de foto estão abertos no modal --- */
let SLOTS = {};      // suf -> {aplicar, cheio}
let slotAtivo = null;
async function imagemDoClipboard(){
  if(!navigator.clipboard || !navigator.clipboard.read) throw new Error('Este navegador não deixa colar pelo botão. Use Ctrl + V ou o botão Adicionar.');
  let itens;
  try{ itens = await navigator.clipboard.read(); }
  catch(e){ throw new Error('O navegador não deixou colar. Permita o acesso à área de transferência ou use Ctrl + V.'); }
  for(const it of itens){
    const tipo = it.types.find(x=>x.startsWith('image/'));
    if(tipo) return await it.getType(tipo);
  }
  throw new Error('Nenhuma imagem copiada. Copie uma foto e tente de novo.');
}
function imagemDoEvento(dt){
  if(!dt) return null;
  for(const it of dt.items||[]) if(it.kind==='file' && it.type.startsWith('image/')) return it.getAsFile();
  for(const f of dt.files||[]) if(f.type.startsWith('image/')) return f;
  return null;
}
document.addEventListener('paste', e=>{
  if($('modal').hidden || !Object.keys(SLOTS).length) return;
  const img = imagemDoEvento(e.clipboardData); if(!img) return;   // texto normal: cola no campo
  e.preventDefault();
  let alvo = (slotAtivo!==null && SLOTS[slotAtivo]) ? slotAtivo : null;
  if(alvo===null){ const ordem = Object.keys(SLOTS).sort(); alvo = ordem.find(s=>!SLOTS[s].cheio()) ?? ordem[0]; }
  SLOTS[alvo].aplicar(img);
});
function ligarFoto(estado, c, chave='img', suf=''){
  const vazio = ()=> suf==='2' ? `<span class="f-vazio">${IC.foto}</span>` : (ILUS[c().ilus]||'');
  const aplicar = async f=>{
    $('fMsg'+suf).textContent='Preparando imagem…';
    try{ estado[chave] = await lerImagem(f); $('fPrev'+suf).innerHTML = `<img src="${estado[chave]}" alt="">`; $('fTirar'+suf).hidden=false; $('fLbl'+suf).textContent='Trocar'; $('fMsg'+suf).textContent='Foto colocada!'; setTimeout(()=>{ if($('fMsg'+suf)?.textContent==='Foto colocada!') $('fMsg'+suf).textContent=''; },1800); }
    catch(err){ $('fMsg'+suf).textContent = err.message; }
  };
  SLOTS[suf] = {aplicar, cheio:()=>!!estado[chave]};
  $('fArq'+suf).onchange = async e=>{
    const f = e.target.files[0]; if(!f) return;
    await aplicar(f); e.target.value='';
  };
  $('fColar'+suf).onclick = async ()=>{
    try{ await aplicar(await imagemDoClipboard()); }
    catch(err){ $('fMsg'+suf).textContent = err.message; }
  };
  const prev = $('fPrev'+suf);
  prev.title = 'Clique aqui e aperte Ctrl + V para colar, ou arraste uma foto';
  prev.onclick = ()=>{ slotAtivo = suf; document.querySelectorAll('.f-foto').forEach(x=>x.classList.toggle('ativo', x===prev)); };
  prev.ondragover = e=>{ e.preventDefault(); prev.classList.add('ativo'); };
  prev.ondragleave = ()=> prev.classList.remove('ativo');
  prev.ondrop = e=>{ e.preventDefault(); prev.classList.remove('ativo'); const f = imagemDoEvento(e.dataTransfer); if(f) aplicar(f); else $('fMsg'+suf).textContent='Solte uma imagem aqui.'; };
  $('fTirar'+suf).onclick = ()=>{ estado[chave]=''; $('fPrev'+suf).innerHTML = vazio(); $('fTirar'+suf).hidden=true; $('fLbl'+suf).textContent='Adicionar'; };
}

function abrirProduto(id){
  const orig = id ? DADOS.produtos.find(p=>p.id===id) : null;
  const est = orig ? {...orig} : {id:novoId(), cat: filtroAtual!=='todos'?filtroAtual:DADOS.categorias[0].id, nome:'', desc:DESC_PADRAO, preco:'', tag:'', img:'', img2:'', fest: festAtual?[festAtual]:[]};
  abrirModal(`
    <h3>${orig?'Editar produto':'Novo produto'}</h3>
    <form id="fProd">
      <div class="f-duas">${campoFoto(est.img, cat(est.cat), '', 'Foto 1 (principal)')}${campoFoto(est.img2||'', cat(est.cat), '2', 'Foto 2 (opcional)')}</div>
      ${DICA_COLAR}
      <label>Categoria<select id="fCat">${DADOS.categorias.map(c=>`<option value="${c.id}" ${c.id===est.cat?'selected':''}>${esc(c.nome)}</option>`).join('')}</select></label>
      <label>Nome do produto<input id="fNome" required maxlength="80" value="${esc(est.nome)}" placeholder="Ex.: Ejetor Coração"></label>
      <label>Descrição curta<textarea id="fDesc" maxlength="400" rows="4" placeholder="Ex.: Ideal para brigadeiros de 15g a 22g">${esc(est.desc)}</textarea></label>
      <div class="f-linha">
        <label>Preço <small>(vazio = Sob consulta)</small><input id="fPreco" maxlength="30" value="${esc(est.preco)}" placeholder="Ex.: R$ 25,00"></label>
        <label>Etiqueta <small>(opcional)</small><input id="fTag" maxlength="24" value="${esc(est.tag)}" placeholder="Ex.: Novidade"></label>
      </div>
      <div class="f-grupo">Festividades <small style="font-weight:600;color:var(--choco-sua)">(opcional)</small></div>
      <div class="f-fests">${DADOS.festividades.map(f=>`<label><input type="checkbox" name="fFest" value="${esc(f)}" ${est.fest.includes(f)?'checked':''}>${esc(f)}</label>`).join('')}</div>
      <div class="f-acoes"><button type="button" class="btn btn-claro" data-fechar>Cancelar</button><button class="btn btn-rosa">${orig?'Salvar':'Adicionar'}</button></div>
    </form>`);
  ligarFoto(est, ()=>cat($('fCat').value));
  ligarFoto(est, ()=>cat($('fCat').value), 'img2', '2');
  $('fCat').onchange = ()=>{ const c=cat($('fCat').value); $('fPrev').style.background=c.cor; $('fPrev2').style.background=c.cor; if(!est.img) $('fPrev').innerHTML=ILUS[c.ilus]||''; };
  $('fProd').onsubmit = e=>{
    e.preventDefault();
    Object.assign(est,{cat:$('fCat').value, nome:$('fNome').value.trim(), desc:$('fDesc').value.trim(), preco:$('fPreco').value.trim(), tag:$('fTag').value.trim(), fest:[...document.querySelectorAll('input[name=fFest]:checked')].map(x=>x.value)});
    if(!est.nome){ $('fNome').focus(); return; }
    if(!est.img && est.img2){ est.img = est.img2; est.img2 = ''; }
    if(orig) Object.assign(orig, est); else DADOS.produtos.unshift(est);
    fecharModal(); renderFests(); renderGrade(); marcarPendente();
  };
}
function confirmarExcluir(id){
  const p = DADOS.produtos.find(x=>x.id===id); if(!p) return;
  abrirModal(`<h3>Excluir produto?</h3><p class="m-txt">“${esc(p.nome)}” sairá do catálogo.</p>
    <div class="f-acoes"><button class="btn btn-claro" data-fechar>Cancelar</button><button class="btn btn-perigo" id="mSim">Excluir</button></div>`);
  $('mSim').onclick = ()=>{ DADOS.produtos = DADOS.produtos.filter(x=>x.id!==id); fecharModal(); renderFests(); renderGrade(); marcarPendente(); };
}
function abrirCategoria(id){
  const c = cat(id), est = {img:c.img||''};
  abrirModal(`<h3>Editar categoria</h3><form id="fCatF">
    ${campoFoto(est.img, c)}
    ${DICA_COLAR}
    <label>Nome<input id="cNome" required maxlength="40" value="${esc(c.nome)}"></label>
    <label>Descrição<textarea id="cDesc" maxlength="140" rows="2">${esc(c.desc)}</textarea></label>
    <div class="f-acoes"><button type="button" class="btn btn-claro" data-fechar>Cancelar</button><button class="btn btn-rosa">Salvar</button></div></form>`);
  ligarFoto(est, ()=>c);
  $('fCatF').onsubmit = e=>{
    e.preventDefault();
    c.nome = $('cNome').value.trim()||c.nome; c.desc = $('cDesc').value.trim(); c.img = est.img;
    fecharModal(); renderCats(); renderFiltros(); renderGrade(); marcarPendente();
  };
}
function abrirConfig(){
  abrirModal(`<h3>Contatos do site</h3><form id="fCfg">
    <label>WhatsApp <small>(com 55 + DDD, só números)</small><input id="gZap" required pattern="\\d{12,13}" value="${esc(DADOS.config.whatsapp)}"></label>
    <label>Instagram <small>(sem @)</small><input id="gIg" required value="${esc(DADOS.config.instagram)}"></label>
    <div class="f-acoes"><button type="button" class="btn btn-claro" data-fechar>Cancelar</button><button class="btn btn-rosa">Salvar</button></div></form>`);
  $('fCfg').onsubmit = e=>{
    e.preventDefault();
    DADOS.config.whatsapp = $('gZap').value.replace(/\D/g,'');
    DADOS.config.instagram = $('gIg').value.trim().replace(/^@/,'');
    fecharModal(); renderTudo();
  };
}

/* --- Publicar: grava os dados dentro do próprio site --- */
async function fonteAtual(){
  for(const u of ['index.html', location.href.split('#')[0]]){
    try{
      const r = await fetch(u,{cache:'no-store'});
      if(r.ok){ const t = await r.text(); if(t.includes('id="dados"')) return t; }
    }catch(e){}
  }
  throw new Error('fonte');
}
function baixarDados(){
  const blob = new Blob([JSON.stringify(DADOS,null,1)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'dados.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
  SALVO = JSON.stringify(DADOS); marcarPendente();
  $('edStatus').textContent = 'dados.json baixado! Envie para a pasta "data" do GitHub para publicar.';
  $('edStatus').classList.add('pend');
}
function abrirArquivoDados(){
  const inp = document.createElement('input'); inp.type='file'; inp.accept='.json,application/json';
  inp.onchange = async ()=>{
    const f = inp.files[0]; if(!f) return;
    try{ DADOS = normalizar(JSON.parse(await f.text())); renderTudo(); $('edStatus').textContent='Arquivo aberto. Continue editando.'; }
    catch(e){ $('edStatus').textContent='Esse arquivo não é um dados.json válido.'; $('edStatus').classList.add('pend'); }
  };
  inp.click();
}
async function publicar(){
  if(modoArquivo) return baixarDados();
  const btn = $('btnPublicar'); btn.disabled = true; $('edStatus').textContent='Publicando…';
  try{
    const fonte = await fonteAtual();
    const json = JSON.stringify(DADOS,null,1).replace(/</g,'\\u003c');
    const nova = fonte.replace(/(<script id="dados" type="application\/json">)[\s\S]*?(<\/script>)/, (_,a,b)=>a+'\n'+json+'\n'+b);
    await artifactApi.publish(nova);
    SALVO = JSON.stringify(DADOS); marcarPendente();
    $('edStatus').textContent='Publicado! Atualizando…';
  }catch(e){
    const cod = e && (e.code||e.message||'');
    let msg = 'Não foi possível publicar agora. Tente de novo em instantes.';
    if(/conflict/i.test(cod)) msg = 'O site foi atualizado em outro lugar. A página vai recarregar com a versão mais nova.';
    if(/not_granted|not_writer/i.test(cod)) msg = 'Sua conta não tem permissão para editar este site.';
    $('edStatus').textContent = msg; $('edStatus').classList.add('pend');
    btn.disabled = false;
  }
}

$('btnEditar').onclick = ()=>alternarEdicao(true);
$('btnSair').onclick = ()=>alternarEdicao(false);
$('btnConfig').onclick = abrirConfig;
$('btnPublicar').onclick = publicar;
$('btnDescartar').onclick = ()=>{ DADOS = JSON.parse(SALVO); renderTudo(); };
window.addEventListener('beforeunload',e=>{ if(editando && pendente()){ e.preventDefault(); e.returnValue=''; } });

/* ===== Edição fora do Claude: abra o site com #editar no fim do endereço ===== */
function ativarModoArquivo(){
  if(artifactApi || modoArquivo) return;
  modoArquivo = true;
  $('btnPublicar').textContent = 'Baixar dados.json';
  $('btnAbrirDados').hidden = false;
  $('btnEditar').hidden = editando;
  marcarPendente();
}
function checarHashEdicao(){ if(location.hash === '#editar') ativarModoArquivo(); }
$('btnAbrirDados').onclick = abrirArquivoDados;

/* ===== Início ===== */
$('ano').textContent = new Date().getFullYear();
document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>$('menu').classList.remove('aberto')));
(async function iniciar(){
  try{ DADOS = normalizar(await carregarDados()); }
  catch(e){ $('grade').innerHTML = '<p class="vazio">Não foi possível carregar o catálogo. Atualize a página.</p>'; return; }
  SALVO = JSON.stringify(DADOS);
  renderTudo();
  checarHashEdicao();
  window.addEventListener('hashchange', checarHashEdicao);
  (function esperar(n){ if(window.claude && claude.use) iniciarEdicao(); else if(n<40) setTimeout(()=>esperar(n+1),250); })(0);
})();
