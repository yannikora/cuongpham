
// ====== Starfield ======
(() => {
  const c = document.getElementById('stars');
  const ctx = c.getContext('2d');
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  let W=0,H=0, rafId;
  let stars=[], meteors=[];

  function resize(){
    W = c.clientWidth = window.innerWidth;
    H = c.clientHeight = window.innerHeight;
    c.width = W * DPR; c.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    stars = Array.from({length: 320}).map(()=> ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.6 + 0.2, tw: Math.random()*0.5 + 0.5, p: Math.random()*Math.PI*2
    }));
  }

  function spawnMeteor(){
    const y = Math.random()*H*0.6;
    const x = -80;
    const vx = 6 + Math.random()*4, vy = 1 + Math.random()*1.2, life = 120 + Math.random()*60;
    meteors.push({x,y,vx,vy,life});
  }

  let meteorTimer = 0;
  function tick(){
    ctx.clearRect(0,0,W,H);
    // twinkle
    ctx.fillStyle = '#ffffff'; ctx.globalCompositeOperation='lighter';
    for(const s of stars){
      s.p += 0.05;
      const a = 0.6 + Math.sin(s.p)*0.4;
      ctx.globalAlpha = a*0.8;
      ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // meteors
    meteorTimer++;
    if(meteorTimer > 160){
      spawnMeteor(); meteorTimer = 0;
    }
    for(let i=meteors.length-1;i>=0;i--){
      const m = meteors[i];
      m.x += m.vx; m.y += m.vy; m.life--;
      const grad = ctx.createLinearGradient(m.x-80,m.y-20,m.x,m.y);
      grad.addColorStop(0,'rgba(56,232,255,0)'); grad.addColorStop(1,'rgba(155,92,255,1)');
      ctx.strokeStyle = grad; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(m.x-80,m.y-20); ctx.lineTo(m.x,m.y); ctx.stroke();
      if(m.life<=0 || m.x>W+120) meteors.splice(i,1);
    }
    rafId = requestAnimationFrame(tick);
  }

  resize(); for(let i=0;i<2;i++) { setTimeout(()=>{ const evt=new Event(''); }, i*300);} tick();
  window.addEventListener('resize', resize);
})();

// ====== Particles (canvas) ======
(() => {
  const c = document.getElementById('fx');
  const ctx = c.getContext('2d');
  const DPR = Math.max(1, window.devicePixelRatio || 1);
  let W=0,H=0, rafId;

  const P = Array.from({length: 120}).map(()=> ({
    x: Math.random(), y: Math.random(), z: Math.random()*0.6+0.4,
    vx: (Math.random()*0.3+0.05) * (Math.random()<0.5?-1:1),
    vy: (Math.random()*0.3+0.05) * (Math.random()<0.5?-1:1),
  }));

  function resize(){
    W = c.clientWidth = window.innerWidth;
    H = c.clientHeight = window.innerHeight;
    c.width = W * DPR;
    c.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  function tick(){
    ctx.clearRect(0,0,W,H);
    // connections
    for(let i=0;i<P.length;i++){
      for(let j=i+1;j<P.length;j++){
        const a=P[i], b=P[j];
        const dx=(a.x-b.x)*W, dy=(a.y-b.y)*H;
        const d2 = dx*dx+dy*dy;
        if(d2< (140*140)){
          const alpha = Math.max(0, 1 - d2/(140*140)) * 0.15;
          ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
          ctx.beginPath(); ctx.moveTo(a.x*W, a.y*H); ctx.lineTo(b.x*W, b.y*H); ctx.stroke();
        }
      }
    }
    for(const p of P){
      p.x += p.vx*0.0007; p.y += p.vy*0.0007;
      if(p.x<-0.02) p.x=1.02; if(p.x>1.02) p.x=-0.02;
      if(p.y<-0.02) p.y=1.02; if(p.y>1.02) p.y=-0.02;
      const x = p.x*W, y=p.y*H, r = p.z*1.8;
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
    }
    rafId = requestAnimationFrame(tick);
  }
  resize(); for(let i=0;i<2;i++) { setTimeout(()=>{ const evt=new Event(''); }, i*300);} tick();
  window.addEventListener('resize', resize);
})();

// ====== Insert data ======
const skillsWrap = document.getElementById('skills');
state.skills.forEach(s=>{
  const span = document.createElement('span');
  span.className='chip';
  span.textContent=s;
  skillsWrap.appendChild(span);
});

const grid = document.getElementById('projects-grid');
state.projects.forEach(p=>{
  const card = document.createElement('div');
  card.className='card';
  card.setAttribute('data-tilt','');
  card.innerHTML = '<div class="title">'+p.title+'</div>' +
                   '<div class="desc">'+p.desc+'</div>' +
                   '<div class="metrics"><span class="metric">Team 3–6</span><span class="metric">Uptime 99.9%</span><span class="metric">SSO</span></div>' +
                   '<div class="tags">'+ p.tags.map(t=>'<span class="tag">'+t+'</span>').join('') + '</div>';
  grid.appendChild(card);
});


const tl = document.getElementById('timeline');
// Reset content to roadmap axis only
tl.innerHTML = '<div class="axis"></div>';

// Render alternating milestones
state.experience.forEach((e, idx) => {
  const side = idx % 2 === 0 ? 'left' : 'right';
  const ms = document.createElement('div');
  ms.className = `milestone ${side} pre`;
  ms.innerHTML = `
    <span class="ms-dot"></span>
    <div class="ms-card">
      <div class="ms-title">${e.company} <span class="muted">— ${e.role}</span></div>
      <div class="ms-sub">${e.period}</div>
      <ul class="ms-list">
        ${e.bullets.map(b=>`<li>${b}</li>`).join('')}
      </ul>
      <span class="ms-badge">Experience</span>
    </div>
  `;
  tl.appendChild(ms);
});

// Reveal on view
(() => {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('reveal');
        en.target.classList.remove('pre');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.milestone.pre').forEach(el=>io.observe(el));
})();const aw = document.getElementById('awards-list');
state.awards.forEach(a=>{
  const li = document.createElement('li');
  li.innerHTML = '<strong>'+a.year+'</strong> — '+a.title;
  aw.appendChild(li);
});

// ====== Parallax hero ======
(() => {
  const hero = document.querySelector('[data-parallax]');
  function onScroll(){
    const y = window.scrollY * 0.2;
    hero.style.transform = `translateY(${y*-1}px)`;
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
})();

// ====== Stagger-on-view ======
(() => {
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('reveal');
        io.unobserve(e.target);
      }
    })
  }, { threshold:0.12 });
  document.querySelectorAll('.panel, .card, .item').forEach(el=>{
    el.classList.add('pre');
    io.observe(el);
  });
})();

// Reveal animations via CSS classes
const style = document.createElement('style');
style.textContent = `
.pre{ opacity:0; transform: translateY(18px); transition: .6s cubic-bezier(.2,.7,.2,1) }
.reveal{ opacity:1; transform: translateY(0) }
`;
document.head.appendChild(style);

// ====== Tilt & Magnetic buttons ======
(() => {
  document.querySelectorAll('[data-tilt]').forEach(card=>{
    let rAF;
    function onMove(e){
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left)/rect.width;
      const y = (e.clientY - rect.top)/rect.height;
      const rx = (0.5 - y) * 6;
      const ry = (x - 0.5) * 6;
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(()=>{
        card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
    }
    function reset(){ card.style.transform = 'rotateX(0) rotateY(0)'; }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
  });

  document.querySelectorAll('[data-magnetic]').forEach(btn=>{
    let rAF;
    const strength = 18;
    function onMove(e){
      const rect = btn.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width/2);
      const dy = e.clientY - (rect.top + rect.height/2);
      cancelAnimationFrame(rAF);
      rAF = requestAnimationFrame(()=>{
        btn.style.transform = `translate(${dx/strength}px, ${dy/strength}px)`;
      });
    }
    function reset(){ btn.style.transform = 'translate(0,0)'; }
    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', reset);
  });
})();





// ====== v3.8 Vertical Timeline Render ======
(() => {
  const tl = document.getElementById('timeline');
  if (!tl) return;
  tl.innerHTML = '<div class="vt-axis"></div><div class="vt-list"></div>';
  const list = tl.querySelector('.vt-list');

  function extractYear(period){
    const m = /\b(20\d{2})\b/.exec(period || "");
    return m ? m[1] : "";
  }

  state.experience.forEach((e, idx) => {
    const side = idx % 2 === 0 ? 'left' : 'right';
    const item = document.createElement('div');
    item.className = `vt-item ${side} pre`;
    const year = extractYear(e.period);

    item.innerHTML = `
      <span class="vt-dot"></span>
      <span class="vt-year">${year}</span>
      <span class="vt-arm"></span>
      <div class="vt-side left">
        ${side === 'left' ? `
          <div class="vt-card">
            <div class="vt-title">${e.company} <span class="muted">— ${e.role}</span></div>
            <div class="vt-sub">${e.period}</div>
            <ul class="vt-ul">
              ${e.bullets.map(b=>`<li>${b}</li>`).join('')}
            </ul>
          </div>` : ''}
      </div>
      <div class="vt-side right">
        ${side === 'right' ? `
          <div class="vt-card">
            <div class="vt-title">${e.company} <span class="muted">— ${e.role}</span></div>
            <div class="vt-sub">${e.period}</div>
            <ul class="vt-ul">
              ${e.bullets.map(b=>`<li>${b}</li>`).join('')}
            </ul>
          </div>` : ''}
      </div>
    `;
    list.appendChild(item);
  });

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        en.target.classList.add('reveal');
        en.target.classList.remove('pre');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.vt-item.pre').forEach(el=>io.observe(el));
})();
