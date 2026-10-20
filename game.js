(()=>{
'use strict';
/* ================= alat bantu ================= */
const $=s=>document.querySelector(s);
const h=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const sample=(a,n)=>shuffle(a).slice(0,n);
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const center=el=>{const r=el.getBoundingClientRect();return[r.left+r.width/2,r.top+r.height/2]};

/* ================= Pokédex ================= */
const TYPE_EMO={1:'⭐',2:'🥊',3:'🪶',4:'🟣',5:'⛰️',6:'🪨',7:'🐛',8:'👻',9:'⚙️',10:'🔥',11:'💧',12:'🌿',13:'⚡',14:'🔮',15:'❄️',16:'🐉',17:'🌙',18:'🧚'};
const TYPE_ID={1:'normal',2:'petarung',3:'terbang',4:'racun',5:'tanah',6:'batu',7:'serangga',8:'hantu',9:'baja',10:'api',11:'air',12:'rumput',13:'listrik',14:'psikis',15:'es',16:'naga',17:'kegelapan',18:'peri'};
const REGION=['Kanto','Johto','Hoenn','Sinnoh','Unova','Kalos','Alola','Galar','Paldea'];
const DEX=(window.DEXDATA||[]).map(([id,n,gen,ty,from,chain,baby,leg,g,a])=>({id,n,gen,ty,from,chain,baby,leg,g,a,e:TYPE_EMO[ty[0]]||'⭐'}));
const BY=new Map(DEX.map(p=>[p.id,p]));
const byId=id=>BY.get(id)||BY.get(25)||DEX[0];
const KIDS=new Map();DEX.forEach(p=>{if(p.from){if(!KIDS.has(p.from))KIDS.set(p.from,[]);KIDS.get(p.from).push(p.id)}});
const FOSSIL=[138,140,142,345,347,408,410,564,566,696,698,880,881,882,883];
const POOL={
  all:DEX,
  laut:DEX.filter(p=>p.ty.includes(11)),
  dino:DEX.filter(p=>p.ty.includes(16)||FOSSIL.includes(p.id)),
  base:DEX.filter(p=>!p.from&&!p.leg),
  evo:DEX.filter(p=>!p.from&&KIDS.has(p.id)),
  anim:DEX.filter(p=>p.g)
};
// rantai evolusi acak dari Pokémon dasar sampai tahap akhir
function chainFrom(p){const c=[p];let cur=p;while(KIDS.has(cur.id)){cur=byId(pick(KIDS.get(cur.id)));c.push(cur)}return c}
function randomChain(min=2){for(let i=0;i<60;i++){const c=chainFrom(pick(POOL.evo));if(c.length>=min)return c}return chainFrom(byId(7))}
const sayName=p=>p.n;

/* ================= simpanan ================= */
const KEY='petualangan-laut-v1';
const S={stars:0,caught:[25,7,1,4],sound:true,buddy:7,voice:'',rate:1,lv:{}};
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
if(!S.lv||typeof S.lv!=='object')S.lv={};
let CAUGHT=new Set(S.caught);
const save=()=>{S.caught=[...CAUGHT];try{localStorage.setItem(KEY,JSON.stringify({stars:S.stars,caught:S.caught,sound:S.sound,buddy:S.buddy,voice:S.voice,rate:S.rate,lv:S.lv}))}catch(e){}};

/* ================= gambar Pokémon =================
   Karakter memakai sprite animasi (bergerak sungguhan); kalau tidak ada, gambar resmi yang
   digerakkan dengan CSS; kalau semua gagal, emoji tipe. */
const GIF=id=>`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${id}.gif`;
const ART=id=>`img/${id}.webp`;
let gifBroken=false;
function pic(p,o={}){
  const w=h('div','pic');if(o.s)w.style.setProperty('--s',o.s);
  const bod=h('div','bod');w.append(bod);
  const gif=!o.art&&p.g&&!gifBroken;
  w.classList.add(gif?'live':'still');if(o.calm)w.classList.add('calm');
  const im=new Image();im.alt=p.n;im.draggable=false;im.decoding='async';if(o.lazy)im.loading='lazy';
  im.dataset.f=gif?'gif':'art';
  im.onerror=()=>{
    if(im.dataset.f==='gif'){im.dataset.f='art';w.classList.replace('live','still');im.src=ART(p.id)}
    else{bod.innerHTML='';bod.append(h('span','emo',p.e))}
  };
  im.src=gif?GIF(p.id):ART(p.id);bod.append(im);w.p=p;return w;
}
(()=>{const t=new Image();t.onerror=()=>{gifBroken=true};t.src=GIF(25)})();
// gerakan karakter
const MOVES={
  hop:[{transform:'none'},{transform:'translateY(0) scale(1.18,.82)',offset:.15},{transform:'translateY(-38%) scale(.9,1.12)',offset:.45},{transform:'translateY(0) scale(1.12,.88)',offset:.78},{transform:'none'}],
  spin:[{transform:'none'},{transform:'translateY(-30%) rotate(180deg) scale(1.1)',offset:.5},{transform:'translateY(0) rotate(360deg)'}],
  wiggle:[{transform:'none'},{transform:'rotate(-14deg)'},{transform:'rotate(14deg)'},{transform:'rotate(-10deg)'},{transform:'rotate(8deg)'},{transform:'none'}],
  chomp:[{transform:'none'},{transform:'scale(1.12,.84)',offset:.25},{transform:'scale(.94,1.1)',offset:.55},{transform:'scale(1.06,.95)',offset:.8},{transform:'none'}],
  sad:[{transform:'none'},{transform:'translateY(6%) scale(1.05,.92) rotate(-6deg)',offset:.4},{transform:'translateY(6%) scale(1.05,.92) rotate(6deg)',offset:.7},{transform:'none'}],
  dance:[{transform:'none'},{transform:'translateY(-14%) rotate(-12deg)'},{transform:'translateY(0) rotate(0)'},{transform:'translateY(-14%) rotate(12deg)'},{transform:'none'}]
};
function act(el,kind='hop',dur){if(!el||RM)return;const b=el.classList&&el.classList.contains('bod')?el:el.querySelector('.bod');if(!b)return;
  try{b.animate(MOVES[kind],{duration:dur||({hop:650,spin:800,wiggle:600,chomp:420,sad:700,dance:900}[kind]),easing:'ease-out'})}catch(e){}}

/* ================= suara & narator ================= */
let AC=null;
function tone(f,d=.15,type='sine',vol=.18,when=0,slide=0){
  if(!S.sound)return;
  try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();
    const t=AC.currentTime+when,o=AC.createOscillator(),g=AC.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g).connect(AC.destination);o.start(t);o.stop(t+d+.03)}catch(e){}
}
const NOTES=[523,587,659,784,880,1047];
const sfx={
  pop:()=>tone(480,.12,'sine',.25,0,1150),
  good:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.2,'triangle',.15,i*.08)),
  soft:()=>tone(300,.28,'sine',.13,0,190),
  flip:()=>tone(720,.07,'square',.05),
  splash:()=>{tone(300,.3,'sine',.15,0,900);tone(900,.2,'sine',.07,.05,380)},
  boing:()=>tone(260,.22,'triangle',.18,0,620),
  chomp:()=>{tone(180,.07,'square',.08);tone(140,.07,'square',.08,.09)},
  crack:()=>tone(1400,.05,'sawtooth',.06,0,600),
  whoosh:()=>tone(900,.25,'sine',.08,0,200),
  win:()=>[523,659,784,659,784,1047,1319].forEach((f,i)=>tone(f,.22,'triangle',.14,i*.11)),
  note:i=>tone(NOTES[i%NOTES.length],.35,'triangle',.2)
};
const NAR={voice:null,list:[]};
function rankVoice(v){let s=0;if(/^id([-_]|$)/i.test(v.lang))s+=100;else if(/indones/i.test(v.name))s+=90;else if(/^ms([-_]|$)/i.test(v.lang))s+=30;else return 0;
  if(/natural|neural|enhanced|premium|online|google|siri/i.test(v.name))s+=15;if(/damayanti|gadis|ardi|wayan|andika/i.test(v.name))s+=8;return s}
function loadVoices(){try{const vs=speechSynthesis.getVoices();NAR.list=vs.filter(v=>rankVoice(v)>0).sort((a,b)=>rankVoice(b)-rankVoice(a));NAR.voice=(S.voice&&vs.find(v=>v.name===S.voice))||NAR.list[0]||null}catch(e){}}
try{loadVoices();speechSynthesis.addEventListener('voiceschanged',loadVoices)}catch(e){}
const LETTER={A:'a',B:'be',C:'ce',D:'de',E:'e',F:'ef',G:'ge',H:'ha',I:'i',J:'je',K:'ka',L:'el',M:'em',N:'en',O:'o',P:'pe',Q:'ki',R:'er',S:'es',T:'te',U:'u',V:'ve',W:'we',X:'eks',Y:'ye',Z:'zet'};
function clean(t){return String(t).replace(/Pokémon/g,'Pokemon').replace(/[éè]/g,'e').replace(/♀/g,' betina').replace(/♂/g,' jantan').replace(/Mr\. /g,'Mister ').replace(/Mime Jr\./g,'Mime Junior').replace(/Type: Null/g,'Type Null').replace(/[^\p{L}\p{N}\s.,!?'-]/gu,' ').replace(/\s+/g,' ').trim()}
let speakTimer=0;
function speak(text){
  if(!S.sound||!('speechSynthesis' in window))return;
  clearTimeout(speakTimer);
  try{
    const busy=speechSynthesis.speaking||speechSynthesis.pending;speechSynthesis.cancel();
    const go=()=>{
      const parts=clean(text).split(/(?<=[.!?])\s+/).filter(Boolean);
      parts.forEach((s,i)=>{
        const u=new SpeechSynthesisUtterance(s);u.lang=NAR.voice?NAR.voice.lang:'id-ID';if(NAR.voice)u.voice=NAR.voice;
        const r=S.rate||1;u.rate=r*(/!$/.test(s)?1.03:.96);u.pitch=/\?$/.test(s)?1.22:/!$/.test(s)?1.16:1.06;
        if(i===0)u.onstart=()=>talk(true);if(i===parts.length-1){u.onend=()=>talk(false);u.onerror=()=>talk(false)}
        speechSynthesis.speak(u);
      });
    };
    busy?speakTimer=setTimeout(go,80):go();
  }catch(e){}
}
function talk(on){const m=$('.mascot');if(m)m.classList.toggle('talking',on)}
function say(text,show=true){
  if(show){const b=$('.say');if(b){b.textContent=text;b.classList.remove('talk');void b.offsetWidth;b.classList.add('talk')}}
  speak(text);
}
const PRAISE=['Hebat!','Pintar sekali!','Keren!','Wah, kamu jago!','Mantap!','Luar biasa!','Yeay, betul!','Hore!','Tepat sekali!','Kamu hebat!','Asyik!','Seru sekali!'];
const TRY=['Hampir! Coba lagi, ya.','Ups, bukan yang itu. Ayo coba lagi!','Hmm, coba lihat lebih teliti.','Tidak apa-apa, coba sekali lagi!','Belum tepat. Kamu pasti bisa!'];
const praise=()=>pick(PRAISE);
const tryAgain=()=>pick(TRY);
const WORD=['nol','satu','dua','tiga','empat','lima','enam','tujuh','delapan','sembilan','sepuluh','sebelas','dua belas'];

/* ================= efek ================= */
function burst(x,y,set=['⭐','✨','💖','💫'],n=12){
  if(RM)return;
  for(let i=0;i<n;i++){const s=h('span','fx',pick(set));s.style.fontSize=rnd(20,36)+'px';document.body.append(s);
    const a=rnd(0,Math.PI*2),d=rnd(60,170);
    s.animate([{transform:`translate(${x}px,${y}px) translate(-50%,-50%) scale(.3)`,opacity:1},{transform:`translate(${x+Math.cos(a)*d}px,${y+Math.sin(a)*d-30}px) translate(-50%,-50%) scale(1.2) rotate(${rnd(-200,200)}deg)`,opacity:0}],{duration:rnd(650,1100),easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>s.remove();}
}
function flyStar(x,y){
  const t=$('#stars').getBoundingClientRect();
  if(RM){addStar();return}
  const s=h('span','fx','⭐');s.style.fontSize='36px';document.body.append(s);
  const tx=t.left+24,ty=t.top+t.height/2;
  s.animate([{transform:`translate(${x}px,${y}px) translate(-50%,-50%) scale(1)`},{transform:`translate(${(x+tx)/2}px,${Math.min(y,ty)-60}px) translate(-50%,-50%) scale(1.6) rotate(180deg)`,offset:.45},{transform:`translate(${tx}px,${ty}px) translate(-50%,-50%) scale(.6) rotate(360deg)`}],{duration:850,easing:'ease-in-out'}).onfinish=()=>{s.remove();addStar()};
}
function mascot(k){const m=$('.mascot');if(!m)return;m.classList.remove('yay','hmm');void m.offsetWidth;m.classList.add(k)}
function yay(at,msg,o={}){
  const [x,y]=Array.isArray(at)?at:center(at);
  if(o.sound!==false)sfx.good();burst(x,y,o.fx);if(o.star!==false)flyStar(x,y);mascot('yay');if(msg)say(msg);
}
function oops(el,msg){sfx.soft();if(el){el.classList.remove('nope');void el.offsetWidth;el.classList.add('nope')}mascot('hmm');if(msg!==false)say(msg||tryAgain())}
function addStar(n=1){
  for(let i=0;i<n;i++){S.stars++;if(S.stars%5===0)unlockDue++}
  save();$('#starN').textContent=S.stars;
  const c=$('#stars');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');
  if(unlockDue>0){unlockDue--;setTimeout(()=>{const left=DEX.filter(p=>!CAUGHT.has(p.id));if(left.length)gain(pick(left),true,'Hadiah 5 bintang!')},700)}
}
let unlockDue=0;
function gain(p,speakIt=false,pre=''){
  const fresh=!CAUGHT.has(p.id);
  if(fresh){CAUGHT.add(p.id);save()}
  if(!fresh&&!pre)return false;
  const t=h('div','toast');t.append(pic(p),document.createTextNode((pre?pre+' ':'')+(fresh?`Kamu dapat ${p.n}!`:`${p.n} datang lagi!`)));
  document.body.append(t);setTimeout(()=>t.remove(),3100);
  if(speakIt&&fresh)setTimeout(()=>speak(`${pre} Hore, kamu dapat ${p.n}!`),250);
  return fresh;
}

/* ================= lingkup permainan ================= */
function scope(){
  const L=[],T=[],I=[],R=[];let raf=0,alive=true;
  return{
    get alive(){return alive},
    on(t,e,f,o){t.addEventListener(e,f,o);L.push([t,e,f,o])},
    later(f,ms){const id=setTimeout(()=>alive&&f(),ms);T.push(id);return id},
    every(f,ms){I.push(setInterval(()=>alive&&f(),ms))},
    resize(el,f){const r=new ResizeObserver(()=>alive&&f());r.observe(el);R.push(r)},
    loop(f){let last=performance.now();const step=now=>{if(!alive)return;const dt=Math.min(.05,(now-last)/1000);last=now;f(dt,now/1000);raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)},
    stop(){alive=false;L.forEach(([t,e,f,o])=>t.removeEventListener(e,f,o));T.forEach(clearTimeout);I.forEach(clearInterval);R.forEach(r=>r.disconnect());cancelAnimationFrame(raf)}
  };
}

/* ================= daftar permainan ================= */
const MAXLV=5;
const GAMES={
 renang:{p:7,icon:'🏊',name:'Ayo Berenang',sub:'Kumpulkan bintang di laut',c:'#2fa6e0',run:swim},
 mancing:{p:129,icon:'🎣',name:'Mancing Pokémon',sub:'Tunggu pelampung bergoyang',c:'#1c86c9',run:fishing},
 telur:{p:175,icon:'🥚',name:'Telur Menetas',sub:'Ketuk-ketuk telurnya',c:'#f29bc0',run:egg},
 evolusi:{p:133,icon:'🍓',name:'Kasih Makan',sub:'Beri buah, lihat evolusi',c:'#ff6f61',run:feed},
 lari:{p:4,icon:'🦖',name:'Lari Dino',sub:'Lompati batu',c:'#e8912e',run:runner},
 fosil:{p:142,icon:'🦴',name:'Gali Fosil',sub:'Gosok pasir, temukan dino',c:'#c98a2e',run:fossil},
 tangkap:{p:143,icon:'🧺',name:'Tangkap Buah',sub:'Geser untuk menangkap',c:'#34c27a',run:catcher},
 ciluk:{p:50,icon:'🌊',name:'Ciluk Ba!',sub:'Sapa yang muncul',c:'#3fb3e8',run:peek},
 bayangan:{p:150,icon:'🔍',name:'Siapa Itu?',sub:'Tebak bayangan',c:'#8a5cf6',run:shadow},
 hitung:{p:172,icon:'🔢',name:'Ayo Berhitung',sub:'Ada berapa?',c:'#ff8a3d',run:count},
 besar:{p:321,icon:'📏',name:'Besar Kecil',sub:'Mana yang paling besar?',c:'#16a3a3',run:sizes},
 pola:{p:778,icon:'🧩',name:'Tebak Pola',sub:'Apa yang berikutnya?',c:'#d14fa6',run:pattern},
 urutan:{p:147,icon:'🪜',name:'Urutan Evolusi',sub:'Dari kecil ke besar',c:'#5a7cf0',run:order},
 huruf:{p:201,icon:'🔤',name:'Huruf Awal',sub:'Kenali huruf',c:'#7b58d6',run:letters},
 kartu:{p:151,icon:'🃏',name:'Kartu Kembar',sub:'Cari pasangannya',c:'#ffb000',run:memory},
 puzzle:{p:132,icon:'🧩',name:'Puzzle',sub:'Susun potongannya',c:'#4caf50',run:puzzle},
 irama:{p:39,icon:'🎵',name:'Ikuti Irama',sub:'Tiru nyanyiannya',c:'#e0489b',run:simon},
 labirin:{p:393,icon:'🧭',name:'Labirin',sub:'Antar pulang',c:'#2b9e6b',run:maze},
 gelembung:{p:54,icon:'🫧',name:'Pecah Gelembung',sub:'Cari warna yang benar',c:'#e0489b',run:bubbles}
};
let cur=null,curKey=null,curLv=1;
const stage=$('#stage');
const lvOf=k=>Math.max(1,Math.min(MAXLV,S.lv[k]||1));

function clear(){if(cur){cur.stop();cur=null}document.querySelectorAll('.party,.toast,.fx,.piece.drag').forEach(e=>e.remove());try{speechSynthesis.cancel()}catch(e){}stage.innerHTML=''}

function home(){
  clear();curKey=null;$('#homeBtn').hidden=true;$('#ttl').textContent='Petualangan Laut';
  const w=h('div','home');
  const hi=h('div','hello');
  const b1=pic(byId(S.buddy)),b2=pic(byId(25));
  hi.append(b1,h('p',null,'Halo, Pelatih Cilik!<br>Mau main apa hari ini?'),b2);
  b1.onclick=()=>{act(b1,'spin');sfx.boing();speak(pick(['Ayo main bersamaku!','Hai! Aku '+byId(S.buddy).n+'!','Pilih permainannya, yuk!']))};
  b2.onclick=()=>{act(b2,'hop');sfx.boing();speak('Pika pika! Ayo main!')};
  const tiles=h('div','tiles');
  let i=0;
  for(const [k,g] of Object.entries(GAMES)){
    const lv=lvOf(k);
    const b=h('button','tile popin');b.style.animationDelay=(i++*35)+'ms';b.style.setProperty('--c',g.c);
    b.append(h('span','big',g.icon),pic(byId(g.p)),h('b',null,g.name),h('small',null,`${g.sub} · Level ${lv}`));
    b.onclick=()=>{sfx.pop();open(k)};tiles.append(b);
  }
  const dx=h('button','tile dexy popin');dx.style.animationDelay=(i*35)+'ms';dx.style.setProperty('--c','#ffcf33');
  dx.append(h('span','big','📖'),pic(byId(25)),h('b',null,'Koleksiku'),h('small',null,`${CAUGHT.size} dari ${DEX.length} Pokémon`));
  dx.onclick=()=>{sfx.pop();dex()};tiles.append(dx);
  const par=h('div','parent');
  if(!standalone()){const ib=h('button','pbtn','📲 Pasang di HP');ib.onclick=installApp;par.append(ib)}
  const vb=h('button','pbtn','⚙️ Suara narator');vb.onclick=settings;par.append(vb);
  w.append(hi,tiles,par,h('p','foot',`Untuk orang tua: semua petunjuk dibacakan, jadi si kecil tidak perlu bisa membaca. Setiap permainan punya ${MAXLV} level yang naik sendiri saat satu babak selesai. Pokémon baru ditemukan sambil bermain, dan setiap 5 bintang ada hadiah Pokémon.`));
  stage.append(w);
}

function open(k,lv){
  clear();curKey=k;const g=GAMES[k];curLv=lv||lvOf(k);
  $('#homeBtn').hidden=false;$('#ttl').textContent=g.name;
  const row=h('div','sayrow'),m=h('button','mascot');m.setAttribute('aria-label','Ulangi petunjuk');
  m.append(pic(byId(S.buddy)),h('span','lvb','Level '+curLv));row.append(m,h('div','say'));stage.append(row);
  m.onclick=()=>{act(m,'hop');const t=$('.say').textContent;if(t)speak(t)};
  cur=scope();g.run(stage,cur,curLv);
}

function party(msg,p){
  if(!cur)return;cur.stop();
  const k=curKey,old=curLv,up=old<MAXLV;
  if(up){S.lv[k]=Math.max(lvOf(k),old+1);save()}
  sfx.win();
  const o=h('div','party'),b=h('div','box');
  const star=up?`Naik ke Level ${old+1}!`:'Level tertinggi!';
  const pp=pic(p||byId(S.buddy));
  b.append(h('h2',null,pick(['Hebat!','Hore!','Keren!','Yeay!'])),pp,h('p',null,msg),h('div','tagrow',`<span>⭐ ${star}</span>`));
  const row=h('div','row');
  const again=h('button','bigbtn',up?`▶ Level ${old+1}`:'🔁 Main lagi');again.onclick=()=>open(k,up?old+1:old);
  const back=h('button','bigbtn alt','🏠 Pulang');back.onclick=home;
  row.append(again,back);b.append(row);o.append(b);document.body.append(o);
  speak(`${msg} ${up?'Kamu naik ke level '+WORD[old+1]+'!':'Kamu sudah di level paling tinggi!'}`);
  const iv=setInterval(()=>{if(!o.isConnected)return clearInterval(iv);act(pp,pick(['hop','spin','dance']))},1300);act(pp,'spin');
  if(!RM){const em=['⭐','🫧','💧','🐚','✨','🌊','🎉','💖'];
    for(let i=0;i<28;i++){const c=h('span','conf',pick(em));c.style.left=rnd(0,96)+'vw';c.style.animationDuration=rnd(2.2,4)+'s';c.style.animationDelay=rnd(0,.8)+'s';document.body.append(c);setTimeout(()=>c.remove(),5200)}}
  again.focus();
}

/* arena bergerak: ukuran mengikuti layar */
function arena(root,sc,cls,html=''){
  const a=h('div','arena '+cls,html);root.append(a);
  const A={el:a,W:a.clientWidth||300,H:a.clientHeight||300};
  sc.resize(a,()=>{A.W=a.clientWidth;A.H=a.clientHeight;A.onresize&&A.onresize()});
  A.local=e=>{const r=a.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  A.page=(x,y)=>{const r=a.getBoundingClientRect();return[r.left+x,r.top+y]};
  return A;
}
function slots(parent,n){const s=h('div','slots');for(let i=0;i<n;i++)s.append(h('span','slot','⭐'));parent.append(s);let got=0;return{fill(){if(got<n)s.children[got].classList.add('got');got++;return got},get got(){return got}}}

/* ================= 1. Berenang ================= */
function swim(root,sc,lv){
  const A=arena(root,sc,'sea','<div class="weed w1"></div><div class="weed w2"></div><div class="weed w3"></div><div class="sandbed"></div>');
  const GOAL=6+lv*2,sl=slots(A.el,GOAL);
  const hs=()=>Math.max(70,Math.min(150,Math.min(A.W,A.H)*.22));
  const me=byId(S.buddy),hero=h('div','sprite hero'),hp=pic(me,{s:hs()+'px'});hero.append(hp);A.el.append(hero);
  A.onresize=()=>hp.style.setProperty('--s',hs()+'px');
  let x=A.W/2,y=A.H/2,tx=x,ty=y,face=1,down=false,trailT=0,hurt=0,lastOw=0;
  const items=[];
  const setT=e=>{[tx,ty]=A.local(e)};
  sc.on(A.el,'pointerdown',e=>{down=true;setT(e);sfx.splash()});
  sc.on(A.el,'pointermove',e=>{if(down||e.pointerType==='mouse')setT(e)});
  sc.on(window,'pointerup',()=>down=false);
  sc.on(window,'keydown',e=>{const d=70,m={ArrowLeft:[-d,0],ArrowRight:[d,0],ArrowUp:[0,-d],ArrowDown:[0,d]}[e.key];if(m){tx=x+m[0];ty=y+m[1];e.preventDefault()}});
  say(pick([`Ketuk lautnya, ${me.n} akan berenang ke sana. Kumpulkan ${WORD[GOAL]||GOAL} bintang!`,`Ayo berenang bersama ${me.n}! Ambil bintangnya, ya.`])+(lv>=3?' Hati-hati ada ubur-ubur!':''));
  function add(k,p,s,x0,y0,vx,vy){const el=h('div','sprite'+(k==='s'?' starb':''));
    if(k==='s'){el.style.width=el.style.height=s+'px';el.style.fontSize=s*.6+'px';el.textContent='⭐'}
    else if(k==='j'){el.append(pic(byId(72),{s:s+'px'}))}
    else el.append(pic(p,{s:s+'px'}));
    A.el.append(el);items.push({k,p,el,x:x0,y:y0,vx,vy,r:s/2,ph:rnd(0,6),s});}
  const spawnStar=()=>{if(items.filter(i=>i.k==='s').length>=5)return;const s=hs()*.55;add('s',null,s,rnd(s,A.W-s),A.H+s,0,-rnd(A.H/9,A.H/6)*(1+lv*.08))};
  const spawnPoke=()=>{if(items.some(i=>i.k==='p'))return;const p=pick(POOL.laut),s=hs()*.95,dir=Math.random()<.5?1:-1;add('p',p,s,dir>0?-s:A.W+s,rnd(A.H*.25,A.H*.7),dir*A.W/rnd(7,10),0)};
  const spawnJelly=()=>{if(lv<3||items.filter(i=>i.k==='j').length>=lv-2)return;const s=hs()*.7;add('j',null,s,rnd(s,A.W-s),A.H+s,0,-A.H/rnd(9,12))};
  spawnStar();sc.every(spawnStar,1100);sc.later(spawnPoke,3000);sc.every(spawnPoke,6500);sc.every(spawnJelly,4200);
  sc.loop((dt,t)=>{
    const r=hs()/2,k=Math.min(1,dt*(hurt>0?1.4:3.2));
    x+=(tx-x)*k;y+=(ty-y)*k;x=Math.max(r,Math.min(A.W-r,x));y=Math.max(r,Math.min(A.H*.9-r,y));
    if(tx<x-6)face=1;else if(tx>x+6)face=-1;
    const moving=Math.abs(tx-x)>8||Math.abs(ty-y)>8;
    const tilt=moving?Math.max(-18,Math.min(18,(ty-y)*.12*-face)):Math.sin(t*2)*4;
    hero.style.transform=`translate(${x-r}px,${y-r+Math.sin(t*3)*6}px) scaleX(${face}) rotate(${tilt}deg)`;
    hurt=Math.max(0,hurt-dt);
    trailT-=dt;if(trailT<0&&moving){trailT=.14;const b=h('div','trail');b.style.left=(x+face*r*.6)+'px';b.style.top=(y-6)+'px';A.el.append(b);setTimeout(()=>b.remove(),1200)}
    for(let i=items.length-1;i>=0;i--){
      const it=items[i];it.x+=it.vx*dt;it.y+=it.vy*dt;
      const wob=Math.sin(t*2+it.ph)*(it.k==='p'?12:16);
      const fl=it.k==='p'&&it.vx>0?' scaleX(-1)':'';
      it.el.style.transform=`translate(${it.x-it.r+(it.k!=='p'?wob:0)}px,${it.y-it.r+(it.k==='p'?wob:0)}px)${fl}`;
      if(Math.hypot(it.x-x,it.y-y)<r*.8+it.r*.8){
        if(it.k==='j'){if(hurt<=0){hurt=1;hero.classList.remove('hurt');void hero.offsetWidth;hero.classList.add('hurt');sfx.soft();act(hp,'sad');if(t-lastOw>4){lastOw=t;say(pick(['Aduh, kena ubur-ubur! Berenang menjauh, ya.','Ups! Hindari ubur-ubur!']))}}continue}
        it.el.remove();items.splice(i,1);
        const [px,py]=A.page(it.x,it.y);
        if(it.k==='s'){sfx.pop();burst(px,py,['✨','⭐'],6);flyStar(px,py);act(hp,'hop');
          if(sl.fill()>=GOAL)return party(`${me.n} berhasil mengumpulkan ${WORD[GOAL]||GOAL} bintang!`,me);
        }else{const fresh=gain(it.p);yay([px,py],fresh?`Wah, kamu bertemu ${it.p.n}! Masuk koleksi!`:`Halo lagi, ${it.p.n}!`,{fx:['💖','💧','✨']});act(hp,'spin')}
        continue;
      }
      if(it.y<-it.r*2||it.x<-it.r*3||it.x>A.W+it.r*3){it.el.remove();items.splice(i,1)}
    }
  });
}

/* ================= 2. Mancing ================= */
function fishing(root,sc,lv){
  const A=arena(root,sc,'fishy','<div class="wavetop"></div><div class="dock"></div>');
  const GOAL=3+lv,sl=slots(A.el,GOAL),WIN=Math.max(1.6,3.4-lv*.35);
  for(let i=0;i<3;i++){const f=h('div','shfish','🐟');f.style.top=rnd(45,85)+'%';f.style.animationDuration=rnd(9,16)+'s';f.style.animationDelay=-rnd(0,12)+'s';A.el.append(f)}
  const fs=()=>Math.max(64,Math.min(140,Math.min(A.W,A.H)*.2));
  const me=byId(S.buddy),fisher=h('div','sprite hero'),fp=pic(me,{s:fs()+'px'});fisher.append(fp);A.el.append(fisher);
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('class','lines');
  svg.innerHTML='<line stroke="#7a4a1f" stroke-width="6" stroke-linecap="round"/><path fill="none" stroke="#fff" stroke-width="2"/>';A.el.append(svg);
  const rod=svg.firstChild,line=svg.lastChild;
  const bob=h('div','bobber');bob.hidden=true;A.el.append(bob);
  let state='idle',bx=0,by=0,cx=0,cy=0,tx=0,ty=0,castT=0,biteId=0,lastHint=0;
  const geo=()=>{const s=fs(),wt=A.H*.34,fx=A.W*.04,fy=wt-16-s;return{s,wt,fx,fy,tipX:fx+s*1.45,tipY:fy-s*.15}};
  A.onresize=()=>fp.style.setProperty('--s',fs()+'px');
  say(`Ketuk airnya untuk melempar kail. Kalau pelampungnya bergoyang, cepat ketuk!`);
  sc.on(A.el,'pointerdown',e=>{
    const [x,y]=A.local(e),G=geo();
    if(state==='idle'){if(y<G.wt+20){sfx.soft();return say('Lempar ke air, ya. Ketuk bagian yang biru!')}
      state='cast';castT=0;tx=x;ty=y;bob.hidden=false;sfx.whoosh();act(fp,'wiggle')}
    else if(state==='wait'){const n=Date.now();if(n-lastHint>2500){lastHint=n;say(pick(['Sabar, ya. Tunggu pelampungnya bergoyang.','Ssst, tunggu sebentar...','Belum, tunggu sampai ada tanda seru!']))}}
    else if(state==='bite')reel();
  });
  function bite(){state='bite';const id=++biteId;bob.innerHTML='<div class="excl">!</div>';sfx.splash();say(pick(['Sekarang! Ketuk!','Ada yang makan umpan! Ketuk cepat!','Ayo, tarik!']),true);
    sc.later(()=>{if(state==='bite'&&biteId===id){state='idle';bob.hidden=true;bob.innerHTML='';sfx.soft();act(fp,'sad');say(pick(['Yah, lepas! Lempar lagi, ya.','Ikannya kabur. Coba lagi!']))}},WIN*1000)}
  function reel(){
    state='reel';bob.hidden=true;bob.innerHTML='';
    const p=pick(POOL.laut),G=geo(),f=h('div','sprite'),s=G.s*1.05;f.append(pic(p,{s:s+'px'}));A.el.append(f);
    const sx=bx-s/2,sy=by-s/2,ex=G.fx+G.s*.6,ey=G.fy-s*.9;
    sfx.splash();
    f.animate([{transform:`translate(${sx}px,${sy}px) scale(.3) rotate(0)`},{transform:`translate(${(sx+ex)/2}px,${Math.min(sy,ey)-A.H*.18}px) scale(1.1) rotate(-200deg)`,offset:.55},{transform:`translate(${ex}px,${ey}px) scale(1) rotate(-360deg)`}],{duration:1000,easing:'ease-in-out',fill:'forwards'}).onfinish=()=>{
      const fresh=gain(p);const [px,py]=A.page(ex+s/2,ey+s/2);
      yay([px,py],fresh?`${praise()} Kamu memancing ${p.n}! Masuk koleksi!`:`${praise()} Dapat ${p.n} lagi!`);act(fp,'spin');
      sc.later(()=>{f.animate([{opacity:1},{opacity:0,transform:`translate(${ex}px,${ey-60}px) scale(.5)`}],{duration:500,fill:'forwards'}).onfinish=()=>f.remove()},900);
      state='idle';if(sl.fill()>=GOAL)sc.later(()=>party(`Kamu memancing ${WORD[GOAL]} Pokémon!`,p),1200);
    };
  }
  sc.loop((dt,t)=>{
    const G=geo();
    fisher.style.transform=`translate(${G.fx}px,${G.fy+Math.sin(t*2)*2}px) scaleX(-1)`;
    rod.setAttribute('x1',G.fx+G.s*.7);rod.setAttribute('y1',G.fy+G.s*.45);rod.setAttribute('x2',G.tipX);rod.setAttribute('y2',G.tipY);
    if(state==='cast'){castT+=dt/.6;const k=Math.min(1,castT);cx=G.tipX+(tx-G.tipX)*k;cy=G.tipY+(ty-G.tipY)*k-Math.sin(Math.PI*k)*A.H*.25;
      if(k>=1){state='wait';const r=h('div','ring');r.style.left=tx+'px';r.style.top=ty+'px';A.el.append(r);setTimeout(()=>r.remove(),900);sfx.splash();
        const id=++biteId;sc.later(()=>{if(state==='wait'&&biteId===id)bite()},rnd(1400,3800))}}
    if(state==='wait'){cx=tx;cy=ty+Math.sin(t*3)*3}
    if(state==='bite'){cx=tx+Math.sin(t*30)*3;cy=ty+Math.abs(Math.sin(t*12))*12;if(Math.random()<dt*4){const r=h('div','ring');r.style.left=tx+'px';r.style.top=ty+'px';A.el.append(r);setTimeout(()=>r.remove(),900)}}
    if(state==='cast'||state==='wait'||state==='bite'){bx=cx;by=cy;bob.style.transform=`translate(${cx}px,${cy}px)`;
      const mx=(G.tipX+cx)/2,my=Math.max(G.tipY,cy)+30;line.setAttribute('d',`M${G.tipX},${G.tipY} Q${mx},${my} ${cx},${cy}`)}
    else line.setAttribute('d','');
  });
}

/* ================= 3. Telur menetas ================= */
function egg(root,sc,lv){
  const ROUNDS=3,NEED=4+lv*2;let n=0;
  const wrap=h('div','eggwrap');root.append(wrap);
  const COLORS=[['#fff6d6','#7fd17a'],['#ffe2ef','#ff8fb8'],['#e3f4ff','#6bb8ff'],['#f3e8ff','#b07cff'],['#fff0dc','#ff9f45'],['#e9fff4','#2fbf8a']];
  function next(){
    n++;wrap.innerHTML='';
    const pool=Math.random()<.4?DEX.filter(p=>p.baby):POOL.base,p=pick(pool);
    const [c1,c2]=pick(COLORS);
    const e=h('button','egg enter');e.setAttribute('aria-label','Telur');e.style.setProperty('--c1',c1);e.style.setProperty('--c2',c2);
    e.innerHTML='<svg viewBox="0 0 100 128" aria-hidden="true"><path d="M50 14 L44 30 L54 38 L46 54"/><path d="M14 64 L28 70 L24 82 L38 88"/><path d="M86 60 L74 68 L80 80 L64 88 L68 100"/><path d="M40 104 L50 96 L58 108 L66 100"/></svg>';
    const nest=h('div','nest');wrap.append(e,nest);
    let taps=0,done=false;const cracks=e.querySelectorAll('path');
    say(n===1?pick(['Ada telur misterius! Ketuk-ketuk telurnya supaya menetas.','Siapa ya di dalam telur ini? Ayo ketuk!']):pick(['Telur baru! Ketuk lagi!','Wah, ada telur lagi. Ketuk, yuk!']));
    e.onclick=()=>{
      if(done)return;taps++;sfx.crack();tone(260+taps*55,.12,'triangle',.12);
      e.animate([{transform:'rotate(0)'},{transform:'rotate(-14deg) scale(1.05,.95)'},{transform:'rotate(12deg)'},{transform:'rotate(-6deg)'},{transform:'rotate(0)'}],{duration:420});
      const [x,y]=center(e);burst(x,y-30,['✨','💫'],4);
      const show=Math.floor(taps/NEED*cracks.length+.0001);cracks.forEach((c,i)=>c.classList.toggle('on',i<show));
      if(taps===Math.ceil(NEED/2))say(pick(['Terus! Telurnya mulai retak!','Sedikit lagi!','Ada yang bergerak di dalam!']),true);
      if(taps>=NEED)hatch();
    };
    function hatch(){
      done=true;sfx.whoosh();
      e.animate([{transform:'scale(1)',filter:'brightness(1)'},{transform:'scale(1.25)',filter:'brightness(3)'},{transform:'scale(1.5)',opacity:0,filter:'brightness(4)'}],{duration:500,fill:'forwards'});
      const [x,y]=center(e);burst(x,y,['🥚','✨','💖','⭐'],18);
      sc.later(()=>{
        e.remove();const b=h('div','baby popin'),bp=pic(p);b.append(bp);wrap.insertBefore(b,nest);
        const fresh=gain(p);yay(b,`${pick(['Halo!','Haiii!','Selamat datang!'])} Ini ${p.n}! ${fresh?'Pokémon baru untuk koleksimu!':''}`);
        sc.later(()=>act(bp,'dance'),700);sc.later(()=>act(bp,'hop'),1700);
        if(n<ROUNDS){const nb=h('button','bigbtn popin','🥚 Telur berikutnya');nb.style.animationDelay='1.2s';nb.onclick=()=>{sfx.pop();next()};wrap.append(nb)}
        else sc.later(()=>party(`Tiga telur sudah menetas!`,p),2600);
      },420);
    }
  }
  next();
}

/* ================= 4. Kasih makan & evolusi ================= */
function feed(root,sc,lv){
  const chain=randomChain(lv>=3?3:2);let st=0,p=chain[0],fed=0,busy=false,want=null;
  const NEED=2+lv;const FRUITS=['🍓','🫐','🍎','🍇','🍑','🍌','🍉','🍒'];
  const box=h('div','feed'),hearts=h('div','hearts'),pet=h('button','pet'),tray=h('div','berries');
  box.append(hearts,pet,tray);root.append(box);
  let petPic=pic(p);pet.append(petPic);
  const drawHearts=()=>{hearts.innerHTML='';for(let i=0;i<NEED;i++){const s=h('span',i<fed?'on':'',i<fed?'❤️':'🤍');hearts.append(s)}};
  const fillTray=()=>{tray.innerHTML='';const n=lv>=4?5:4;let fs=sample(FRUITS,n);if(want&&!fs.includes(want))fs[0]=want;fs=shuffle(fs);fs.forEach((f,i)=>{const b=h('button','berry popin',f);b.style.animationDelay=i*70+'ms';b.onclick=()=>give(b,f);tray.append(b)})};
  const ask=()=>{if(lv>=4){want=pick(FRUITS);say(`${p.n} mau buah ${want}. Cari yang sama!`)}else{want=null}};
  drawHearts();ask();fillTray();
  if(!want)say(pick([`${p.n} lapar! Ketuk buahnya untuk memberi makan.`,`Ayo kasih makan ${p.n}. Pilih buah yang kamu suka!`]));
  pet.onclick=()=>{act(petPic,'hop');sfx.boing()};
  function give(b,f){
    if(busy)return;
    if(want&&f!==want){oops(b,`Itu bukan ${want}. ${p.n} mau ${want}!`);act(petPic,'wiggle');return}
    busy=true;const [sx,sy]=center(b),[ex,ey]=center(pet);
    const fl=h('span','fx',f);fl.style.fontSize='54px';document.body.append(fl);b.style.visibility='hidden';sfx.whoosh();
    fl.animate([{transform:`translate(${sx}px,${sy}px) translate(-50%,-50%)`},{transform:`translate(${(sx+ex)/2}px,${Math.min(sy,ey)-90}px) translate(-50%,-50%) scale(1.3) rotate(180deg)`,offset:.5},{transform:`translate(${ex}px,${ey}px) translate(-50%,-50%) scale(.3) rotate(360deg)`}],{duration:RM?10:600,easing:'ease-in'}).onfinish=()=>{
      fl.remove();sfx.chomp();act(petPic,'chomp');burst(ex,ey,['💖','💕','✨'],8);
      fed++;drawHearts();b.remove();
      if(fed>=NEED){evolve();return}
      say(pick(['Nyam nyam!','Enak sekali!','Mau lagi!','Terima kasih!','Hmm, lezat!']),true);
      if(lv>=4)ask();
      if(!tray.children.length||lv>=4)fillTray();
      busy=false;
    };
  }
  function evolve(){
    const nx=chain[st+1];
    say(`Eh? ${p.n} bersinar... ${p.n} berevolusi!`);mascot('yay');
    pet.classList.add('evo');
    const np=pic(nx);np.style.opacity=0;pet.append(np);
    let k=0;const STEPS=RM?2:16;
    const step=()=>{k++;const showNew=k%2===1;petPic.style.opacity=showNew?0:1;np.style.opacity=showNew?1:0;tone(300+k*45,.12,'sine',.12);
      if(k<STEPS)sc.later(step,Math.max(70,430-k*24));else finish()};
    sc.later(step,600);
    function finish(){
      document.body.append(Object.assign(h('div','flash'),{}));setTimeout(()=>document.querySelector('.flash')?.remove(),950);
      petPic.remove();np.style.opacity=1;petPic=np;pet.classList.remove('evo');
      const [x,y]=center(pet);burst(x,y,['⭐','✨','💫','🌟'],24);
      sfx.win();gain(nx);flyStar(x,y);
      say(`${praise()} ${p.n} berevolusi menjadi ${nx.n}!`);sc.later(()=>act(petPic,'spin'),500);
      p=nx;st++;fed=0;drawHearts();
      if(st>=chain.length-1){sc.later(()=>party(`${nx.n} sudah berevolusi penuh!`,nx),3000);return}
      sc.later(()=>{busy=false;ask();fillTray();if(!want)say(`${nx.n} masih lapar! Kasih makan lagi, yuk.`)},2600);
    }
  }
}

/* ================= 5. Lari dino ================= */
function runner(root,sc,lv){
  const A=arena(root,sc,'land','<div class="ground"></div>');
  const GOAL=6+lv*2,sl=slots(A.el,GOAL);
  const decor=[];
  for(let i=0;i<3;i++){const c=h('div','cloud','☁️');c.style.top=rnd(8,30)+'%';A.el.append(c);decor.push({el:c,x:rnd(0,A.W),sp:.1})}
  for(let i=0;i<4;i++){const f=h('div','far',pick(['🌴','🌋','🌳','🌴','🪨']));f.style.setProperty('--fs',rnd(48,90)+'px');A.el.append(f);decor.push({el:f,x:i*A.W/3+rnd(0,80),sp:.35})}
  const me=byId(S.buddy),hero=h('div','sprite hero'),hs=()=>Math.max(64,Math.min(160,A.H*.26)),hp=pic(me,{s:hs()+'px'});hero.append(hp);A.el.append(hero);
  A.onresize=()=>hp.style.setProperty('--s',hs()+'px');
  let y=0,vy=0,jumps=0,dist=0,hurt=0,nextSpawn=1.2,lastOw=0,landSq=0;
  const items=[];const gy=()=>A.H*.8,G=()=>A.H*3.6;
  const jump=()=>{if(jumps<2){vy=-Math.sqrt(2*G()*A.H*(jumps?.3:.44));jumps++;sfx.boing();act(hp,jumps>1?'spin':'hop',jumps>1?600:400)}};
  sc.on(A.el,'pointerdown',e=>{e.preventDefault();jump()});
  sc.on(window,'keydown',e=>{if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();jump()}});
  say(pick([`Ketuk layar supaya ${me.n} melompat! Ambil bintangnya, lompati batunya.`,`Ayo lari, ${me.n}! Ketuk untuk melompat.`]));
  function spawn(){
    const r=Math.random(),s=hs();
    if(r<.45){const el=h('div','rock','🪨'),rs=s*.5;el.style.fontSize=rs+'px';A.el.append(el);items.push({k:'rock',el,x:A.W+rs,s:rs,y:gy()-rs*.9});
      if(lv>=4&&Math.random()<.4){const e2=h('div','rock','🪨');e2.style.fontSize=rs+'px';A.el.append(e2);items.push({k:'rock',el:e2,x:A.W+rs*2.1,s:rs,y:gy()-rs*.9})}}
    else if(r<.85){const el=h('div','sprite starb'),ss=s*.45;el.style.width=el.style.height=ss+'px';el.style.fontSize=ss*.6+'px';el.textContent='⭐';A.el.append(el);
      items.push({k:'star',el,x:A.W+ss,s:ss,y:gy()-(Math.random()<.5?s*.4:s*1.15)-ss/2})}
    else{const p=pick(POOL.dino),el=h('div','sprite'),ps=s*.8;el.append(pic(p,{s:ps+'px'}));A.el.append(el);items.push({k:'poke',p,el,x:A.W+ps,s:ps,y:gy()-ps-s*.8})}
  }
  sc.loop((dt,t)=>{
    const sp=A.W*(.3+lv*.05)*(hurt>0?.6:1);dist+=sp*dt;
    vy+=G()*dt;y+=vy*dt;if(y>0){if(jumps>0){landSq=.18;act(hp,'chomp',260)}y=0;vy=0;jumps=0}
    hurt=Math.max(0,hurt-dt);landSq=Math.max(0,landSq-dt);
    const s=hs(),hx=A.W*.18,run=y===0?Math.abs(Math.sin(t*12))*-6:0;
    hero.style.transform=`translate(${hx-s/2}px,${gy()-s+y+run}px) scaleX(-1) rotate(${y===0?Math.sin(t*12)*4:-10}deg)`;
    A.el.querySelector('.ground').style.backgroundPosition=`${-dist%80}px 0`;
    decor.forEach(d=>{d.x-=sp*d.sp*dt;if(d.x<-120)d.x=A.W+rnd(20,160);d.el.style.transform=`translateX(${d.x}px)`});
    nextSpawn-=dt;if(nextSpawn<=0){spawn();nextSpawn=rnd(1.1,2.2)/(1+lv*.08)}
    for(let i=items.length-1;i>=0;i--){const it=items[i];it.x-=sp*dt;
      const bobY=it.k==='poke'?Math.sin(t*4+i)*8:0;
      it.el.style.transform=`translate(${it.x-it.s/2}px,${it.y+bobY}px)`;
      const heroCY=gy()-s/2+y;
      if(it.k==='rock'){if(hurt<=0&&Math.abs(it.x-hx)<s*.28+it.s*.35&&y>-it.s*.75){hurt=1.1;hero.classList.remove('hurt');void hero.offsetWidth;hero.classList.add('hurt');sfx.soft();act(hp,'sad');
        if(t-lastOw>4){lastOw=t;say(pick(['Aduh! Ketuk untuk melompat, ya.','Ups, tersandung! Ayo lompat!','Hati-hati batunya!']))}}}
      else if(Math.hypot(it.x-hx,(it.y+it.s/2)-heroCY)<s*.42+it.s*.4){
        it.el.remove();items.splice(i,1);const [px,py]=A.page(it.x,it.y+it.s/2);
        if(it.k==='star'){sfx.pop();burst(px,py,['✨','⭐'],6);flyStar(px,py);if(sl.fill()>=GOAL)return party(`${me.n} berlari jauh sekali!`,me)}
        else{const fresh=gain(it.p);yay([px,py],fresh?`Kamu bertemu ${it.p.n}!`:`Halo, ${it.p.n}!`,{fx:['💖','✨']})}
        continue}
      if(it.x<-it.s*2){it.el.remove();items.splice(i,1)}
    }
  });
}

/* ================= 6. Gali fosil ================= */
function fossil(root,sc,lv){
  const fresh=FOSSIL.filter(id=>!CAUGHT.has(id)),p=byId(pick(fresh.length?fresh:FOSSIL));
  const wrap=h('div','digwrap'),dig=h('div','dig enter');const stone=pic(p,{art:true,calm:true});stone.classList.add('stone');dig.append(stone);
  const cv=h('canvas');dig.append(cv);const hand=h('div','hand','👆');dig.append(hand);
  wrap.append(dig);root.append(wrap);
  say(pick(['Ada fosil di dalam pasir! Gosok pasirnya pelan-pelan.','Ayo jadi ahli fosil! Gosok pasirnya sampai fosilnya kelihatan.']));
  const ctx=cv.getContext('2d',{willReadFrequently:true});let size=0,done=false,moves=0,half=false;
  function paint(){
    const dpr=Math.min(2,window.devicePixelRatio||1),w=dig.clientWidth;if(!w||Math.abs(w-size)<2)return;
    size=w;cv.width=cv.height=Math.round(w*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.globalCompositeOperation='source-over';
    const g=ctx.createLinearGradient(0,0,0,w);g.addColorStop(0,'#f6d48d');g.addColorStop(1,'#d9a55a');ctx.fillStyle=g;ctx.fillRect(0,0,w,w);
    for(let i=0;i<500;i++){ctx.fillStyle=pick(['#e5b766','#fbe2a8','#c99245','#f0c97a']);ctx.beginPath();ctx.arc(rnd(0,w),rnd(0,w),rnd(1,3),0,7);ctx.fill()}
    for(let i=0;i<6+lv*3;i++){ctx.fillStyle=pick(['#b9a48a','#9d8b75','#cdbca3']);ctx.beginPath();ctx.ellipse(rnd(0,w),rnd(0,w),rnd(6,16),rnd(5,11),rnd(0,3),0,7);ctx.fill()}
  }
  paint();sc.resize(dig,()=>{if(!done&&!moves)paint()});
  let down=false,lx=0,ly=0;
  const pos=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  function scrub(x,y){
    ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineWidth=size*(.2-lv*.022);
    ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(x,y);ctx.stroke();lx=x;ly=y;
    if(++moves%6===0){tone(rnd(150,260),.05,'triangle',.05);check()}
  }
  function check(){
    const d=ctx.getImageData(0,0,cv.width,cv.height).data;let c=0,tot=0;
    for(let i=3;i<d.length;i+=4*37){tot++;if(d[i]<40)c++}
    const r=c/tot;if(r>.3&&!half){half=true;say(pick(['Ada yang kelihatan! Terus gosok!','Wah, itu tulangnya!']),true)}
    if(r>.6)reveal();
  }
  function reveal(){
    if(done)return;done=true;dig.classList.add('alive');
    const live=pic(p);live.style.opacity=0;dig.insertBefore(live,cv);
    say(`Fosilnya bersinar...`);tone(400,.6,'sine',.12,0,1200);
    sc.later(()=>{document.body.append(h('div','flash'));setTimeout(()=>document.querySelector('.flash')?.remove(),950);
      stone.remove();live.style.opacity=1;live.classList.add('popin');
      gain(p);yay(dig,`Wah! Fosilnya hidup lagi! Ini ${p.n}!`,{fx:['⭐','✨','🦴','💖']});flyStar(...center(dig));
      sc.later(()=>act(live,'dance'),800);sc.later(()=>party(`Kamu menghidupkan ${p.n} dari fosil!`,p),3000)},900);
  }
  sc.on(cv,'pointerdown',e=>{if(done)return;down=true;hand.remove();[lx,ly]=pos(e);scrub(lx+1,ly+1);cv.setPointerCapture(e.pointerId)});
  sc.on(cv,'pointermove',e=>{if(down&&!done){const [x,y]=pos(e);scrub(x,y)}});
  sc.on(cv,'pointerup',()=>down=false);sc.on(cv,'pointercancel',()=>down=false);
}

/* ================= 7. Tangkap buah ================= */
function catcher(root,sc,lv){
  const A=arena(root,sc,'land','<div class="ground"></div>');
  const GOAL=6+lv*2,sl=slots(A.el,GOAL);
  const me=byId(S.buddy),hs=()=>Math.max(70,Math.min(150,Math.min(A.W,A.H)*.24)),hero=h('div','sprite hero'),hp=pic(me,{s:hs()+'px'});hero.append(hp);A.el.append(hero);
  A.onresize=()=>hp.style.setProperty('--s',hs()+'px');
  let x=A.W/2,tx=x,face=1,dizzy=0,next=.6,lastOw=0;const items=[];
  const FR=['🍓','🍎','🍑','🍌','🍇','🍒','🫐','🍉'];
  sc.on(A.el,'pointerdown',e=>{tx=A.local(e)[0]});
  sc.on(A.el,'pointermove',e=>{if(e.buttons||e.pointerType==='mouse')tx=A.local(e)[0]});
  sc.on(window,'keydown',e=>{if(e.key==='ArrowLeft')tx=x-80;if(e.key==='ArrowRight')tx=x+80});
  say(pick([`Geser ${me.n} untuk menangkap buah yang jatuh!`,`Buahnya berjatuhan! Bantu ${me.n} menangkapnya.`])+(lv>=3?' Jangan tangkap batu, ya!':''));
  function spawn(){const s=hs()*.42,r=Math.random();const k=lv>=3&&r<.18?'rock':r<.9?'fruit':'poke';
    const el=h('div','rock');el.style.fontSize=s+'px';
    if(k==='poke'){el.className='sprite';const p=pick(POOL.all);el.append(pic(p,{s:s*1.6+'px'}));items.push({k,p,el,x:rnd(s,A.W-s),y:-s*2,vy:A.H*(.22+lv*.04),s:s*1.6,rot:0})}
    else{el.textContent=k==='rock'?'🪨':pick(FR);items.push({k,el,x:rnd(s,A.W-s),y:-s,vy:A.H*(.24+lv*.05)*rnd(.9,1.15),s,rot:rnd(-1,1)})}
    A.el.append(el)}
  sc.loop((dt,t)=>{
    const s=hs(),gy=A.H*.8;x+=(tx-x)*Math.min(1,dt*(dizzy>0?2:7));x=Math.max(s/2,Math.min(A.W-s/2,x));
    if(tx<x-6)face=1;else if(tx>x+6)face=-1;dizzy=Math.max(0,dizzy-dt);
    hero.style.transform=`translate(${x-s/2}px,${gy-s+Math.abs(Math.sin(t*8))*-4}px) scaleX(${face}) rotate(${dizzy>0?Math.sin(t*20)*10:0}deg)`;
    next-=dt;if(next<=0){spawn();next=rnd(.7,1.3)/(1+lv*.1)}
    for(let i=items.length-1;i>=0;i--){const it=items[i];it.y+=it.vy*dt;
      it.el.style.transform=`translate(${it.x-it.s/2}px,${it.y}px) rotate(${it.rot*t*90}deg)`;
      if(it.y+it.s>gy-s*.7&&it.y<gy-s*.2&&Math.abs(it.x-x)<s*.5){
        it.el.remove();items.splice(i,1);const [px,py]=A.page(it.x,it.y);
        if(it.k==='rock'){dizzy=1;sfx.soft();act(hp,'sad');if(t-lastOw>3){lastOw=t;say(pick(['Aduh, batu! Hindari batunya, ya.','Ups, itu batu!']))}}
        else if(it.k==='poke'){const fresh=gain(it.p);yay([px,py],fresh?`Kamu menangkap ${it.p.n}!`:`${it.p.n} melompat ke pelukanmu!`,{fx:['💖','✨']});act(hp,'spin')}
        else{sfx.chomp();act(hp,'chomp');burst(px,py,['✨','💖'],5);flyStar(px,py);if(sl.fill()>=GOAL)return party(`${me.n} kenyang sekali! Terima kasih!`,me)}
        continue}
      if(it.y>A.H+40){it.el.remove();items.splice(i,1)}
    }
  });
}

/* ================= 8. Ciluk ba ================= */
function peek(root,sc,lv){
  const N=lv>=4?9:6,GOAL=8+lv*2,STAY=Math.max(900,2100-lv*220),MAXUP=1+Math.ceil(lv/2);
  const grid=h('div','peek');root.append(grid);let got=0;
  const holes=[];
  for(let i=0;i<N;i++){const hole=h('div','hole popin'),pp=h('button','peeker');hole.style.animationDelay=i*60+'ms';hole.append(pp,h('div','wave2'));grid.append(hole);
    const o={pp,busy:false,hit:false,p:null,pic:null};holes.push(o);
    pp.addEventListener('pointerdown',e=>{e.preventDefault();if(!pp.classList.contains('up')||o.hit)return;o.hit=true;got++;
      act(o.pic,'spin');sfx.pop();const [x,y]=center(pp);burst(x,y,['💖','✨','⭐'],8);flyStar(x,y);mascot('yay');
      if(got===1||Math.random()<.35)say(pick([`Halo, ${o.p.n}!`,`Ciluk ba, ${o.p.n}!`,`Ketemu ${o.p.n}!`,`${praise()}`]));
      gain(o.p);
      setTimeout(()=>{pp.classList.remove('up');setTimeout(()=>o.busy=false,350)},450);
      if(got>=GOAL)sc.later(()=>party(`Kamu menyapa ${WORD[GOAL]||GOAL} Pokémon!`),700)})}
  say(pick(['Pokémon bersembunyi di balik ombak. Ketuk yang muncul!','Ciluk ba! Ketuk Pokémon yang mengintip!']));
  function up(){const free=holes.filter(o=>!o.busy);if(!free.length||holes.filter(o=>o.busy).length>=MAXUP)return;
    const o=pick(free);o.busy=true;o.hit=false;o.p=pick(POOL.anim);o.pp.innerHTML='';o.pic=pic(o.p);o.pp.append(o.pic);
    requestAnimationFrame(()=>o.pp.classList.add('up'));tone(600,.08,'sine',.08,0,900);
    sc.later(()=>{if(!o.hit){o.pp.classList.remove('up');sc.later(()=>o.busy=false,380)}},STAY+rnd(-200,300));}
  sc.later(up,600);sc.every(up,Math.max(450,1000-lv*100));
}

/* ================= 9. Siapa itu (bayangan) ================= */
function shadow(root,sc,lv){
  const ROUNDS=5,OPTS=[3,3,4,4,5][lv-1];let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('Kamu jago menebak bayangan!');
    q++;const ans=pick(POOL.all);
    let others=lv>=4?DEX.filter(p=>p.id!==ans.id&&p.ty.some(t=>ans.ty.includes(t))):DEX.filter(p=>p.id!==ans.id);
    if(others.length<OPTS)others=DEX.filter(p=>p.id!==ans.id);
    const opts=shuffle([ans,...sample(others,OPTS-1)]);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const spot=h('div','spot shadow');const sp=pic(ans,{art:true,calm:true});spot.append(sp);
    const row=h('div','opts');let done=false;
    opts.forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=(200+i*90)+'ms';const pp=pic(p);b.append(pp,h('b',null,p.n));
      b.onclick=()=>{if(done)return;
        if(p.id===ans.id){done=true;b.classList.add('yes');spot.classList.remove('shadow');spot.classList.add('show');act(sp,'spin');act(pp,'hop');gain(ans);
          yay(b,`${praise()} Itu ${ans.n}, Pokémon ${TYPE_ID[ans.ty[0]]}!`);sc.later(next,2300)}
        else{b.classList.add('no');b.disabled=true;oops(b,`Itu ${p.n}. ${tryAgain()}`)}};
      row.append(b)});
    box.append(spot,row);
    say(q===1?pick(['Siapa Pokémon ini? Pilih gambar yang sama dengan bayangannya!','Lihat bayangannya. Pokémon yang mana, ya?']):pick(['Siapa Pokémon ini?','Yang ini siapa, ya?','Coba tebak, siapa ini?']));
  }
  next();
}

/* ================= 10. Berhitung ================= */
function count(root,sc,lv){
  const ROUNDS=5,MAX=[3,5,7,9,10][lv-1];let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('Pintar! Kamu sudah bisa berhitung!');
    q++;const n=ri(1,MAX),p=pick(POOL.anim),mixed=lv>=3&&Math.random()<.6;
    const other=mixed?pick(POOL.anim.filter(x=>x.id!==p.id)):null,extra=mixed?ri(1,3):0;
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const tot=n+extra,area=h('div','count-area '+(tot<=3?'few':tot<=6?'mid':'many'));
    let tapped=0;
    const list=shuffle([...Array(n).fill(p),...Array(extra).fill(other)]);
    list.forEach((it,i)=>{const c=h('button','cnt popin');c.style.animationDelay=i*110+'ms';c.setAttribute('aria-label',it.n);const pp=pic(it);c.append(pp);
      c.onclick=()=>{if(it!==p){oops(c,`Itu ${it.n}. Hitung ${p.n} saja, ya!`);return}
        if(c.classList.contains('on'))return;tapped++;c.classList.add('on');c.append(h('span','tag',tapped));act(pp,'hop');tone(400+tapped*60,.14,'triangle',.15);speak(WORD[tapped])};
      area.append(c)});
    const row=h('div','opts');let done=false;
    const set=new Set([n]);while(set.size<(lv>=5?4:3))set.add(ri(1,Math.max(5,MAX)));
    [...set].sort((a,b)=>a-b).forEach((v,i)=>{const b=h('button','opt num popin',v);b.style.animationDelay=(300+i*90)+'ms';
      b.onclick=()=>{if(done)return;
        if(v===n){done=true;b.classList.add('yes');gain(p);area.querySelectorAll('.cnt .pic').forEach((x,j)=>setTimeout(()=>act(x,'hop'),j*90));
          yay(b,`${praise()} Ada ${WORD[n]} ${p.n}!`);sc.later(next,2400)}
        else{b.classList.add('no');b.disabled=true;oops(b,'Hmm, bukan. Ayo hitung lagi pelan-pelan!')}};
      row.append(b)});
    box.append(area,row);
    say(mixed?`Ada berapa ${p.n}? Hitung ${p.n} saja, ya!`:pick([`Ada berapa ${p.n}? Ketuk satu per satu sambil menghitung!`,`Ayo hitung ${p.n}. Ada berapa, ya?`]));
  }
  next();
}

/* ================= 11. Besar kecil ================= */
function sizes(root,sc,lv){
  const ROUNDS=6;let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('Kamu tahu mana yang besar dan kecil!');
    q++;const n=lv<=1?2:lv<=3?3:4,p=pick(POOL.anim);
    const kinds=lv>=3?['besar','kecil','sedang']:['besar','kecil'];let ask=kinds[(q-1)%kinds.length];if(ask==='sedang'&&n!==3)ask='besar';
    const F=n===2?[.5,1]:n===3?[.42,.7,1]:[.35,.55,.78,1];
    const fs=shuffle(F),target=ask==='besar'?1:ask==='kecil'?F[0]:F[1];
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const row=h('div','sizes');let done=false;
    fs.forEach((f,i)=>{const b=h('button','opt popin');b.style.animationDelay=i*100+'ms';const pp=pic(lv>=5?pick(POOL.anim):p,{s:`calc(var(--base) * ${f} * ${n>3?.75:1})`});b.append(pp);
      b.onclick=()=>{if(done)return;if(f===target){done=true;b.classList.add('yes');act(pp,'spin');yay(b,`${praise()} Itu yang paling ${ask}!`);sc.later(next,2000)}
        else{b.classList.add('no');act(pp,'wiggle');oops(b,`Hmm, bukan. Cari yang paling ${ask}!`);setTimeout(()=>b.classList.remove('no'),900)}};
      row.append(b)});
    box.append(row);
    say(pick([`Ketuk yang paling ${ask.toUpperCase()}!`,`Mana yang paling ${ask}?`]));
  }
  next();
}

/* ================= 12. Tebak pola ================= */
function pattern(root,sc,lv){
  const ROUNDS=5;let q=0;
  const PAT=[['AB'],['AB','AAB','ABB'],['ABC','AAB','ABB'],['AABB','ABC','ABAC'],['ABCD','AABB','ABAC','ABBC']][lv-1];
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('Kamu pintar mengenali pola!');
    q++;const pat=pick(PAT),keys=[...new Set(pat)],mons=sample(POOL.anim,keys.length+1);
    const map=Object.fromEntries(keys.map((k,i)=>[k,mons[i]]));
    let seq='';while(seq.length<pat.length*2+1)seq+=pat;seq=seq.slice(0,Math.max(5,pat.length*2+1));
    const ans=map[seq[seq.length-1]];
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const line=h('div','count-area '+(seq.length<=5?'mid':'many'));
    [...seq.slice(0,-1)].forEach((k,i)=>{const c=h('div','cnt popin');c.style.animationDelay=i*120+'ms';c.append(pic(map[k]));line.append(c)});
    const qm=h('div','cnt popin','<span style="font-family:var(--display);font-weight:800;font-size:clamp(40px,10vmin,80px);display:grid;place-items:center;width:var(--s,90px);height:var(--s,90px)">?</span>');qm.style.animationDelay=seq.length*120+'ms';line.append(qm);
    const row=h('div','opts');let done=false;
    const opts=shuffle([...new Set([...keys.map(k=>map[k]),mons[keys.length]])]).slice(0,Math.max(3,keys.length+ (lv>=4?1:0)));
    if(!opts.includes(ans))opts[0]=ans;
    shuffle(opts).forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=(500+i*90)+'ms';const pp=pic(p);b.append(pp);
      b.onclick=()=>{if(done)return;if(p===ans){done=true;b.classList.add('yes');qm.innerHTML='';const np=pic(p);qm.append(np);qm.classList.add('on');
          line.querySelectorAll('.pic').forEach((x,j)=>setTimeout(()=>act(x,'hop'),j*110));yay(b,`${praise()} Polanya benar!`);sc.later(next,2600)}
        else{b.classList.add('no');b.disabled=true;oops(b)}};
      row.append(b)});
    box.append(line,row);
    sc.later(()=>{const names=[...seq.slice(0,-1)].map(k=>map[k].n);speak(names.join(', ')+'. Lalu siapa?')},300);
    $('.say').textContent='Siapa yang berikutnya?';
  }
  next();
}

/* ================= 13. Urutan evolusi ================= */
function order(root,sc,lv){
  const ROUNDS=lv<=2?3:4;let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('Kamu hafal urutan evolusi!');
    q++;const ch=randomChain(lv>=3?3:2).slice(0,lv>=3?3:2);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const top=h('div','opts'),bot=h('div','opts');let step=0;
    const holes=ch.map((_,i)=>{const s=h('div','opt','<span style="font-family:var(--display);font-weight:800;font-size:40px;width:clamp(62px,min(19vw,16vh),124px);height:clamp(62px,min(19vw,16vh),124px);display:grid;place-items:center;opacity:.35">'+(i+1)+'</span>');top.append(s);if(i<ch.length-1)top.append(h('b',null,'<span style="font-size:34px;color:#fff;align-self:center">➜</span>'));return s});
    shuffle(ch).forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=i*100+'ms';const pp=pic(p);b.append(pp,h('b',null,p.n));
      b.onclick=()=>{if(p===ch[step]){sfx.pop();const hole=holes[step];hole.innerHTML='';const np=pic(p);hole.append(np);hole.classList.add('yes','popin');act(np,'hop');b.style.visibility='hidden';step++;
          gain(p);
          if(step>=ch.length){yay(hole,`${praise()} ${ch.map(x=>x.n).join(', lalu ')}!`);sc.later(next,2800)}
          else speak(step===1?`Betul, ${p.n} yang pertama. Lalu?`:`Lalu ${p.n}!`)}
        else oops(b,step===0?'Cari yang paling kecil dulu, ya!':'Hmm, siapa evolusi berikutnya?')};
      bot.append(b)});
    box.append(top,bot);
    say(pick(['Susun dari yang belum berevolusi. Ketuk yang paling kecil dulu!','Siapa yang pertama, lalu berevolusi menjadi siapa?']));
  }
  next();
}

/* ================= 14. Huruf awal ================= */
function letters(root,sc,lv){
  const ROUNDS=5,OPTS=[2,3,3,4,4][lv-1];let q=0;
  const EASY=[...'ABCDEGHIKLMPRST'];
  const box=h('div','q');root.append(box);
  const first=p=>p.n.normalize('NFD').replace(/[^A-Za-z]/g,'').charAt(0).toUpperCase();
  function next(){
    if(q>=ROUNDS)return party('Kamu sudah kenal banyak huruf!');
    q++;const L=pick(lv<=2?EASY:Object.keys(LETTER).filter(k=>DEX.some(p=>first(p)===k)));
    const ans=pick(DEX.filter(p=>first(p)===L&&p.g)),others=sample(DEX.filter(p=>first(p)!==L&&p.g),OPTS-1);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const big=h('div','spot popin',`<span style="font-family:var(--display);font-weight:800;font-size:min(30vmin,180px);line-height:1;color:var(--paper);text-shadow:0 6px 0 var(--grape)">${L}</span>`);
    const row=h('div','opts');let done=false;
    shuffle([ans,...others]).forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=(200+i*90)+'ms';const pp=pic(p);
      const nm=h('b');nm.innerHTML=`<span style="color:var(--coral);font-size:1.4em">${p.n.charAt(0)}</span>${p.n.slice(1)}`;b.append(pp,nm);
      b.onclick=()=>{if(done)return;if(p===ans){done=true;b.classList.add('yes');act(pp,'spin');act(big,'hop');gain(p);yay(b,`${praise()} ${p.n} mulai dengan huruf ${LETTER[L]}!`);sc.later(next,2500)}
        else{b.classList.add('no');b.disabled=true;oops(b,`${p.n} mulai dengan huruf ${LETTER[first(p)]||first(p)}. Cari huruf ${LETTER[L]}!`)}};
      row.append(b)});
    box.append(big,row);
    say(`Ini huruf ${LETTER[L].toUpperCase()}. Pokémon mana yang namanya mulai dengan huruf ${LETTER[L]}?`);
  }
  next();
}

/* ================= 15. Kartu kembar ================= */
function memory(root,sc,lv){
  const PAIRS=[3,4,6,8,10][lv-1];
  const wrap=h('div','memwrap'),grid=h('div','mem');wrap.append(grid);root.append(wrap);
  const cols=PAIRS<=3?3:PAIRS<=4?4:PAIRS<=6?4:5;grid.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;
  grid.style.width=`min(100%,${cols*(PAIRS*2/cols>3?16:22)}vh)`;
  const set=sample(POOL.anim,PAIRS),cards=shuffle([...set,...set]);
  let open=[],lock=false,matched=0,tries=0;
  cards.forEach((p,i)=>{
    const c=h('button','card popin');c.style.animationDelay=i*45+'ms';c.setAttribute('aria-label','Kartu');
    const inn=h('div','in'),f=h('div','f'),pp=pic(p);f.append(pp);inn.append(h('div','b'),f);c.append(inn);c.pp=pp;
    c.onclick=()=>{
      if(lock||c.classList.contains('up')||c.classList.contains('done'))return;
      c.classList.add('up');sfx.flip();open.push({c,p});setTimeout(()=>act(pp,'hop'),250);speak(p.n);
      if(open.length===2){lock=true;tries++;const [a,b]=open;
        if(a.p.id===b.p.id){sc.later(()=>{a.c.classList.add('done');b.c.classList.add('done');act(a.c.pp,'spin');act(b.c.pp,'spin');gain(a.p);matched++;open=[];lock=false;
            yay(b.c,`${pick(['Kembar!','Sama!','Cocok!'])} ${a.p.n} dan ${a.p.n}!`);
            if(matched===PAIRS)sc.later(()=>party(`Semua kartu kembar ketemu dalam ${tries} kali coba!`,a.p),1400)},450)}
        else sc.later(()=>{a.c.classList.remove('up');b.c.classList.remove('up');open=[];lock=false;sfx.soft();if(Math.random()<.3)say(pick(['Belum sama. Ingat-ingat tempatnya, ya!','Hmm, beda. Coba lagi!']))},1100)}
    };
    grid.append(c);
  });
  say(pick(['Buka dua kartu. Cari gambar yang kembar!','Ayo cari pasangan Pokémon yang sama!']));
}

/* ================= 16. Puzzle ================= */
function puzzle(root,sc,lv){
  const N=[2,2,3,3,4][lv-1],ROUNDS=lv<=2?3:2;let r=0;
  const box=h('div','pz');root.append(box);
  function next(){
    if(r>=ROUNDS)return party('Puzzle selesai semua!');
    r++;const p=pick(POOL.all);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const board=h('div','board');board.style.setProperty('--n',N);
    const ghost=h('div','ghost');ghost.style.backgroundImage=`url(${ART(p.id)})`;board.append(ghost);
    const tray=h('div','tray'),SC=N<=2?.82:N===3?.62:.5;box.append(board,tray);
    const slots=[];for(let i=0;i<N*N;i++){const s=h('div','slotp');s.dataset.i=i;board.append(s);slots.push(s)}
    let placed=0;
    requestAnimationFrame(()=>{
      const B=board.clientWidth,ps=B/N;
      shuffle([...Array(N*N).keys()]).forEach((i,k)=>{
        const pc=h('div','piece');if(!RM)pc.animate([{opacity:0},{opacity:1}],{duration:400,delay:k*60,fill:'backwards'});pc.dataset.i=i;
        const x=-(i%N)*ps,y=-Math.floor(i/N)*ps;
        pc.style.setProperty('--rot',rnd(-10,10)+'deg');
        pc.fit=k=>{pc.style.setProperty('--ps',ps*k+'px');pc.style.background=`url(${ART(p.id)}) ${x*k}px ${y*k}px/${B*k}px ${B*k}px no-repeat,radial-gradient(circle at 50% 45%,#fff,#bfeaff 70%) ${x*k}px ${y*k}px/${B*k}px ${B*k}px no-repeat`};
        pc.fit(SC);tray.append(pc);drag(pc,ps,B,x,y);
      });
    });
    say(pick([`Susun potongan puzzle ${p.n}! Geser ke tempatnya.`,`Ayo susun puzzlenya. Siapa ya gambarnya?`]));
    function drag(pc,ps,B,bx,by){
      let ox=0,oy=0,on=false;
      pc.addEventListener('pointerdown',e=>{if(pc.parentElement.classList.contains('slotp'))return;on=true;const r=pc.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;
        const k=ps/r.width;ox*=k;oy*=k;document.body.append(pc);pc.classList.add('drag');pc.fit(1);pc.style.width=pc.style.height=ps+'px';pc.style.left=(e.clientX-ox)+'px';pc.style.top=(e.clientY-oy)+'px';pc.setPointerCapture(e.pointerId);sfx.flip()});
      pc.addEventListener('pointermove',e=>{if(!on)return;pc.style.left=(e.clientX-ox)+'px';pc.style.top=(e.clientY-oy)+'px'});
      const end=e=>{if(!on)return;on=false;
        const r=pc.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;pc.classList.remove('drag');
        const target=slots[+pc.dataset.i],tr=target.getBoundingClientRect();
        pc.style.left=pc.style.top='';pc.style.width=pc.style.height='';pc.fit(1);
        if(Math.hypot(cx-(tr.left+tr.width/2),cy-(tr.top+tr.height/2))<ps*.6){
          pc.style.background=pc.style.background;target.append(pc);act(pc,'chomp');sfx.pop();burst(tr.left+tr.width/2,tr.top+tr.height/2,['✨'],4);placed++;
          if(placed===N*N){board.classList.add('done');ghost.remove();const [x,y]=center(board);gain(p);
            const live=pic(p);live.style.cssText='position:absolute;inset:0;width:100%;height:100%;--s:100%';live.classList.add('popin');
            sc.later(()=>{board.querySelectorAll('.slotp').forEach(s=>s.style.opacity=0);board.append(live);act(live,'spin')},500);
            yay([x,y],`${praise()} Puzzlenya jadi! Itu ${p.n}!`);sc.later(next,3000)}
        }else{tray.append(pc);pc.fit(SC);pc.classList.remove('nope');void pc.offsetWidth;pc.classList.add('nope');sfx.soft()}};
      pc.addEventListener('pointerup',end);pc.addEventListener('pointercancel',end);
    }
  }
  next();
}

/* ================= 17. Ikuti irama ================= */
function simon(root,sc,lv){
  const START=1+Math.ceil(lv/2),END=START+2+Math.floor(lv/2);
  const mons=sample(POOL.anim,4),box=h('div','q'),pads=h('div','opts');root.append(box);box.append(pads);
  const COL=['#ff6f61','#2fa6e0','#ffcf33','#34c27a'];
  const btns=mons.map((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=i*90+'ms';b.style.borderColor=COL[i];const pp=pic(p);b.append(pp,h('b',null,p.n));b.pp=pp;pads.append(b);return b});
  let seq=[],inp=0,listening=false;
  const flash=(i,ms=420)=>{const b=btns[i];sfx.note(i);act(b.pp,'hop',ms);b.animate([{background:COL[i]},{background:'#fff'}],{duration:ms+200})};
  function play(){listening=false;inp=0;say(seq.length===START?pick(['Dengarkan nyanyian Pokémon, lalu tiru, ya!','Perhatikan siapa yang bernyanyi!']):pick(['Dengar lagi...','Sekarang lebih panjang!']));
    seq.forEach((i,k)=>sc.later(()=>flash(i),1300+k*Math.max(450,800-lv*60)));
    sc.later(()=>{listening=true;say('Giliranmu!')},1300+seq.length*Math.max(450,800-lv*60)+200)}
  btns.forEach((b,i)=>b.onclick=()=>{if(!listening)return;flash(i,300);
    if(i===seq[inp]){inp++;if(inp===seq.length){listening=false;
        if(seq.length>=END){mons.forEach(p=>gain(p));yay(b,'Kamu hebat mengikuti irama!');sc.later(()=>party('Nyanyiannya sempurna!',mons[0]),1800)}
        else{yay(b,praise());seq.push(ri(0,3));sc.later(play,1500)}}}
    else{listening=false;oops(b,'Ups, beda nadanya. Dengar sekali lagi, ya!');sc.later(play,1800)}});
  for(let i=0;i<START;i++)seq.push(ri(0,3));
  play();
}

/* ================= 18. Labirin ================= */
function maze(root,sc,lv){
  const N=[4,5,6,7,8][lv-1];
  const wrap=h('div','memwrap');root.append(wrap);
  const board=h('div','board');board.style.setProperty('--n',N);board.style.background='#8fdc7a';board.style.gap='0';wrap.append(board);
  // labirin acak (DFS)
  const W=[...Array(N*N)].map(()=>({n:1,e:1,s:1,w:1})),seen=new Set([0]),st=[0];
  while(st.length){const c=st[st.length-1],x=c%N,y=Math.floor(c/N);
    const nb=[[x,y-1,'n','s'],[x+1,y,'e','w'],[x,y+1,'s','n'],[x-1,y,'w','e']].filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N&&!seen.has(b*N+a));
    if(!nb.length){st.pop();continue}const [a,b,d,o]=pick(nb),k=b*N+a;W[c][d]=0;W[k][o]=0;seen.add(k);st.push(k)}
  const cells=W.map((w,i)=>{const c=h('div');c.style.cssText=`position:relative;border-top:${w.n?4:0}px solid #2b6e2b;border-right:${w.e?4:0}px solid #2b6e2b;border-bottom:${w.s?4:0}px solid #2b6e2b;border-left:${w.w?4:0}px solid #2b6e2b;background:${(i+Math.floor(i/N))%2?'#9be28a':'#a8e897'}`;board.append(c);return c});
  const goal=N*N-1,goalEl=h('div',null,'🏠');goalEl.style.cssText='position:absolute;inset:0;display:grid;place-items:center;font-size:calc(min(80vw,42vh,420px)/'+N+'*.6)';cells[goal].append(goalEl);
  const stars=new Set();if(lv>=2)while(stars.size<Math.min(lv,N-1)){const k=ri(1,goal-1);stars.add(k)}
  stars.forEach(k=>{const s=h('div','starb','⭐');s.style.cssText='position:absolute;inset:18%;font-size:calc(min(80vw,42vh,420px)/'+N+'*.35)';s.className='starb';cells[k].append(s)});
  const me=byId(S.buddy),tok=h('div');tok.style.cssText='position:absolute;inset:0;display:grid;place-items:center;z-index:2;pointer-events:none';const tp=pic(me,{s:'92%'});tp.style.width=tp.style.height='92%';tok.append(tp);
  let at=0;cells[0].append(tok);
  say(pick([`Antar ${me.n} pulang ke rumah! Geser jarimu di jalan.`,`Bantu ${me.n} menemukan jalan pulang!`])+(stars.size?' Ambil bintangnya juga!':''));
  const can=(a,b)=>{const ax=a%N,ay=Math.floor(a/N),bx=b%N,by=Math.floor(b/N);
    if(bx===ax+1&&by===ay)return!W[a].e;if(bx===ax-1&&by===ay)return!W[a].w;if(by===ay+1&&bx===ax)return!W[a].s;if(by===ay-1&&bx===ax)return!W[a].n;return false};
  let bumped=0;
  function tryMove(b){if(b===at)return;if(!can(at,b)){if(Date.now()-bumped>900){bumped=Date.now();act(tp,'wiggle');sfx.soft()}return}
    at=b;cells[b].append(tok);act(tp,'hop',300);tone(500+(b%5)*60,.06,'triangle',.08);
    if(stars.has(b)){stars.delete(b);cells[b].querySelector('.starb')?.remove();const [x,y]=center(cells[b]);burst(x,y,['✨','⭐'],6);flyStar(x,y);sfx.pop()}
    if(b===goal){done()}}
  let ended=false;
  function done(){if(ended)return;ended=true;act(tp,'spin');yay(cells[goal],`${praise()} ${me.n} sampai di rumah!`);sc.later(()=>party(`Kamu menemukan jalan keluar labirin!`,me),1800)}
  const cellAt=(x,y)=>{const r=board.getBoundingClientRect();const cx=Math.floor((x-r.left)/r.width*N),cy=Math.floor((y-r.top)/r.height*N);return cx>=0&&cy>=0&&cx<N&&cy<N?cy*N+cx:-1};
  let down=false;
  sc.on(board,'pointerdown',e=>{down=true;board.setPointerCapture(e.pointerId);const c=cellAt(e.clientX,e.clientY);if(c>=0)tryMove(c)});
  sc.on(board,'pointermove',e=>{if(!down||ended)return;const c=cellAt(e.clientX,e.clientY);if(c>=0)tryMove(c)});
  sc.on(board,'pointerup',()=>down=false);
  board.style.touchAction='none';
  sc.on(window,'keydown',e=>{const d={ArrowLeft:-1,ArrowRight:1,ArrowUp:-N,ArrowDown:N}[e.key];if(d){e.preventDefault();tryMove(at+d)}});
}

/* ================= 19. Pecah gelembung ================= */
function bubbles(root,sc,lv){
  const ALL=[{n:'merah',c:'#ff4d4d'},{n:'biru',c:'#2f7bff'},{n:'kuning',c:'#ffd400'},{n:'hijau',c:'#26c26b'},{n:'ungu',c:'#9b5cff'},{n:'oranye',c:'#ff8a1f'},{n:'merah muda',c:'#ff7ac6'}];
  const COLORS=ALL.slice(0,[3,4,5,6,7][lv-1]);
  const A=arena(root,sc,'pond');const GOAL=6+lv*2;let got=0,target=pick(COLORS),lastWrong=0;const bubs=[];
  const announce=()=>{say(pick([`Pecahkan gelembung warna ${target.n}!`,`Sekarang cari warna ${target.n}!`]));const s=$('.say');const d=h('span','target');d.style.background=target.c;s.append(d)};
  announce();
  const dia=()=>Math.max(64,Math.min(130,Math.min(A.W,A.H)*(.22-lv*.012)));
  function spawn(){
    if(bubs.length>8+lv)return;
    const col=Math.random()<.42?target:pick(COLORS),d=dia();
    const el=h('button','bb');el.setAttribute('aria-label','Gelembung '+col.n);el.style.setProperty('--d',d+'px');el.style.setProperty('--c',col.c);
    const b={el,col,x:rnd(0,Math.max(1,A.W-d)),y:A.H+d,vy:rnd(A.H/8,A.H/5.5)*(1+lv*.1),ph:rnd(0,6),dead:false,d};
    el.onpointerdown=e=>{e.preventDefault();hit(b)};A.el.append(el);bubs.push(b);
  }
  function hit(b){
    if(b.dead)return;
    if(b.col===target){
      b.dead=true;b.el.classList.add('popd');sfx.pop();setTimeout(()=>b.el.remove(),320);got++;
      const [px,py]=A.page(b.x+b.d/2,b.y+b.d/2);burst(px,py,['💦','🫧','✨'],7);flyStar(px,py);
      if(Math.random()<.45){const p=pick(POOL.anim),f=h('div','floaty');f.append(pic(p,{s:b.d*.9+'px'}));A.el.append(f);
        f.animate([{transform:`translate(${b.x}px,${b.y}px) scale(.2)`,opacity:1},{transform:`translate(${b.x}px,${b.y-60}px) scale(1.1)`,opacity:1,offset:.3},{transform:`translate(${b.x+30}px,${b.y-200}px) scale(1)`,opacity:0}],{duration:1500,easing:'ease-out'}).onfinish=()=>f.remove();gain(p)}
      if(got>=GOAL)return party('Semua gelembung pecah! Plop plop plop!');
      if(got%3===0){let n;do{n=pick(COLORS)}while(n===target);target=n;sc.later(announce,350)}
      else speak(pick(['Plop!','Pop!',WORD[got%3]]));
    }else{
      b.el.classList.remove('nope');void b.el.offsetWidth;b.el.classList.add('nope');sfx.soft();mascot('hmm');
      const now=Date.now();if(now-lastWrong>2500){lastWrong=now;speak(`Itu ${b.col.n}. Cari warna ${target.n}!`)}
    }
  }
  spawn();sc.every(spawn,Math.max(380,680-lv*50));
  sc.loop((dt,t)=>{for(let i=bubs.length-1;i>=0;i--){const b=bubs[i];if(b.dead){bubs.splice(i,1);continue}
    b.y-=b.vy*dt;b.el.style.transform=`translate(${b.x+Math.sin(t*1.6+b.ph)*(14+lv*4)}px,${b.y}px)`;if(b.y<-150){b.el.remove();bubs.splice(i,1)}}});
}

/* ================= Koleksi (Pokédex lengkap) ================= */
let dexRegion=1;
function dex(){
  clear();curKey=null;$('#homeBtn').hidden=false;$('#ttl').textContent='Koleksiku';
  const row=h('div','sayrow'),m=h('button','mascot');m.append(pic(byId(S.buddy)));row.append(m,h('div','say'));stage.append(row);
  const w=h('div','dexwrap'),regs=h('div','regions'),g=h('div','dex');w.append(regs,g);stage.append(w);
  REGION.forEach((r,i)=>{const gen=i+1,tot=DEX.filter(p=>p.gen===gen),has=tot.filter(p=>CAUGHT.has(p.id)).length;
    const b=h('button','reg'+(gen===dexRegion?' on':''),`${r} ${has}/${tot.length}`);b.onclick=()=>{dexRegion=gen;sfx.pop();regs.querySelectorAll('.reg').forEach(x=>x.classList.remove('on'));b.classList.add('on');draw();speak(`Pokémon dari ${r}`)};regs.append(b)});
  function draw(){g.innerHTML='';g.scrollTop=0;
    for(const p of DEX){if(p.gen!==dexRegion)continue;
      const has=CAUGHT.has(p.id);
      const c=h('button','dexc'+(has?'':' lock')+(p.id===S.buddy?' buddy':''));
      c.append(pic(p,{art:true,calm:true,lazy:true}),h('b',null,has?p.n:'???'),h('small',null,'#'+String(p.id).padStart(4,'0')));
      c.onclick=()=>{if(!has){sfx.soft();speak(pick(['Pokémon ini masih misterius. Ayo main untuk menemukannya!','Siapa ya ini? Main lagi untuk bertemu dengannya!']));return}sfx.pop();detail(p)};
      g.append(c)}}
  draw();
  say(`Kamu punya ${CAUGHT.size} dari ${DEX.length} Pokémon! Ketuk Pokémon untuk melihatnya bergerak.`);
}
function detail(p){
  const o=h('div','party'),b=h('div','box');const pp=pic(p);
  const types=p.ty.map(t=>`<span>${TYPE_EMO[t]} ${TYPE_ID[t]}</span>`).join('');
  b.append(h('h2',null,p.n),pp,h('div','tagrow',`${types}<span>🗺️ ${REGION[p.gen-1]}</span><span>#${String(p.id).padStart(4,'0')}</span>`));
  const row=h('div','row');
  const bud=h('button','bigbtn',p.id===S.buddy?'💛 Temanku':'💛 Jadikan teman');
  bud.onclick=()=>{S.buddy=p.id;save();act(pp,'spin');sfx.good();speak(`Asyik! ${p.n} sekarang jadi teman bermainmu!`);bud.textContent='💛 Temanku';document.querySelectorAll('.dexc.buddy').forEach(x=>x.classList.remove('buddy'))};
  const cl=h('button','bigbtn alt','Tutup');cl.onclick=()=>o.remove();
  row.append(bud,cl);b.append(row);o.append(b);o.onclick=e=>{if(e.target===o)o.remove()};document.body.append(o);
  pp.onclick=()=>{act(pp,pick(['hop','spin','dance','wiggle']));sfx.boing()};
  const leg=p.leg?' Ini Pokémon legendaris!':'';
  speak(`Ini ${p.n}! Pokémon ${p.ty.map(t=>TYPE_ID[t]).join(' dan ')} dari ${REGION[p.gen-1]}.${leg}`);
  setTimeout(()=>act(pp,'hop'),300);
}

/* ================= pengaturan suara ================= */
function settings(){
  loadVoices();
  const o=h('div','party'),b=h('div','box help');
  b.append(h('h2',null,'⚙️ Suara narator'));
  const f1=h('label','field','Suara');const sel=h('select');sel.id='voiceSel';
  if(!NAR.list.length)sel.append(new Option('Suara bawaan perangkat',''));
  NAR.list.forEach(v=>sel.append(new Option(`${v.name} (${v.lang})`,v.name)));sel.value=NAR.voice?NAR.voice.name:'';f1.append(sel);
  const f2=h('label','field','Kecepatan bicara');const rg=h('input');rg.id='rateSel';rg.type='range';rg.min='.7';rg.max='1.3';rg.step='.05';rg.value=S.rate||1;f2.append(rg);
  const tip=h('p',null,NAR.list.length?'Pilih suara yang paling enak didengar. Suara bertanda Enhanced, Premium, atau Google biasanya paling luwes.':'Belum ada suara bahasa Indonesia di perangkat ini. Di iPhone: Pengaturan → Aksesibilitas → Konten Lisan → Suara → Indonesia, unduh Damayanti (Ditingkatkan). Di Android: pasang Speech Services by Google dan unduh bahasa Indonesia.');
  const row=h('div','row');const test=h('button','bigbtn alt','▶ Coba');const ok=h('button','bigbtn','Simpan');
  const apply=()=>{S.voice=sel.value;S.rate=+rg.value;save();loadVoices()};
  test.onclick=()=>{apply();speak('Halo, Pelatih Cilik! Ayo bermain bersama Pikachu dan teman-teman!')};
  ok.onclick=()=>{apply();o.remove()};
  row.append(test,ok);b.append(f1,f2,tip,row);o.append(b);o.onclick=e=>{if(e.target===o)o.remove()};document.body.append(o);
}

/* ================= pasang aplikasi ================= */
let installEvt=null;
function standalone(){return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e});
addEventListener('appinstalled',()=>{installEvt=null;document.querySelectorAll('.pbtn').forEach(b=>{if(b.textContent.includes('Pasang'))b.remove()})});
async function installApp(){
  sfx.pop();
  if(installEvt){installEvt.prompt();const r=await installEvt.userChoice.catch(()=>null);installEvt=null;if(r&&r.outcome==='accepted')return}
  const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),android=/Android/.test(ua);
  const steps=ios?['Buka halaman ini di <b>Safari</b>.','Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas ⬆️).','Gulir ke bawah, pilih <b>Tambah ke Layar Utama</b>.','Ketuk <b>Tambah</b>. Ikon Squirtle muncul di layar utama.']
    :android?['Buka halaman ini di <b>Chrome</b>.','Ketuk menu <b>⋮</b> di pojok kanan atas.','Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.','Ketuk <b>Instal</b>. Ikon Squirtle muncul di daftar aplikasi.']
    :['Di Chrome atau Edge, klik ikon <b>Instal</b> di ujung kanan kolom alamat.','Di HP, buka alamat halaman ini lalu ketuk tombol <b>📲 Pasang di HP</b>.'];
  const o=h('div','party'),b=h('div','box help');
  b.append(h('h2',null,'📲 Pasang di '+(ios?'iPhone':android?'Android':'perangkat ini')));
  const ol=h('ol','guide');steps.forEach(t=>ol.append(h('li',null,t)));b.append(ol);
  b.append(h('p',null,'Setelah dipasang, game terbuka layar penuh. Permainan tetap bisa dimainkan tanpa internet; Pokémon yang pernah tampil juga tersimpan.'));
  const ok=h('button','bigbtn','Oke');ok.onclick=()=>o.remove();b.append(ok);
  o.append(b);o.onclick=e=>{if(e.target===o)o.remove()};document.body.append(o);ok.focus();
}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

/* ================= tombol atas ================= */
$('#homeBtn').onclick=()=>{sfx.pop();home()};
$('#dexBtn').onclick=()=>{sfx.pop();dex()};
$('#stars').onclick=()=>{sfx.pop();speak(`Kamu punya ${S.stars} bintang!`)};
const sndUI=()=>{$('#sndBtn').textContent=S.sound?'🔊':'🔇';$('#sndBtn').setAttribute('aria-label',S.sound?'Matikan suara':'Nyalakan suara')};
$('#sndBtn').onclick=()=>{S.sound=!S.sound;save();sndUI();if(S.sound)sfx.pop();else try{speechSynthesis.cancel()}catch(e){}};
sndUI();$('#starN').textContent=S.stars;

if(!RM){for(let i=0;i<10;i++){const b=h('div','deco-bub');const s=rnd(10,34);b.style.width=b.style.height=s+'px';b.style.left=rnd(0,100)+'vw';b.style.animationDuration=rnd(9,18)+'s';b.style.animationDelay=-rnd(0,18)+'s';document.body.append(b)}}
home();
window.__game={open,home,dex,GAMES,S};
})();
