// app.js — 纯客户端渲染、搜索、分类、复制（无任何外链 CDN）
(async () => {
  let DATA;
  try { DATA = await fetch('resources.json', { cache: 'no-cache' }).then(r => r.json()); }
  catch (e) {
    document.getElementById('cards').innerHTML =
      '<p style="grid-column:1/-1;text-align:center;color:#dc2626;padding:40px">⚠️ 资源数据加载失败（resources.json），请检查部署。</p>';
    return;
  }

  const items = DATA.items;
  const cats = DATA.cats;
  const coverEmoji = { '掌机游戏': '🎮', '街机·主机': '🕹️', '开源掌机': '📟', '改版HACK': '⚡', '游戏周边': '📚' };
  const totalGB = DATA.totalSizeGB;
  const sizeFmt = GB => GB >= 1024 ? (GB / 1024).toFixed(2) + ' TB' : GB.toFixed(1) + ' GB';
  const coverSrc = no => 'covers/' + String(no).padStart(2, '0') + '.jpg';

  // 总览
  document.getElementById('statTotal').textContent = DATA.total;
  document.getElementById('statSize').textContent = sizeFmt(totalGB);
  document.getElementById('statFiles').textContent = (DATA.totalFiles || 0).toLocaleString();
  document.getElementById('lastUpdate').textContent = '更新于 ' + DATA.updated;

  // 分类计数
  const catCount = { '全部': DATA.total };
  cats.forEach(c => catCount[c] = items.filter(x => x.cat === c).length);

  // 侧栏分类
  const catList = document.getElementById('catList');
  catList.innerHTML = ['全部', ...cats].map(c =>
    `<li data-cat="${c}"><span>${c}</span><span class="count">${catCount[c]}</span></li>`
  ).join('');

  // 顶部快捷 chips
  const quickCats = document.getElementById('quickCats');
  quickCats.innerHTML = ['全部', ...cats].map(c =>
    `<span class="chip" data-cat="${c}">${c} <em style="font-style:normal;opacity:.6;font-size:11px;margin-left:4px">${catCount[c]}</em></span>`
  ).join('');

  // 状态
  let state = { cat: '全部', q: '', sort: 'default' };

  function applyFilter() {
    let list = items.slice();
    if (state.cat !== '全部') list = list.filter(x => x.cat === state.cat);
    if (state.q) {
      const q = state.q.toLowerCase().trim();
      list = list.filter(x =>
        x.name.toLowerCase().includes(q) ||
        x.cat.toLowerCase().includes(q) ||
        x.size.toLowerCase().includes(q) ||
        ('#' + x.no).includes(q)
      );
    }
    switch (state.sort) {
      case 'size-desc': list.sort((a, b) => b.sizeGB - a.sizeGB); break;
      case 'size-asc':  list.sort((a, b) => a.sizeGB - b.sizeGB); break;
      case 'no-asc':    list.sort((a, b) => a.no - b.no); break;
      case 'name':      list.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN')); break;
    }
    return list;
  }

  function render() {
    const list = applyFilter();
    const cards = document.getElementById('cards');
    const noRes = document.getElementById('noRes');
    const barTitle = document.getElementById('barTitle');
    let title = state.cat;
    if (state.q) title += ` · "${state.q}"`;
    barTitle.textContent = title + `（${list.length}）`;

    if (!list.length) { cards.innerHTML = ''; noRes.hidden = false; return; }
    noRes.hidden = true;
    cards.innerHTML = list.map(x => `
      <article class="card-r">
        <div class="cover" aria-hidden="true">
          <span class="cover-emoji" style="position:relative">${coverEmoji[x.cat] || '🎮'}</span>
          <img class="cover-img" src="${coverSrc(x.no)}" alt="" loading="lazy" onerror="this.remove()">
          <span class="cat-badge">${x.cat}</span>
        </div>
        <div class="body-r">
          <h3 title="${escapeHtml(x.name)}">#${x.no} ${escapeHtml(x.name)}</h3>
          <div class="meta">
            <span>📂 ${x.fileNum ? x.fileNum.toLocaleString() + ' 文件' : '—'}</span>
            <span class="size">${x.size}</span>
          </div>
          <div class="btns">
            <button class="btn-c btn-copy" data-link="${x.link}">📋 复制</button>
            <a class="btn-c btn-go" href="${x.link}" target="_blank" rel="noopener">去转存 →</a>
          </div>
        </div>
      </article>`).join('');
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  // 事件
  document.getElementById('catList').addEventListener('click', e => {
    const li = e.target.closest('li'); if (!li) return;
    state.cat = li.dataset.cat; syncActive(); render();
  });
  document.getElementById('quickCats').addEventListener('click', e => {
    const c = e.target.closest('.chip'); if (!c) return;
    state.cat = c.dataset.cat; syncActive(); render();
    if (state.cat !== '全部') document.querySelector('.main')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  function syncActive() {
    document.querySelectorAll('#catList li').forEach(li => li.classList.toggle('active', li.dataset.cat === state.cat));
    document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === state.cat));
  }

  const qInput = document.getElementById('q');
  let debounceT;
  qInput.addEventListener('input', () => {
    clearTimeout(debounceT);
    debounceT = setTimeout(() => { state.q = qInput.value; render(); }, 120);
  });
  document.getElementById('searchBtn').addEventListener('click', () => { state.q = qInput.value; render(); });
  qInput.addEventListener('keydown', e => { if (e.key === 'Enter') { state.q = qInput.value; render(); } });

  document.getElementById('sortBy').addEventListener('change', e => { state.sort = e.target.value; render(); });

  // 复制按钮（事件委托）
  document.getElementById('cards').addEventListener('click', async e => {
    const btn = e.target.closest('.btn-copy'); if (!btn) return;
    const link = btn.dataset.link;
    try { await navigator.clipboard.writeText(link); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = link; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } finally { document.body.removeChild(ta); }
    }
    const orig = btn.textContent;
    btn.textContent = '✓ 已复制';
    btn.classList.add('copied');
    setTimeout(() => { btn.textContent = orig; btn.classList.remove('copied'); }, 1600);
  });

  // 回到顶部
  const backTop = document.getElementById('backTop');
  window.addEventListener('scroll', () => backTop.classList.toggle('show', window.scrollY > 500), { passive: true });
  backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  syncActive(); render();
})();
