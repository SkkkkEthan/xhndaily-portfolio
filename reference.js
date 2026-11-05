(() => {
  'use strict';
  const data = window.PORTFOLIO;
  const excludedGameIds = new Set(data.excludedGameIds || []);
  data.games = data.games.filter(game => !excludedGameIds.has(game.id));
  const gameCount = document.querySelector("#game-count");
  if (gameCount) gameCount.textContent = `${data.games.length} 款作品`;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const icon = id => `<svg aria-hidden="true"><use href="#i-${id}"/></svg>`;
  const safe = value => {
    try { const url = new URL(value, location.href); return ['http:', 'https:'].includes(url.protocol) ? value : ''; }
    catch { return ''; }
  };
  let motionPaused = reduced.matches;
  try { motionPaused ||= localStorage.getItem('portfolio-motion-paused') === 'true'; } catch {}
  try { if (localStorage.getItem('portfolio-theme') === 'dark') document.documentElement.dataset.theme = 'dark'; } catch {}
  const animate = (element, frames, options = {}, keyboard = false) => {
    if (motionPaused || reduced.matches || keyboard || !element?.animate) return null;
    return element.animate(frames, { duration: 240, easing: 'cubic-bezier(.23,1,.32,1)', ...options });
  };

  document.querySelector('#game-list').innerHTML = data.games.map((game, index) => `
    <article class="game-card reveal" data-game="${esc(game.id)}">
      <header class="game-card-heading">
        <h3>${esc(game.title)}</h3><span class="game-type">${esc(game.type)}</span>
        <p class="game-summary"><strong>核心玩法</strong>${esc(game.summary)}</p>
      </header>
      <button class="game-image-link" data-detail="${esc(game.id)}" aria-label="查看${esc(game.title)}设计说明">
        <img src="${esc(safe(game.poster))}" data-poster="${esc(safe(game.poster))}" data-motion="${esc(safe(game.media))}" alt="${esc(game.title)}玩法预览" width="768" height="480" loading="lazy" decoding="async">
        <span class="preview-status" hidden><span class="preview-label"></span><progress max="100" aria-label="动态预览加载进度"></progress></span>
        <span class="image-hint" aria-hidden="true">${icon('arrow')}</span>
      </button>
      <div class="game-caption">
        <div class="game-tags">${game.tags.map(tag => `<span>${esc(tag)}</span>`).join('')}</div>
        <div class="game-actions"><button class="details-button" data-detail="${esc(game.id)}" aria-label="${esc(game.title)}：设计说明">设计说明 ${icon('arrow')}</button>
          ${game.playUrl && safe(game.playUrl) ? `<a class="game-play" href="${esc(safe(game.playUrl))}" aria-label="${esc(game.title)}：开始试玩">开始试玩 ${icon('arrow')}</a>` : ''}
        </div>
      </div>
    </article>`).join('');

  const experiences = [
    {id:'miya',logo:'bilibili.png',logoAlt:'哔哩哔哩 logo（合作方）',logoDark:true,company:'米娅喵游戏（bilibili合作）',role:'系统策划',roles:'system',dates:'2025.03 — 2026.06',summary:'负责核心玩法框架、PVE 玩法与策划工作流。',tasks:['负责竞品调研与系统架构设计，搭建核心玩法框架。','主导 PVE 玩法全流程设计与落地。','建立策划工作流标准，提升团队协作与交付效率。'],tags:['玩法框架','PVE 设计','工作流']},
    {id:'niuke',logo:'neocraft.png',logoAlt:'NEOCRAFT logo',logoDark:true,company:'扭壳网络科技有限公司',role:'玩法策划',roles:'gameplay',dates:'2024.07 — 2025.01',summary:'负责 PVP、PVE、GVG、GVE 玩法设计与持续优化。',tasks:['负责 PVP、PVE 玩法设计与优化。','设计与优化 GVG、GVE 玩法。','兼顾玩法深度与不同层级玩家体验。'],tags:['PVP / PVE','GVG / GVE','玩法迭代']},
    {id:'shengqu',logo:'shengqu.jpg',logoAlt:'盛趣游戏 logo',company:'盛趣游戏',role:'玩法 / 运营策划',roles:'gameplay operations',dates:'2021.12 — 2022.04',summary:'负责玩法迭代、运营活动与新区联合运营。',tasks:['负责玩法迭代与内容设计，配合版本更新节奏。','统筹运营活动设计与新区联合运营。','联动运营与研发，推进活动落地与数据调优。'],tags:['玩法迭代','运营活动','数据调优']},
    {id:'dianchu',logo:'dianchu.png',logoAlt:'点触科技 logo',logoDark:true,company:'厦门点触科技股份有限公司',role:'系统策划',roles:'system',dates:'2020.06 — 2021.11',summary:'主导竞品拆解，负责玩法方案、调优与迭代。',tasks:['主导竞品拆解。','输出可落地的设计方案。','负责玩法设计、调优和持续迭代。'],tags:['竞品拆解','方案设计','持续迭代']}
  ];
  document.querySelector('#experience-list').innerHTML = experiences.map(item => `
    <article class="experience-card reveal" id="company-${item.id}" data-roles="${item.roles}">
      <div class="experience-rotor">
        <div class="experience-face experience-front" id="front-${item.id}">
          <div class="company-heading"><h4 class="company-mark">${item.id === 'miya' ? '米娅喵游戏<span class="company-partnership">（bilibili合作）</span>' : esc(item.company)}</h4><img class="company-logo company-logo-${item.id}${item.logoDark ? ' company-logo-dark' : ''}" src="${item.logo}" alt="${esc(item.logoAlt)}" width="104" height="52" loading="lazy" decoding="async"></div><p class="job-role">${esc(item.role)}</p>
          <div class="employment-meta"><span>${icon('work')} 任职经历</span><span>${esc(item.dates)}</span></div>
          <p>${esc(item.summary)}</p><div class="game-tags">${item.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>
          <button class="flip-button" data-flip="back" aria-controls="back-${item.id}" aria-expanded="false" aria-label="${esc(item.company)}：查看工作内容">查看工作内容 ${icon('flip')}</button>
        </div>
        <div class="experience-face experience-back" id="back-${item.id}" aria-hidden="true" inert>
          <div class="company-heading"><h4 class="company-mark">${item.id === 'miya' ? '米娅喵游戏<span class="company-partnership">（bilibili合作）</span>' : esc(item.company)}</h4><img class="company-logo company-logo-${item.id}${item.logoDark ? ' company-logo-dark' : ''}" src="${item.logo}" alt="${esc(item.logoAlt)}" width="104" height="52" loading="lazy" decoding="async"></div><p class="job-role">工作内容</p><ul class="responsibility-list">${item.tasks.map(task=>`<li>${esc(task)}</li>`).join('')}</ul>
          <button class="flip-button" data-flip="front" aria-controls="front-${item.id}" aria-label="${esc(item.company)}：返回任职信息">返回任职信息 ${icon('flip')}</button>
        </div>
      </div>
    </article>`).join('');
  document.querySelectorAll('[data-flip]').forEach(button => button.addEventListener('click', event => {
    const card = button.closest('.experience-card');
    const flipped = button.dataset.flip === 'back';
    card.classList.toggle('instant-flip', event.detail === 0);
    card.classList.toggle('flipped', flipped);
    const front = card.querySelector('.experience-front');
    const back = card.querySelector('.experience-back');
    front.inert = flipped; back.inert = !flipped;
    front.setAttribute('aria-hidden', String(flipped)); back.setAttribute('aria-hidden', String(!flipped));
    front.querySelector('button').setAttribute('aria-expanded', String(flipped));
    (flipped ? back : front).querySelector('button').focus({preventScroll:true});
  }));

  const header = document.querySelector('.site-header');
  const nav = document.querySelector('.site-nav');
  const navLinks = [...nav.querySelectorAll('a')];
  const sections = navLinks.map(link => document.querySelector(link.hash));
  const indicator = nav.querySelector('.nav-indicator');
  const moveIndicator = link => {
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    if (innerWidth <= 700 && nav.scrollWidth > nav.clientWidth) {
      const left = link.offsetLeft - (nav.clientWidth - link.offsetWidth) / 2;
      nav.scrollTo({left, behavior: motionPaused ? 'instant' : 'smooth'});
    }
  };
  const updateNav = () => {
    header.classList.toggle('scrolled', scrollY > 25);
    const marker = innerWidth <= 700 ? 180 : 155;
    let active = sections[0];
    sections.forEach(section => { if(section.getBoundingClientRect().top <= marker) active = section; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 5) active = sections.at(-1);
    navLinks.forEach(link => {
      const selected = link.hash === `#${active.id}`;
      link.classList.toggle('active', selected);
      if (selected) { link.setAttribute('aria-current','location'); moveIndicator(link); }
      else link.removeAttribute('aria-current');
    });
  };
  let scrollFrame = 0;
  addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(()=>{updateNav();scrollFrame=0;});
  }, {passive:true});
  addEventListener('resize', updateNav);
  document.fonts?.ready.then(updateNav);
  requestAnimationFrame(updateNav);
  const goTo = (hash, keyboard = false) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const headerHeight = header.getBoundingClientRect().height;
    const y = target.getBoundingClientRect().top + scrollY - (hash === '#home' ? 0 : headerHeight + 28);
    window.scrollTo({top:Math.max(0,y),behavior:motionPaused || reduced.matches || keyboard ? 'instant' : 'smooth'});
    history.replaceState(null,'',hash);
    if (keyboard) {
      const heading = target.matches('h1,h2,h3,h4') ? target : target.querySelector('h1,h2,h3,h4');
      heading?.setAttribute('tabindex','-1');
      heading?.focus({preventScroll:true});
    }
  };
  document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
    if (!link.hash || !document.querySelector(link.hash)) return;
    event.preventDefault();goTo(link.hash,event.detail===0);
  }));

  const detail = document.querySelector('#detail');
  const command = document.querySelector('#command');
  const returnFocus = new Map();
  const dialogAnimations = new Map();
  const openingFrom = (dialog, trigger, keyboard) => {
    returnFocus.set(dialog, trigger || document.activeElement);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    const offset = trigger?.getBoundingClientRect?.();
    const dx = offset ? Math.max(-35, Math.min(35, offset.left + offset.width/2 - innerWidth/2)) : 0;
    dialogAnimations.get(dialog)?.cancel();
    const animation = animate(dialog,[{opacity:0,transform:`translate(${dx}px,18px) scale(.975)`},{opacity:1,transform:'translate(0,0) scale(1)'}],{duration:260},keyboard);
    if (animation) dialogAnimations.set(dialog,animation);
  };
  const closeDialog = (dialog, keyboard = false) => {
    if (!dialog.open || dialog.dataset.closing) return;
    dialogAnimations.get(dialog)?.cancel();
    dialog.dataset.closing = 'true';
    const finish = () => { dialog.close(); delete dialog.dataset.closing; returnFocus.get(dialog)?.focus?.({preventScroll:true}); };
    const animation = animate(dialog,[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(8px) scale(.99)'}],{duration:150},keyboard);
    if (animation) animation.finished.then(finish).catch(finish); else finish();
  };
  [detail,command].forEach(dialog=>{
    dialog.querySelector('.dialog-close').addEventListener('click',event=>closeDialog(dialog,event.detail===0));
    dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog,true);});
    dialog.addEventListener('click',event=>{
      if (event.target!==dialog) return;
      const r=dialog.getBoundingClientRect();
      if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog(dialog);
    });
  });
  const showDetail = (game, trigger, keyboard = false) => {
    if(!game) return;
    document.querySelector('#detail-body').innerHTML = `
      <h2 id="detail-title">${esc(game.title)}</h2>
      <p class="detail-label">${esc(game.type)}</p>
      <div class="detail-layout">
        <div class="detail-visual">
          <img src="${esc(safe(game.poster))}" alt="${esc(game.title)}游戏画面" width="768" height="480">
          <div class="game-tags">${game.tags.map(tag=>`<span>${esc(tag)}</span>`).join('')}</div>
          ${game.controls?`<p class="play-controls">操作：${esc(game.controls)}</p>`:''}
          ${game.playUrl&&safe(game.playUrl)?`<div class="detail-actions"><a class="button primary" href="${esc(safe(game.playUrl))}" aria-label="${esc(game.title)}：开始试玩">开始试玩 ${icon('arrow')}</a></div>`:''}
        </div>
        <div class="detail-copy">
          <section><h3>玩法概览</h3><p>${esc(game.description)}</p></section>
          <section><h3>关键规则</h3><p>${esc(game.contribution)}</p></section>
          <section><h3>设计思路</h3><p>${esc(game.lesson)}</p></section>
        </div>
      </div>`;
    openingFrom(detail,trigger,keyboard);
  };
  document.querySelectorAll('[data-detail]').forEach(button=>button.addEventListener('click',event=>showDetail(data.games.find(g=>g.id===button.dataset.detail),button,event.detail===0)));
  // Posters are independent of animation downloads and remain visible until decoding succeeds.
  const previewControllers = [];
  const previewQueue = [];
  let activePreviewLoads = 0;
  const drainPreviews = () => {
    if (activePreviewLoads || !previewQueue.length || document.hidden || motionPaused) return;
    const task = previewQueue.shift();
    activePreviewLoads++;
    task().finally(() => { activePreviewLoads--; drainPreviews(); });
  };
  document.querySelectorAll('.game-card').forEach(card => {
    const image = card.querySelector('img');
    const button = card.querySelector('.game-image-link');
    const status = card.querySelector('.preview-status');
    const label = status.querySelector('.preview-label');
    const progress = status.querySelector('progress');
    const source = image.dataset.motion;
    if (!source || source === image.dataset.poster) return;
    let state = 'idle', percent = null, blobUrl = '', hovered = false, focused = false;
    let retryAt = 0;
    const refresh = () => {
      const wanted = (hovered || focused) && !motionPaused && !document.hidden;
      image.src = wanted && state === 'ready' ? blobUrl : image.dataset.poster;
      status.hidden = !wanted || state === 'ready' || state === 'idle';
      if (status.hidden) return;
      label.textContent = state === 'error' ? '动图加载失败，移开后重试' :
        state === 'decoding' ? '正在准备播放' :
        percent === null ? '正在加载动态预览' : `正在加载动态预览 ${percent}%`;
      progress.hidden = state === 'error';
      if (percent === null || state === 'decoding') progress.removeAttribute('value');
      else progress.value = percent;
    };
    const load = () => new Promise(resolve => {
      state = 'loading'; percent = null; refresh();
      const xhr = new XMLHttpRequest();
      xhr.open('GET', source); xhr.responseType = 'blob'; xhr.timeout = 45000;
      xhr.onprogress = event => {
        percent = event.lengthComputable ? Math.min(100, Math.floor(event.loaded / event.total * 100)) : null;
        refresh();
      };
      const fail = () => { state = 'error'; retryAt = Date.now() + 3000; refresh(); resolve(); };
      xhr.onerror = xhr.ontimeout = xhr.onabort = fail;
      xhr.onload = async () => {
        if (xhr.status < 200 || xhr.status >= 300) { fail(); return; }
        const url = URL.createObjectURL(xhr.response);
        state = 'decoding'; refresh();
        const decoded = new Image(); decoded.src = url;
        try { await decoded.decode(); blobUrl = url; state = 'ready'; refresh(); resolve(); }
        catch { URL.revokeObjectURL(url); fail(); }
      };
      xhr.send();
    });
    const request = (urgent = false) => {
      if (motionPaused || !finePointer.matches || document.hidden) return;
      if (state === 'error' && Date.now() < retryAt) return;
      if (state === 'idle' || state === 'error') {
        state = 'queued'; percent = null;
        previewQueue.push(load);
      }
      if (urgent) {
        const index = previewQueue.indexOf(load);
        if (index > 0) previewQueue.unshift(previewQueue.splice(index, 1)[0]);
      }
      refresh(); drainPreviews();
    };
    button.addEventListener('pointerenter', () => { hovered = finePointer.matches; request(true); refresh(); });
    button.addEventListener('pointerleave', () => { hovered = false; refresh(); });
    button.addEventListener('focus', () => { focused = finePointer.matches; request(true); refresh(); });
    button.addEventListener('blur', () => { focused = false; refresh(); });
    previewControllers.push({refresh, request});
    // Only queue near-visible previews after the static image has loaded.
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        if (image.complete && image.naturalWidth) request();
        else image.addEventListener('load', () => request(), {once:true});
        observer.disconnect();
      }
    }, {rootMargin:'240px'});
    observer.observe(button);
  });
  document.addEventListener('visibilitychange', () => {
    previewControllers.forEach(controller => controller.refresh()); drainPreviews();
  });

  const focusButtons=[...document.querySelectorAll('[data-focus]')];
  const focusText=document.querySelector('#focus-description');
  const descriptions=['5 年游戏策划经验，专注系统框架与玩法设计。','覆盖 PVP、PVE、GVG、GVE，关注规则与成长之间的关系。','把玩法想法做成原型，展示规则、交互和设计取舍。'];
  let focusIndex=0;
  let lastManualFocus=0;
  let focusTextTimer=0;
  const setFocus=(index,keyboard=false,manual=false)=>{
    focusIndex=(index+focusButtons.length)%focusButtons.length;
    if(manual)lastManualFocus=Date.now();
    document.querySelector('.focus-tabs').classList.toggle('keyboard-switch',keyboard);
    focusButtons.forEach((button,i)=>{
      const selected=i===focusIndex;
      button.classList.toggle('selected',selected);button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;
      button.style.order=selected?'2':String(i===(focusIndex+2)%3?1:3);
    });
    focusText.setAttribute('aria-labelledby',focusButtons[focusIndex].id);
    clearTimeout(focusTextTimer);
    if(motionPaused||keyboard){focusText.textContent=descriptions[focusIndex];return;}
    animate(focusText,[{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-4px)'}],{duration:100});
    focusTextTimer=setTimeout(()=>{
      focusText.textContent=descriptions[focusIndex];
      animate(focusText,[{opacity:0,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:220});
    },100);
  };
  focusButtons.forEach(button=>{
    button.addEventListener('click',event=>setFocus(Number(button.dataset.focus),event.detail===0,true));
    button.addEventListener('keydown',event=>{
      let next=focusIndex;
      if(event.key==='ArrowRight')next++;else if(event.key==='ArrowLeft')next--;else if(event.key==='Home')next=0;else if(event.key==='End')next=2;else return;
      event.preventDefault();setFocus(next,true,true);focusButtons[focusIndex].focus();
    });
  });
  setFocus(0,true);
  const focusTimer=setInterval(()=>{
    if(heroVisible&&!motionPaused&&!document.hidden&&!detail.open&&!command.open&&Date.now()-lastManualFocus>12000&&!document.activeElement?.closest('.focus-tabs'))setFocus(focusIndex+1);
  },6000);

  const filterButtons=[...document.querySelectorAll('[data-filter]')];
  const filterItems=[...document.querySelectorAll('#career [data-roles]')];
  filterButtons.forEach(button=>button.addEventListener('click',event=>{
    const selected=button.dataset.filter;
    const oldPositions=new Map(filterItems.filter(item=>!item.hidden).map(item=>[item,item.getBoundingClientRect()]));
    filterButtons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
    let employment=0,projects=0;
    filterItems.forEach(item=>{
      const show=selected==='all'||item.dataset.roles.split(' ').includes(selected);
      item.hidden=!show;
      if(show){item.classList.add('revealed');if(item.classList.contains('experience-card'))employment++;else projects++;}
    });
    filterItems.filter(item=>!item.hidden).forEach(item=>{
      const previous=oldPositions.get(item),current=item.getBoundingClientRect();
      const dx=previous?previous.left-current.left:0,dy=previous?previous.top-current.top:10;
      animate(item,[{opacity:previous?1:.2,transform:`translate(${dx}px,${dy}px)`},{opacity:1,transform:'translate(0,0)'}],{duration:280},event.detail===0);
    });
    document.querySelector('#filter-status').textContent=`${selected==='all'?'':`${button.textContent} · `}${employment} 段任职经历 · ${projects} 个商业项目`;
    requestAnimationFrame(updateNav);
  }));

  let toastTimer=0;
  const toast=message=>{
    clearTimeout(toastTimer);
    document.querySelectorAll('#toast,#command-feedback').forEach(node=>{node.hidden=true;node.classList.remove('visible');});
    const node=document.querySelector(command.open?'#command-feedback':'#toast');
    node.textContent=message;node.hidden=false;node.classList.add('visible');
    toastTimer=setTimeout(()=>{node.hidden=true;node.classList.remove('visible');},3000);
  };
  const showManualEmail=()=>{
    if(!command.open)openCommand(document.activeElement,true);
    document.querySelector('#manual-copy').hidden=false;
    const field=document.querySelector('#manual-email');
    field.value=data.email;field.focus();field.select();
  };
  const copyEmail=async()=>{
    try{await navigator.clipboard.writeText(data.email);toast('邮箱已复制');}
    catch{showManualEmail();toast('未能自动复制，邮箱已选中，可手动复制。');}
  };
  document.querySelectorAll('.copy-email').forEach(button=>button.addEventListener('click',copyEmail));
  const themeButton=document.querySelector('[data-action="theme"]');
  const updateTheme=()=>{
    const dark=document.documentElement.dataset.theme==='dark';
    themeButton.setAttribute('aria-pressed',String(dark));themeButton.querySelector('span').textContent=dark?'浅色模式':'深色模式';
    document.querySelector('meta[name="theme-color"]').content=dark?'#0d0f17':'#ffffff';
  };
  const toggleTheme=()=>{
    const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;
    try{localStorage.setItem('portfolio-theme',next);}catch{}updateTheme();
  };
  updateTheme();
  const updateMotion=()=>{
    previewControllers.forEach(controller => controller.refresh());
    if (!motionPaused) drainPreviews();
    document.body.classList.toggle('paused',motionPaused);
    document.querySelector('#motion-control').setAttribute('aria-pressed',String(motionPaused));
    document.querySelector('#motion-control').textContent=motionPaused?'开启动效':'暂停动态效果';
    const quick=document.querySelector('[data-action="motion"]');quick.setAttribute('aria-pressed',String(motionPaused));quick.querySelector('span').textContent=motionPaused?'开启动效':'暂停动效';
    if(motionPaused){document.querySelectorAll('.game-card img').forEach(img=>{img.src=img.dataset.poster;});document.querySelectorAll('.reveal').forEach(item=>item.classList.add('revealed'));}
  };
  const toggleMotion=()=>{
    motionPaused=!motionPaused;try{localStorage.setItem('portfolio-motion-paused',String(motionPaused));}catch{}updateMotion();
  };
  document.querySelector('#motion-control').addEventListener('click',toggleMotion);
  reduced.addEventListener('change',()=>{motionPaused=reduced.matches;updateMotion();});
  updateMotion();

  const searchInput=document.querySelector('#command-input');
  searchInput.setAttribute('role','combobox');searchInput.setAttribute('aria-autocomplete','list');searchInput.setAttribute('aria-expanded','true');searchInput.setAttribute('aria-controls','command-results');
  const commandResults=document.querySelector('#command-results');commandResults.setAttribute('role','listbox');commandResults.setAttribute('aria-label','搜索结果');
  const manualCopy=document.createElement('div');manualCopy.id='manual-copy';manualCopy.hidden=true;
  manualCopy.innerHTML='<label for="manual-email">邮箱地址</label><input id="manual-email" type="text" readonly aria-describedby="manual-email-help"><p id="manual-email-help">选中邮箱后，使用系统的复制功能。</p>';
  commandResults.before(manualCopy);
  const commandFeedback=document.createElement('p');commandFeedback.id='command-feedback';commandFeedback.setAttribute('role','status');commandFeedback.hidden=true;manualCopy.before(commandFeedback);
  let matches=[],commandIndex=0;
  const commands=[
    {label:'基本信息',words:'首页 求职意向 简介 技能 home',icon:'home',type:'页面',hash:'#home'},
    {label:'个人作品集',words:'游戏 ai coding 原型 portfolio',icon:'game',type:'页面',hash:'#games'},
    {label:'工作履历',words:'系统策划 玩法策划 运营策划 任职 公司 项目 experience',icon:'work',type:'页面',hash:'#career'},
    {label:'任职公司',words:'工作 经历 公司',icon:'work',type:'页面',hash:'#companies',career:true},
    {label:'项目经历',words:'商业项目 项目 成果',icon:'work',type:'页面',hash:'#projects',career:true},
    ...experiences.map(item=>({label:item.company,words:`${item.role} ${item.dates} ${item.summary}`,icon:'work',type:'任职公司',hash:`#company-${item.id}`,career:true})),
    ...Array.from(document.querySelectorAll('.professional-card')).map(item=>({label:item.querySelector('h4').textContent,words:item.textContent,icon:'work',type:'项目经历',hash:`#${item.id}`,career:true})),
    {label:'教育背景',words:'安徽农业大学 英语 本科 school',icon:'school',type:'页面',hash:'#education'},
    {label:'联系方式',words:'电话 微信 vx 邮箱 email',icon:'mail',type:'页面',hash:'#contact'},
    ...data.games.map(game=>({label:game.title,words:`AI Coding 小游戏 ${game.type} ${game.summary} ${game.subtitle} ${game.tags.join(' ')} ${game.playUrl?'网页试玩 网页 试玩 浏览器':''}`,icon:'game',type:'游戏',game})),
    {label:'下载完整简历',words:'resume word',icon:'download',type:'快捷操作',action:'resume'},
    {label:'复制邮箱',words:'copy email 邮件',icon:'copy',type:'快捷操作',action:'copy'},
    {label:'手动复制邮箱',words:'email 邮件 地址',icon:'mail',type:'快捷操作',action:'email'},
    {label:'切换深色 / 浅色模式',words:'theme 外观 主题',icon:'sun',type:'快捷操作',action:'theme'},
    {label:'暂停 / 开启动态效果',words:'动效 动画 motion',icon:'spark',type:'快捷操作',action:'motion'}
  ];
  const highlightCommand=()=>{
    const options=[...commandResults.querySelectorAll('[role="option"]')];
    options.forEach((option,index)=>{option.classList.toggle('selected',index===commandIndex);option.setAttribute('aria-selected',String(index===commandIndex));});
    if(options[commandIndex])searchInput.setAttribute('aria-activedescendant',options[commandIndex].id);else searchInput.removeAttribute('aria-activedescendant');
  };
  const renderCommands=()=>{
    const terms=searchInput.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    matches=commands.filter(item=>{
      const text=`${item.label} ${item.words} ${item.type}`.toLowerCase();
      return terms.every(term=>text.includes(term));
    });commandIndex=0;
    commandResults.innerHTML=matches.length?matches.map((item,index)=>`<button class="command-result" role="option" id="cmd-${index}" aria-selected="${index===0}" data-command="${index}" tabindex="-1">${icon(item.icon)}<span>${esc(item.label)}</span><small>${item.type}</small></button>`).join(''):'<p class="command-empty" role="status">没有找到结果，试试“游戏”或“简历”。</p>';
    highlightCommand();
  };
  const runAction=action=>{
    if(action==='copy')copyEmail();
    else if(action==='email')showManualEmail();
    else if(action==='theme')toggleTheme();
    else if(action==='motion')toggleMotion();
    else if(action==='resume'){
      const link=document.createElement('a');link.href=data.resumeUrl;link.download='';document.body.append(link);link.click();link.remove();
    }
  };
  const executeCommand=(index,keyboard=false)=>{
    const item=matches[index];if(!item)return;
    if(item.action){runAction(item.action);return;}
    const origin=returnFocus.get(command);
    const trigger=origin?.isConnected&&origin!==document.body?origin:document.querySelector('.search-trigger');
    command.close();trigger?.focus?.({preventScroll:true});
    if(item.hash){
      if(item.career){
        filterButtons.find(button=>button.dataset.filter==='all').click();
        const destination=document.querySelector(item.hash);
        if(destination?.classList.contains('flipped'))destination.querySelector('[data-flip="front"]').click();
      }
      goTo(item.hash,keyboard);
    }
    else if(item.game)showDetail(item.game,trigger,keyboard);
  };
  const openCommand=(trigger,keyboard=false)=>{
    manualCopy.hidden=true;commandFeedback.hidden=true;
    searchInput.value='';renderCommands();openingFrom(command,trigger,keyboard);searchInput.focus({preventScroll:true});
  };
  document.querySelector('.search-trigger').addEventListener('click',event=>openCommand(event.currentTarget,event.detail===0));
  command.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>runAction(button.dataset.action)));
  searchInput.addEventListener('input',()=>{manualCopy.hidden=true;commandFeedback.hidden=true;renderCommands();});
  commandResults.addEventListener('click',event=>{const button=event.target.closest('[data-command]');if(button)executeCommand(Number(button.dataset.command),event.detail===0);});
  searchInput.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();if(!matches.length)return;commandIndex=(commandIndex+(event.key==='ArrowDown'?1:-1)+matches.length)%matches.length;highlightCommand();
      commandResults.querySelector('.selected')?.scrollIntoView({block:'nearest',behavior:'instant'});
    }else if(event.key==='Enter'){event.preventDefault();executeCommand(commandIndex,true);}
  });
  document.addEventListener('keydown',event=>{
    if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){
      event.preventDefault();if(detail.open)return;
      if(command.open)closeDialog(command,true);else openCommand(document.activeElement,true);
    }
  });

  let heroVisible=true,eyeFrame=0;
  const eyes=document.querySelector('.eyes-wrap');
  if('IntersectionObserver' in window){
    const heroObserver=new IntersectionObserver(entries=>{heroVisible=entries[0].isIntersecting;});heroObserver.observe(document.querySelector('.hero-section'));
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('revealed');observer.unobserve(entry.target);}
    }),{rootMargin:'0px 0px -20px 0px',threshold:.07});
    if(!motionPaused){document.body.classList.add('js-reveal');document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));}
  }
  const blink=()=>{
    if(motionPaused||!heroVisible||document.hidden)return;
    eyes.classList.add('blink');setTimeout(()=>eyes.classList.remove('blink'),190);
  };
  eyes.addEventListener('click',blink);
  addEventListener('pointermove',event=>{
    if(motionPaused||!heroVisible||!finePointer.matches||eyeFrame)return;
    eyeFrame=requestAnimationFrame(()=>{
      const box=eyes.getBoundingClientRect();
      eyes.querySelectorAll('.pupil').forEach((pupil,index)=>{
        const cx=box.left+box.width*(index===0?.27:.73),cy=box.top+box.height*.55;
        const dx=event.clientX-cx,dy=event.clientY-cy,distance=Math.hypot(dx,dy)||1;
        const amount=Math.min(22,distance/18);
        pupil.style.transform=`translate(${dx/distance*amount}px,${dy/distance*amount}px)`;
      });eyeFrame=0;
    });
  },{passive:true});
  const blinkTimer=setInterval(blink,7200);
  if(!motionPaused)document.querySelector('.hero-center').classList.add('page-enter');
  document.addEventListener('visibilitychange',()=>{if(document.hidden)document.querySelectorAll('.game-card img').forEach(img=>{img.src=img.dataset.poster;});});
  // The browser freezes timers in its back/forward cache and resumes them on return.
})();

