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

/* ================= simpanan (khusus perangkat ini) ================= */
// Semua progres disimpan di browser perangkat ini saja: setiap HP/tablet punya data sendiri.
const KEY='petualangan-laut-v1';
const DEF={stars:0,caught:[25,7,1,4],sound:true,music:true,mvol:.5,buddy:7,voice:'',rate:1,lv:{},lang:'id'};
const S=Object.assign({},DEF,{lv:{}});
try{Object.assign(S,JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){}
if(!S.lv||typeof S.lv!=='object')S.lv={};if(S.lang!=='en')S.lang='id';
let CAUGHT=new Set(S.caught);
const save=()=>{S.caught=[...CAUGHT];try{localStorage.setItem(KEY,JSON.stringify({stars:S.stars,caught:S.caught,sound:S.sound,music:S.music,mvol:S.mvol,buddy:S.buddy,voice:S.voice,rate:S.rate,lv:S.lv,lang:S.lang}))}catch(e){}};
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}

/* ================= bahasa ================= */
const LINES=window.LINES||{},WORDS=window.WORDS||{};
const UI={
 title:['Petualangan Laut','Ocean Adventure'],
 hello:['Halo, Pelatih Cilik!<br>Mau main apa hari ini?','Hi, little Trainer!<br>What shall we play today?'],
 dex:['Koleksiku','My Collection'],
 ofm:['{n} dari {m} Pokémon','{n} of {m} Pokémon'],
 install:['📲 Pasang di HP','📲 Install on phone'],
 settings:['⚙️ Pengaturan','⚙️ Settings'],
 langBtn:['🌐 English','🌐 Bahasa Indonesia'],
 musicOn:['🎵 Musik: nyala','🎵 Music: on'],musicOff:['🎵 Musik: mati','🎵 Music: off'],
 foot:['Untuk orang tua: semua petunjuk dibacakan, jadi si kecil tidak perlu bisa membaca. Setiap permainan punya 5 level yang naik sendiri saat satu babak selesai. Data permainan tersimpan di perangkat ini saja, jadi setiap HP atau tablet punya bintang, level, dan koleksinya sendiri.',
       'For parents: every instruction is read aloud, so your child does not need to read. Each game has 5 levels that go up after each finished round. Progress is saved on this device only, so every phone or tablet keeps its own stars, levels, and collection.'],
 party:[['Hebat!','Hore!','Keren!','Yeay!'],['Great!','Hooray!','Awesome!','Yay!']],
 lvUp:['Naik ke Level {n}!','Level {n} unlocked!'],lvTop:['Level tertinggi!','Top level!'],
 again:['🔁 Main lagi','🔁 Play again'],goHome:['🏠 Pulang','🏠 Home'],
 eggNext:['🥚 Telur berikutnya','🥚 Next egg'],newTag:['Baru!','New!'],
 makeBuddy:['💛 Jadikan teman','💛 Make my buddy'],myBuddy:['💛 Temanku','💛 My buddy'],close:['Tutup','Close'],
 setTitle:['⚙️ Pengaturan','⚙️ Settings'],lang:['Bahasa narator','Narrator language'],music:['Musik','Music'],mvol:['Volume musik','Music volume'],
 deviceNote:['Data permainan tersimpan di perangkat ini saja. Setiap HP atau tablet punya bintang, level, dan koleksinya sendiri, tidak tercampur.','Progress is saved on this device only. Each phone or tablet keeps its own stars, levels, and collection.'],
 erase:['🗑️ Hapus data perangkat ini','🗑️ Erase data on this device'],
 eraseAsk:['Yakin? Semua bintang, level, dan koleksi di perangkat ini akan dihapus.','Are you sure? All stars, levels, and the collection on this device will be erased.'],
 eraseYes:['Ya, hapus','Yes, erase'],cancel:['Batal','Cancel'],save:['Simpan','Save'],test:['▶ Coba suara','▶ Test voice'],
 on:['Nyala','On'],off:['Mati','Off'],
 installTitle:['📲 Pasang di {d}','📲 Install on {d}'],other:['perangkat ini','this device'],
 iosSteps:[['Buka halaman ini di <b>Safari</b>.','Ketuk tombol <b>Bagikan</b> (kotak dengan panah ke atas ⬆️).','Gulir ke bawah, pilih <b>Tambah ke Layar Utama</b>.','Ketuk <b>Tambah</b>. Ikon Lugia muncul di layar utama.'],
           ['Open this page in <b>Safari</b>.','Tap the <b>Share</b> button (square with an up arrow ⬆️).','Scroll down and choose <b>Add to Home Screen</b>.','Tap <b>Add</b>. The Lugia icon appears on your home screen.']],
 andSteps:[['Buka halaman ini di <b>Chrome</b>.','Ketuk menu <b>⋮</b> di pojok kanan atas.','Pilih <b>Instal aplikasi</b> atau <b>Tambahkan ke layar utama</b>.','Ketuk <b>Instal</b>. Ikon Lugia muncul di daftar aplikasi.'],
           ['Open this page in <b>Chrome</b>.','Tap the <b>⋮</b> menu in the top right.','Choose <b>Install app</b> or <b>Add to Home screen</b>.','Tap <b>Install</b>. The Lugia icon appears in your apps.']],
 pcSteps:[['Di Chrome atau Edge, klik ikon <b>Instal</b> di ujung kanan kolom alamat.','Di HP, buka alamat halaman ini lalu ketuk tombol <b>📲 Pasang di HP</b>.'],
          ['In Chrome or Edge, click the <b>Install</b> icon at the right end of the address bar.','On a phone, open this page and tap <b>📲 Install on phone</b>.']],
 installNote:['Setelah dipasang, game terbuka layar penuh dan tetap bisa dimainkan tanpa internet.','Once installed, the game opens full screen and works without internet.'],
 ok:['Oke','OK']
};
const L=()=>S.lang==='en'?1:0;
const tx=(k,v={})=>{let s=UI[k][L()];if(typeof s==='string')s=s.replace(/\{(\w)\}/g,(_,x)=>v[x]!=null?v[x]:'');return s};
const FRUIT_EMO=['🍓','🫐','🍎','🍇','🍑','🍌','🍉','🍒'];
const GAMETXT={
 renang:[['Ayo Berenang','Kumpulkan bintang di laut'],["Let's Swim",'Collect stars in the sea']],
 mancing:[['Mancing Pokémon','Tunggu pelampung bergoyang'],['Pokémon Fishing','Wait for the float to wiggle']],
 telur:[['Telur Menetas','Ketuk-ketuk telurnya'],['Egg Hatching','Tap the egg']],
 evolusi:[['Kasih Makan','Beri buah, lihat evolusi'],['Feeding Time','Feed fruit, watch it evolve']],
 lari:[['Lari Dino','Lompati batu'],['Dino Run','Jump over rocks']],
 fosil:[['Gali Fosil','Gosok pasir, temukan dino'],['Fossil Dig','Rub the sand, find a dino']],
 tangkap:[['Tangkap Buah','Geser untuk menangkap'],['Fruit Catch','Slide to catch']],
 ciluk:[['Ciluk Ba!','Sapa yang muncul'],['Peekaboo!','Greet who pops up']],
 bayangan:[['Siapa Itu?','Tebak bayangan'],["Who's That?",'Guess the shadow']],
 hitung:[['Ayo Berhitung','Ada berapa?'],["Let's Count",'How many?']],
 besar:[['Besar Kecil','Mana yang paling besar?'],['Big & Small','Which is biggest?']],
 pola:[['Tebak Pola','Apa yang berikutnya?'],['Patterns','What comes next?']],
 urutan:[['Urutan Evolusi','Dari kecil ke besar'],['Evolution Order','From first to last']],
 huruf:[['Huruf Awal','Kenali huruf'],['First Letters','Learn letters']],
 kartu:[['Kartu Kembar','Cari pasangannya'],['Memory Match','Find the pairs']],
 puzzle:[['Puzzle','Susun potongannya'],['Puzzle','Put the pieces together']],
 irama:[['Ikuti Irama','Tiru nyanyiannya'],['Follow the Song','Copy the song']],
 labirin:[['Labirin','Antar pulang'],['Maze','Lead the way home']],
 gelembung:[['Pecah Gelembung','Cari warna yang benar'],['Bubble Pop','Find the right color']]
};

/* ================= Pokédex ================= */
const TYPE_EMO={1:'⭐',2:'🥊',3:'🪶',4:'🟣',5:'⛰️',6:'🪨',7:'🐛',8:'👻',9:'⚙️',10:'🔥',11:'💧',12:'🌿',13:'⚡',14:'🔮',15:'❄️',16:'🐉',17:'🌙',18:'🧚'};
const REGION=WORDS.r||['Kanto','Johto','Hoenn','Sinnoh','Unova','Kalos','Alola','Galar','Paldea'];
const typeName=t=>(WORDS.t&&WORDS.t[S.lang]&&WORDS.t[S.lang][t])||'';
const DEX=(window.DEXDATA||[]).map(([id,n,gen,ty,from,chain,baby,leg])=>({id,n,gen,ty,from,chain,baby,leg,e:TYPE_EMO[ty[0]]||'⭐'}));
const BY=new Map(DEX.map(p=>[p.id,p]));
const byId=id=>BY.get(id)||BY.get(25)||DEX[0];
const KIDS=new Map();DEX.forEach(p=>{if(p.from){if(!KIDS.has(p.from))KIDS.set(p.from,[]);KIDS.get(p.from).push(p.id)}});
const FOSSIL=[138,140,142,345,347,408,410,564,566,696,698,880,881,882,883];
const POOL={
  all:DEX,
  laut:DEX.filter(p=>p.ty.includes(11)),
  dino:DEX.filter(p=>p.ty.includes(16)||FOSSIL.includes(p.id)),
  base:DEX.filter(p=>!p.from&&!p.leg),
  evo:DEX.filter(p=>!p.from&&KIDS.has(p.id))
};
function chainFrom(p){const c=[p];let cur=p;while(KIDS.has(cur.id)){cur=byId(pick(KIDS.get(cur.id)));c.push(cur)}return c}
function randomChain(min=2){for(let i=0;i<60;i++){const c=chainFrom(pick(POOL.evo));if(c.length>=min)return c}return chainFrom(byId(7))}

/* ================= gambar Pokémon (HD) =================
   Gambar resmi resolusi tinggi. Gerakan dibuat halus dengan animasi transform (60 fps). */
const ART=id=>`img/${id}.webp`,HD=id=>`hd/${id}.webp`;
function pic(p,o={}){
  const w=h('div','pic');if(o.s)w.style.setProperty('--s',o.s);
  const bod=h('div','bod');w.append(bod);
  w.classList.add(o.calm?'calm':'still');
  if(!o.calm&&!RM)bod.style.animationDelay=(-Math.random()*3).toFixed(2)+'s';
  const im=new Image();im.alt=p.n;im.draggable=false;im.decoding='async';if(o.lazy)im.loading='lazy';
  let hd=!!o.big;
  im.onerror=()=>{if(hd){hd=false;im.src=ART(p.id)}else{bod.innerHTML='';bod.append(h('span','emo',p.e))}};
  im.onload=()=>{if(hd)return;const shown=w.clientWidth*(window.devicePixelRatio||1);if(shown>230){hd=true;const x=new Image();x.onload=()=>{im.src=x.src};x.src=HD(p.id)}};
  im.src=hd?HD(p.id):ART(p.id);bod.append(im);w.p=p;return w;
}
const MOVES={
  hop:[{transform:'none'},{transform:'translateY(0) scale(1.14,.86)',offset:.15},{transform:'translateY(-30%) scale(.92,1.1)',offset:.45},{transform:'translateY(0) scale(1.1,.9)',offset:.78},{transform:'none'}],
  spin:[{transform:'none'},{transform:'translateY(-22%) rotate(180deg) scale(1.08)',offset:.5},{transform:'translateY(0) rotate(360deg)'}],
  wiggle:[{transform:'none'},{transform:'rotate(-12deg)'},{transform:'rotate(12deg)'},{transform:'rotate(-8deg)'},{transform:'rotate(6deg)'},{transform:'none'}],
  chomp:[{transform:'none'},{transform:'scale(1.12,.84)',offset:.25},{transform:'scale(.94,1.1)',offset:.55},{transform:'scale(1.06,.95)',offset:.8},{transform:'none'}],
  sad:[{transform:'none'},{transform:'translateY(5%) scale(1.05,.92) rotate(-6deg)',offset:.4},{transform:'translateY(5%) scale(1.05,.92) rotate(6deg)',offset:.7},{transform:'none'}],
  dance:[{transform:'none'},{transform:'translateY(-12%) rotate(-10deg)'},{transform:'translateY(0) rotate(0)'},{transform:'translateY(-12%) rotate(10deg)'},{transform:'none'}],
  look:[{transform:'none'},{transform:'rotate(-6deg) translateX(-4%)',offset:.3},{transform:'rotate(5deg) translateX(4%)',offset:.7},{transform:'none'}]
};
function act(el,kind='hop',dur){if(!el||RM)return;const b=el.classList&&el.classList.contains('bod')?el:el.querySelector('.bod');if(!b)return;
  try{b.animate(MOVES[kind],{duration:dur||({hop:650,spin:800,wiggle:600,chomp:420,sad:700,dance:900,look:1200}[kind]),easing:'cubic-bezier(.3,.7,.4,1)'})}catch(e){}}
// sesekali Pokémon di layar bergerak sendiri supaya terasa hidup
if(!RM)setInterval(()=>{if(document.hidden)return;const all=[...document.querySelectorAll('#stage .pic.still')].filter(x=>x.offsetParent);if(!all.length)return;
  for(let i=0;i<Math.min(2,all.length);i++)act(pick(all),pick(['hop','look','wiggle','dance']))},2200);

/* ================= audio: satu AudioContext untuk efek, narator, dan musik ================= */
let AC=null,MASTER,SFX,VOX,MUSG;
function ac(){
  if(!AC){AC=new(window.AudioContext||window.webkitAudioContext)();MASTER=AC.createGain();MASTER.connect(AC.destination);
    SFX=AC.createGain();SFX.gain.value=.9;SFX.connect(MASTER);VOX=AC.createGain();VOX.gain.value=1;VOX.connect(MASTER);
    MUSG=AC.createGain();MUSG.gain.value=0;MUSG.connect(MASTER)}
  if(AC.state==='suspended')AC.resume().catch(()=>{});return AC;
}
addEventListener('pointerdown',()=>{try{ac();if(S.music&&S.sound)Music.start()}catch(e){}},{capture:true});
document.addEventListener('visibilitychange',()=>{if(!AC)return;if(document.hidden)AC.suspend().catch(()=>{});else AC.resume().catch(()=>{})});
function tone(f,d=.15,type='sine',vol=.18,when=0,slide=0){
  if(!S.sound)return;
  try{const c=ac(),t=c.currentTime+when,o=c.createOscillator(),g=c.createGain();
    o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(slide,t+d);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+d);
    o.connect(g).connect(SFX);o.start(t);o.stop(t+d+.03)}catch(e){}
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

/* ================= musik tema "Ombak Pelangi" =================
   Disintesis langsung: marimba untuk melodi, bas petik, pad lembut, dan perkusi shaker. */
const Music=(()=>{
  const BPM=112,E=60/BPM/2;
  const N=s=>{const m=/^([A-G])(#?)(\d)$/.exec(s);return 12*(+m[3]+1)+{C:0,D:2,E:4,F:5,G:7,A:9,B:11}[m[1]]+(m[2]?1:0)};
  const LEAD=[
    'G4 C5 E5 G5 - E5 G5 A5','G5 - E5 C5 - A4 C5 E5','F5 - E5 D5 C5 - A4 C5','D5 - - B4 G4 - - .',
    'G4 C5 E5 G5 - E5 G5 A5','C6 - A5 G5 - E5 G5 A5','F5 E5 D5 - A5 G5 F5 D5','C5 - - - . . G4 B4',
    'A4 C5 F5 - A5 - G5 F5','G5 - D5 - B4 D5 G5 .','E5 G5 B5 - G5 E5 D5 E5','C5 - E5 A5 - G5 E5 C5',
    'F5 - A5 - C6 - A5 F5','G5 - B5 - D6 - B5 G5','E6 - D6 C6 - G5 E5 G5','C6 - - - . . . .'
  ].map(b=>b.split(' ').map(x=>x==='-'||x==='.'?0:N(x)));
  const CH='C Am F G C Am Dm G F G Em Am F G C C'.split(' ');
  const CHORD={C:[60,64,67],Am:[57,60,64],F:[53,57,60],G:[55,59,62],Dm:[50,53,57],Em:[52,55,59]};
  const ROOT={C:36,Am:45,F:41,G:43,Dm:38,Em:40};
  const hz=m=>440*Math.pow(2,(m-69)/12);
  let timer=0,step=0,next=0,playing=false,noise=null,leadVol=1,ducked=false;
  function noiseBuf(c){if(noise)return noise;const b=c.createBuffer(1,c.sampleRate*.2,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return noise=b}
  function env(c,t,a,peak,dec){const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);g.connect(MUSG);return g}
  function marimba(c,t,m,v){const f=hz(m);const g=env(c,t,.004,.32*v,.55);const o=c.createOscillator();o.type='sine';o.frequency.value=f;o.connect(g);
    const g2=env(c,t,.002,.08*v,.09);const o2=c.createOscillator();o2.type='sine';o2.frequency.value=f*4.02;o2.connect(g2);
    const g3=env(c,t,.003,.06*v,.25);const o3=c.createOscillator();o3.type='triangle';o3.frequency.value=f*2;o3.connect(g3);
    [o,o2,o3].forEach(x=>{x.start(t);x.stop(t+.7)})}
  function bass(c,t,m){const g=env(c,t,.006,.28,.3);const o=c.createOscillator();o.type='triangle';o.frequency.value=hz(m);
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;o.connect(lp).connect(g);o.start(t);o.stop(t+.4)}
  function pad(c,t,ms,dur){ms.forEach(m=>[-5,5].forEach(dt=>{const o=c.createOscillator();o.type='triangle';o.frequency.value=hz(m);o.detune.value=dt;
    const g=c.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.022,t+.25);g.gain.setValueAtTime(.022,t+dur-.2);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1600;o.connect(lp).connect(g).connect(MUSG);o.start(t);o.stop(t+dur+.05)}))}
  function hit(c,t,type,v){const s=c.createBufferSource();s.buffer=noiseBuf(c);const f=c.createBiquadFilter();
    if(type==='shk'){f.type='highpass';f.frequency.value=7000}else{f.type='bandpass';f.frequency.value=1800;f.Q.value=.8}
    const g=env(c,t,.002,v,type==='shk'?.045:.09);s.connect(f).connect(g);s.start(t);s.stop(t+.15)}
  function kick(c,t){const o=c.createOscillator(),g=env(c,t,.003,.35,.18);o.frequency.setValueAtTime(130,t);o.frequency.exponentialRampToValueAtTime(45,t+.14);o.connect(g);o.start(t);o.stop(t+.25)}
  function bubble(c,t){const o=c.createOscillator(),g=env(c,t,.005,.07,.12);o.frequency.setValueAtTime(500,t);o.frequency.exponentialRampToValueAtTime(1400,t+.12);o.connect(g);o.start(t);o.stop(t+.2)}
  function play(i,t){const c=AC,bar=i>>3,s=i&7,ch=CH[bar];
    const m=LEAD[bar][s];if(m)marimba(c,t,m,leadVol);
    if(s===0)pad(c,t,CHORD[ch],8*E);
    const r=ROOT[ch];if(s===0||s===4)bass(c,t,r);if(s===3)bass(c,t,r+7);if(s===6)bass(c,t,r+12);
    if(s===0||s===4)kick(c,t);if(s===2||s===6)hit(c,t,'snp',.09);hit(c,t,'shk',s%2?.035:.02);
    if(bar===15&&s>=4)bubble(c,t+E*.5)}
  function sched(){if(!AC)return;while(next<AC.currentTime+.2){play(step,next);next+=E;step=(step+1)%128}}
  function level(){if(!MUSG)return;const v=(S.music&&S.sound?S.mvol*.55:0)*(ducked?.35:1);MUSG.gain.setTargetAtTime(v,AC.currentTime,.25)}
  return{
    start(){if(playing||!S.music||!S.sound)return;const c=ac();playing=true;next=c.currentTime+.15;timer=setInterval(sched,30);level()},
    stop(){playing=false;clearInterval(timer);if(MUSG)MUSG.gain.setTargetAtTime(0,AC.currentTime,.1)},
    mode(home){leadVol=home?1:.6},
    duck(on){ducked=on;level()},
    level
  };
})();

/* ================= narator: rekaman suara neural, cadangan suara perangkat ================= */
const VO={idx:{},load:{},buf:new Map(),tok:0,src:[]};
const segKey=s=>{s=s.replace(/^[\s,.!?;:]+/,'').trim();return /[0-9A-Za-zÀ-ÿ]/.test(s)?'s:'+s.toLowerCase():''};
function loadIdx(lang){return VO.load[lang]||(VO.load[lang]=fetch(`audio/${lang}/index.json`).then(r=>r.ok?r.json():{}).catch(()=>({})).then(j=>VO.idx[lang]=j))}
function getBuf(lang,key){const f=VO.idx[lang]&&VO.idx[lang][key];if(!f)return Promise.resolve(null);const id=lang+'/'+f;
  if(!VO.buf.has(id))VO.buf.set(id,fetch(`audio/${lang}/${f}`).then(r=>{if(!r.ok)throw 0;return r.arrayBuffer()}).then(b=>new Promise((res,rej)=>ac().decodeAudioData(b,res,rej))).catch(()=>{VO.buf.delete(id);return null}));
  return VO.buf.get(id)}
loadIdx(S.lang);
// isi variabel: tampilan teks + kunci rekaman
function fill(tpl,v){
  const parts=[],keys=[];let text='';
  tpl.split(/(\{[a-zA-Z]\})/).forEach(seg=>{
    const m=/^\{([a-zA-Z])\}$/.exec(seg);
    if(!m){if(!seg)return;text+=seg;const k=segKey(seg);if(k)keys.push({k,end:/[.!?]\s*$/.test(seg)?.22:/,\s*$/.test(seg)?.1:.03});return}
    const x=m[1],val=v[x];let show='',k='';
    if(x==='p'||x==='q'){show=val.n;k='p:'+val.id}
    else if(x==='n'||x==='m'){show=String(val);k=val<=300?'n:'+val:''}
    else if(x==='c'||x==='d'){show=WORDS.c[S.lang][val];k='c:'+val}
    else if(x==='f'){show=WORDS.f[S.lang][val]+' '+FRUIT_EMO[val];k='f:'+val}
    else if(x==='s'){show=WORDS.s[S.lang][val];k='s2:'+val}
    else if(x==='t'){show=typeName(val);k='t:'+val}
    else if(x==='r'){show=REGION[val];k='r:'+val}
    else if(x==='L'||x==='M'){show=val;k='L:'+val}
    text+=show;keys.push({k,end:.03});
  });
  return{text,keys};
}
// say('kunci',{vars}, 'kunci2', ...) — {show:false} di awal untuk tidak mengubah balon teks
function compose(args){
  let show=true;if(args[0]&&typeof args[0]==='object'&&!Array.isArray(args[0])&&'show' in args[0]){show=args[0].show;args=args.slice(1)}
  let text='',keys=[];
  for(let i=0;i<args.length;i++){const key=args[i];let v={};if(args[i+1]&&typeof args[i+1]==='object'&&!Array.isArray(args[i+1])){v=args[i+1];i++}
    const L=LINES[key];if(!L)continue;const r=fill(pick(L[S.lang]),v);text+=(text?' ':'')+r.text;if(keys.length)keys[keys.length-1].end=Math.max(keys[keys.length-1].end,.2);keys.push(...r.keys)}
  return{show,text,keys};
}
function say(...args){const c=compose(args);if(c.show){lastSaid=c;const b=$('.say');if(b){b.textContent=c.text;b.classList.remove('talk');void b.offsetWidth;b.classList.add('talk')}}voice(c);return c}
const speak=(...a)=>say({show:false},...a);
function talk(on){const m=$('.mascot');if(m)m.classList.toggle('talking',on)}
function stopVoice(){VO.tok++;VO.src.forEach(s=>{try{s.stop()}catch(e){}});VO.src=[];try{speechSynthesis.cancel()}catch(e){}talk(false);Music.duck(false)}
async function voice(c){
  if(!S.sound)return;stopVoice();const tok=VO.tok,lang=S.lang;
  await loadIdx(lang);
  const bufs=await Promise.all(c.keys.map(x=>x.k?getBuf(lang,x.k):Promise.resolve(null)));
  if(tok!==VO.tok)return;
  if(!c.keys.length||bufs.some(b=>!b))return deviceVoice(c.text,tok);
  const a=ac();let t=a.currentTime+.04;talk(true);Music.duck(true);
  bufs.forEach((b,i)=>{const s=a.createBufferSource();s.buffer=b;s.connect(VOX);s.start(t);VO.src.push(s);t+=b.duration+(i<bufs.length-1?c.keys[i].end:0);
    if(i===bufs.length-1)s.onended=()=>{if(tok===VO.tok){talk(false);Music.duck(false)}}});
}
function deviceVoice(text,tok){
  if(!('speechSynthesis' in window))return;
  try{const vs=speechSynthesis.getVoices(),want=S.lang==='en'?/^en/i:/^id|^ms/i;const v=vs.find(x=>want.test(x.lang));
    String(text).replace(/Pokémon/g,'Pokemon').split(/(?<=[.!?])\s+/).filter(Boolean).forEach((s,i,arr)=>{const u=new SpeechSynthesisUtterance(s);u.lang=S.lang==='en'?'en-US':'id-ID';if(v)u.voice=v;u.rate=.98;u.pitch=1.1;
      if(i===0)u.onstart=()=>{talk(true);Music.duck(true)};if(i===arr.length-1)u.onend=()=>{if(tok===VO.tok){talk(false);Music.duck(false)}};speechSynthesis.speak(u)})}catch(e){}
}

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
// yay(elemen|[x,y], ...argumen narator)
function yay(at,...lines){
  const [x,y]=Array.isArray(at)?at:center(at);
  sfx.good();burst(x,y);flyStar(x,y);mascot('yay');if(lines.length)say(...lines);
}
function oops(el,...lines){sfx.soft();if(el){el.classList.remove('nope');void el.offsetWidth;el.classList.add('nope')}mascot('hmm');say(...(lines.length?lines:['try']))}
let unlockDue=0;
function addStar(n=1){
  for(let i=0;i<n;i++){S.stars++;if(S.stars%5===0)unlockDue++}
  save();$('#starN').textContent=S.stars;
  const c=$('#stars');c.classList.remove('bump');void c.offsetWidth;c.classList.add('bump');
  if(unlockDue>0){unlockDue--;setTimeout(()=>{const left=DEX.filter(p=>!CAUGHT.has(p.id));if(left.length){const p=pick(left);gain(p);speak('gift',{p})}},900)}
}
function gain(p){
  const fresh=!CAUGHT.has(p.id);
  if(fresh){CAUGHT.add(p.id);save();flyToDex(p,tx('newTag'))}
  return fresh;
}
function flyToDex(p,label){
  const d=$('#dexBtn').getBoundingClientRect(),tx2=d.left+d.width/2,ty=d.top+d.height/2;
  if(RM){bumpDex();return}
  const f=h('div','fx catchfly');f.append(pic(p,{s:'72px',calm:true}));if(label)f.append(h('span','newtag',label));document.body.append(f);
  const sx=innerWidth/2,sy=innerHeight*.45;
  f.animate([{transform:`translate(${sx}px,${sy}px) translate(-50%,-50%) scale(.2)`,opacity:0},{transform:`translate(${sx}px,${sy-40}px) translate(-50%,-50%) scale(1.3)`,opacity:1,offset:.25},{transform:`translate(${sx}px,${sy-50}px) translate(-50%,-50%) scale(1.2)`,opacity:1,offset:.5},{transform:`translate(${tx2}px,${ty}px) translate(-50%,-50%) scale(.3)`,opacity:.7}],{duration:1500,easing:'ease-in-out'}).onfinish=()=>{f.remove();bumpDex()};
}
function bumpDex(){const b=$('#dexBtn');b.classList.remove('bump2');void b.offsetWidth;b.classList.add('bump2')}

/* ================= lingkup permainan ================= */
function scope(){
  const Ls=[],T=[],I=[],R=[];let raf=0,alive=true;
  return{
    get alive(){return alive},
    on(t,e,f,o){t.addEventListener(e,f,o);Ls.push([t,e,f,o])},
    later(f,ms){const id=setTimeout(()=>alive&&f(),ms);T.push(id);return id},
    every(f,ms){I.push(setInterval(()=>alive&&f(),ms))},
    resize(el,f){const r=new ResizeObserver(()=>alive&&f());r.observe(el);R.push(r)},
    loop(f){let last=performance.now();const step=now=>{if(!alive)return;const dt=Math.min(.05,(now-last)/1000);last=now;f(dt,now/1000);raf=requestAnimationFrame(step)};raf=requestAnimationFrame(step)},
    stop(){alive=false;Ls.forEach(([t,e,f,o])=>t.removeEventListener(e,f,o));T.forEach(clearTimeout);I.forEach(clearInterval);R.forEach(r=>r.disconnect());cancelAnimationFrame(raf)}
  };
}

/* ================= daftar permainan ================= */
const MAXLV=5;
const GAMES={
 renang:{p:7,icon:'🏊',c:'#2fa6e0',run:swim},
 mancing:{p:129,icon:'🎣',c:'#1c86c9',run:fishing},
 telur:{p:175,icon:'🥚',c:'#f29bc0',run:egg},
 evolusi:{p:133,icon:'🍓',c:'#ff6f61',run:feed},
 lari:{p:4,icon:'🦖',c:'#e8912e',run:runner},
 fosil:{p:142,icon:'🦴',c:'#c98a2e',run:fossil},
 tangkap:{p:143,icon:'🧺',c:'#34c27a',run:catcher},
 ciluk:{p:50,icon:'🌊',c:'#3fb3e8',run:peek},
 bayangan:{p:150,icon:'🔍',c:'#8a5cf6',run:shadow},
 hitung:{p:172,icon:'🔢',c:'#ff8a3d',run:count},
 besar:{p:321,icon:'📏',c:'#16a3a3',run:sizes},
 pola:{p:778,icon:'🧩',c:'#d14fa6',run:pattern},
 urutan:{p:147,icon:'🪜',c:'#5a7cf0',run:order},
 huruf:{p:201,icon:'🔤',c:'#7b58d6',run:letters},
 kartu:{p:151,icon:'🃏',c:'#ffb000',run:memory},
 puzzle:{p:132,icon:'🧩',c:'#4caf50',run:puzzle},
 irama:{p:39,icon:'🎵',c:'#e0489b',run:simon},
 labirin:{p:393,icon:'🧭',c:'#2b9e6b',run:maze},
 gelembung:{p:54,icon:'🫧',c:'#e0489b',run:bubbles}
};
const gname=k=>GAMETXT[k][L()][0],gsub=k=>GAMETXT[k][L()][1];
let cur=null,curKey=null,curLv=1;
const stage=$('#stage');
const lvOf=k=>Math.max(1,Math.min(MAXLV,S.lv[k]||1));

function clear(){if(cur){cur.stop();cur=null}document.querySelectorAll('.party,.toast,.fx,.piece.drag').forEach(e=>e.remove());stopVoice();stage.innerHTML=''}

function home(){
  clear();curKey=null;Music.mode(true);$('#homeBtn').hidden=true;$('#ttl').textContent=tx('title');document.title=S.lang==='en'?'Pokémon Ocean Adventure':'Petualangan Laut Pokémon';
  const w=h('div','home');
  const hi=h('div','hello');
  const b1=pic(byId(S.buddy),{big:true}),b2=pic(byId(25),{big:true});
  hi.append(b1,h('p',null,tx('hello')),b2);
  b1.onclick=()=>{act(b1,'spin');sfx.boing();speak('greet',{p:byId(S.buddy)})};
  b2.onclick=()=>{act(b2,'hop');sfx.boing();speak('pika')};
  const tiles=h('div','tiles');
  let i=0;
  for(const [k,g] of Object.entries(GAMES)){
    const b=h('button','tile popin');b.style.animationDelay=(i++*35)+'ms';b.style.setProperty('--c',g.c);
    b.append(h('span','big',g.icon),pic(byId(g.p)),h('b',null,gname(k)),h('small',null,`${gsub(k)} · Level ${lvOf(k)}`));
    b.onclick=()=>{sfx.pop();open(k)};tiles.append(b);
  }
  const dx=h('button','tile dexy popin');dx.style.animationDelay=(i*35)+'ms';dx.style.setProperty('--c','#ffcf33');
  dx.append(h('span','big','📖'),pic(byId(25)),h('b',null,tx('dex')),h('small',null,tx('ofm',{n:CAUGHT.size,m:DEX.length})));
  dx.onclick=()=>{sfx.pop();dex()};tiles.append(dx);
  const par=h('div','parent');
  const lb=h('button','pbtn',tx('langBtn'));lb.onclick=()=>{S.lang=S.lang==='en'?'id':'en';save();loadIdx(S.lang);home();speak('greet',{p:byId(S.buddy)})};par.append(lb);
  const mb=h('button','pbtn',S.music?tx('musicOn'):tx('musicOff'));mb.onclick=()=>{S.music=!S.music;save();S.music?Music.start():Music.stop();Music.level();mb.textContent=S.music?tx('musicOn'):tx('musicOff')};par.append(mb);
  if(!standalone()){const ib=h('button','pbtn',tx('install'));ib.onclick=installApp;par.append(ib)}
  const vb=h('button','pbtn',tx('settings'));vb.onclick=settings;par.append(vb);
  w.append(hi,tiles,par,h('p','foot',tx('foot')));
  stage.append(w);
}

function open(k,lv){
  clear();curKey=k;const g=GAMES[k];curLv=lv||lvOf(k);Music.mode(false);
  $('#homeBtn').hidden=false;$('#ttl').textContent=gname(k);
  const row=h('div','sayrow'),m=h('button','mascot');m.setAttribute('aria-label','Ulangi petunjuk');
  m.append(pic(byId(S.buddy)),h('span','lvb','Level '+curLv));row.append(m,h('div','say'));stage.append(row);
  m.onclick=()=>{act(m,'hop');if(lastSaid)voice(lastSaid)};
  cur=scope();g.run(stage,cur,curLv);
}
let lastSaid=null;

function party(winLine,v,p){
  if(!cur)return;cur.stop();
  const k=curKey,old=curLv,up=old<MAXLV;
  if(up){S.lv[k]=Math.max(lvOf(k),old+1);save()}
  sfx.win();
  const o=h('div','party'),b=h('div','box');
  const c=compose([winLine,v||{},up?'lvup':'lvmax',up?{n:old+1}:{}]);
  const pp=pic(p||byId(S.buddy),{big:true});
  const first=compose([winLine,v||{}]);
  b.append(h('h2',null,pick(UI.party[L()])),pp,h('p',null,first.text),h('div','tagrow',`<span>⭐ ${up?tx('lvUp',{n:old+1}):tx('lvTop')}</span>`));
  const row=h('div','row');
  const again=h('button','bigbtn',up?`▶ Level ${old+1}`:tx('again'));again.onclick=()=>open(k,up?old+1:old);
  const back=h('button','bigbtn alt',tx('goHome'));back.onclick=home;
  row.append(again,back);b.append(row);o.append(b);document.body.append(o);
  voice(c);
  const iv=setInterval(()=>{if(!o.isConnected)return clearInterval(iv);act(pp,pick(['hop','spin','dance']))},1300);act(pp,'spin');
  if(!RM){const em=['⭐','🫧','💧','🐚','✨','🌊','🎉','💖'];
    for(let i=0;i<28;i++){const cf=h('span','conf',pick(em));cf.style.left=rnd(0,96)+'vw';cf.style.animationDuration=rnd(2.2,4)+'s';cf.style.animationDelay=rnd(0,.8)+'s';document.body.append(cf);setTimeout(()=>cf.remove(),5200)}}
  again.focus();
}

function arena(root,sc,cls,html=''){
  const a=h('div','arena '+cls,html);root.append(a);
  const A={el:a,W:a.clientWidth||300,H:a.clientHeight||300};
  sc.resize(a,()=>{A.W=a.clientWidth;A.H=a.clientHeight;A.onresize&&A.onresize()});
  A.local=e=>{const r=a.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
  A.page=(x,y)=>{const r=a.getBoundingClientRect();return[r.left+x,r.top+y]};
  return A;
}
function slots(parent,n){const s=h('div','slots');for(let i=0;i<n;i++)s.append(h('span','slot','⭐'));parent.append(s);let got=0;return{fill(){if(got<n)s.children[got].classList.add('got');got++;return got},get got(){return got}}}
const fresh2=(p,newKey,oldKey,v={})=>gain(p)?[newKey,{p,...v}]:[oldKey,{p,...v}];

/* ================= 1. Berenang ================= */
function swim(root,sc,lv){
  const A=arena(root,sc,'sea','<div class="weed w1"></div><div class="weed w2"></div><div class="weed w3"></div><div class="sandbed"></div>');
  const GOAL=6+lv*2,sl=slots(A.el,GOAL);
  const hs=()=>Math.max(70,Math.min(150,Math.min(A.W,A.H)*.22));
  const me=byId(S.buddy),hero=h('div','sprite hero'),hp=pic(me,{s:hs()+'px'});hero.append(hp);A.el.append(hero);
  A.onresize=()=>hp.style.setProperty('--s',hs()+'px');
  let x=A.W/2,y=A.H/2,tx2=x,ty=y,face=1,down=false,trailT=0,hurt=0,lastOw=0;
  const items=[];
  const setT=e=>{[tx2,ty]=A.local(e)};
  sc.on(A.el,'pointerdown',e=>{down=true;setT(e);sfx.splash()});
  sc.on(A.el,'pointermove',e=>{if(down||e.pointerType==='mouse')setT(e)});
  sc.on(window,'pointerup',()=>down=false);
  sc.on(window,'keydown',e=>{const d=70,m={ArrowLeft:[-d,0],ArrowRight:[d,0],ArrowUp:[0,-d],ArrowDown:[0,d]}[e.key];if(m){tx2=x+m[0];ty=y+m[1];e.preventDefault()}});
  say('swim_intro',{p:me,n:GOAL},...(lv>=3?['jelly_warn']:[]));
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
    x+=(tx2-x)*k;y+=(ty-y)*k;x=Math.max(r,Math.min(A.W-r,x));y=Math.max(r,Math.min(A.H*.9-r,y));
    if(tx2<x-6)face=1;else if(tx2>x+6)face=-1;
    const moving=Math.abs(tx2-x)>8||Math.abs(ty-y)>8;
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
        if(it.k==='j'){if(hurt<=0){hurt=1;hero.classList.remove('hurt');void hero.offsetWidth;hero.classList.add('hurt');sfx.soft();act(hp,'sad');if(t-lastOw>4){lastOw=t;say('jelly_hit')}}continue}
        it.el.remove();items.splice(i,1);
        const [px,py]=A.page(it.x,it.y);
        if(it.k==='s'){sfx.pop();burst(px,py,['✨','⭐'],6);flyStar(px,py);act(hp,'hop');
          if(sl.fill()>=GOAL)return party('swim_win',{p:me,n:GOAL},me);
        }else{yay([px,py],...fresh2(it.p,'meet_new','meet_again'));act(hp,'spin')}
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
  let state='idle',bx=0,by=0,cx=0,cy=0,tx2=0,ty=0,castT=0,biteId=0,lastHint=0;
  const geo=()=>{const s=fs(),wt=A.H*.34,fx=A.W*.04,fy=wt-16-s;return{s,wt,fx,fy,tipX:fx+s*1.45,tipY:fy-s*.15}};
  A.onresize=()=>fp.style.setProperty('--s',fs()+'px');
  say('fish_intro');
  sc.on(A.el,'pointerdown',e=>{
    const [x,y]=A.local(e),G=geo();
    if(state==='idle'){if(y<G.wt+20){sfx.soft();return say('fish_land')}
      state='cast';castT=0;tx2=x;ty=y;bob.hidden=false;sfx.whoosh();act(fp,'wiggle')}
    else if(state==='wait'){const n=Date.now();if(n-lastHint>2500){lastHint=n;say('fish_wait')}}
    else if(state==='bite')reel();
  });
  function bite(){state='bite';const id=++biteId;bob.innerHTML='<div class="excl">!</div>';sfx.splash();say('fish_bite');
    sc.later(()=>{if(state==='bite'&&biteId===id){state='idle';bob.hidden=true;bob.innerHTML='';sfx.soft();act(fp,'sad');say('fish_miss')}},WIN*1000)}
  function reel(){
    state='reel';bob.hidden=true;bob.innerHTML='';
    const p=pick(POOL.laut),G=geo(),f=h('div','sprite'),s=G.s*1.05;f.append(pic(p,{s:s+'px'}));A.el.append(f);
    const sx=bx-s/2,sy=by-s/2,ex=G.fx+G.s*.6,ey=G.fy-s*.9;
    sfx.splash();
    f.animate([{transform:`translate(${sx}px,${sy}px) scale(.3) rotate(0)`},{transform:`translate(${(sx+ex)/2}px,${Math.min(sy,ey)-A.H*.18}px) scale(1.1) rotate(-200deg)`,offset:.55},{transform:`translate(${ex}px,${ey}px) scale(1) rotate(-360deg)`}],{duration:1000,easing:'ease-in-out',fill:'forwards'}).onfinish=()=>{
      const [px,py]=A.page(ex+s/2,ey+s/2);
      yay([px,py],'praise',...fresh2(p,'fish_new','fish_again'));act(fp,'spin');
      sc.later(()=>{f.animate([{opacity:1},{opacity:0,transform:`translate(${ex}px,${ey-60}px) scale(.5)`}],{duration:500,fill:'forwards'}).onfinish=()=>f.remove()},900);
      state='idle';if(sl.fill()>=GOAL)sc.later(()=>party('fish_win',{n:GOAL},p),1400);
    };
  }
  sc.loop((dt,t)=>{
    const G=geo();
    fisher.style.transform=`translate(${G.fx}px,${G.fy+Math.sin(t*2)*2}px) scaleX(-1)`;
    rod.setAttribute('x1',G.fx+G.s*.7);rod.setAttribute('y1',G.fy+G.s*.45);rod.setAttribute('x2',G.tipX);rod.setAttribute('y2',G.tipY);
    if(state==='cast'){castT+=dt/.6;const k=Math.min(1,castT);cx=G.tipX+(tx2-G.tipX)*k;cy=G.tipY+(ty-G.tipY)*k-Math.sin(Math.PI*k)*A.H*.25;
      if(k>=1){state='wait';const r=h('div','ring');r.style.left=tx2+'px';r.style.top=ty+'px';A.el.append(r);setTimeout(()=>r.remove(),900);sfx.splash();
        const id=++biteId;sc.later(()=>{if(state==='wait'&&biteId===id)bite()},rnd(1400,3800))}}
    if(state==='wait'){cx=tx2;cy=ty+Math.sin(t*3)*3}
    if(state==='bite'){cx=tx2+Math.sin(t*30)*3;cy=ty+Math.abs(Math.sin(t*12))*12;if(Math.random()<dt*4){const r=h('div','ring');r.style.left=tx2+'px';r.style.top=ty+'px';A.el.append(r);setTimeout(()=>r.remove(),900)}}
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
    say(n===1?'egg_first':'egg_next');
    e.onclick=()=>{
      if(done)return;taps++;sfx.crack();tone(260+taps*55,.12,'triangle',.12);
      e.animate([{transform:'rotate(0)'},{transform:'rotate(-14deg) scale(1.05,.95)'},{transform:'rotate(12deg)'},{transform:'rotate(-6deg)'},{transform:'rotate(0)'}],{duration:420});
      const [x,y]=center(e);burst(x,y-30,['✨','💫'],4);
      const show=Math.floor(taps/NEED*cracks.length+.0001);cracks.forEach((c,i)=>c.classList.toggle('on',i<show));
      if(taps===Math.ceil(NEED/2))say('egg_half');
      if(taps>=NEED)hatch();
    };
    function hatch(){
      done=true;sfx.whoosh();
      e.animate([{transform:'scale(1)',filter:'brightness(1)'},{transform:'scale(1.25)',filter:'brightness(3)'},{transform:'scale(1.5)',opacity:0,filter:'brightness(4)'}],{duration:500,fill:'forwards'});
      const [x,y]=center(e);burst(x,y,['🥚','✨','💖','⭐'],18);
      sc.later(()=>{
        e.remove();const b=h('div','baby popin'),bp=pic(p,{big:true});b.append(bp);wrap.insertBefore(b,nest);
        const fresh=gain(p);yay(b,'egg_hello',{p},...(fresh?['new_one']:[]));
        sc.later(()=>act(bp,'dance'),700);sc.later(()=>act(bp,'hop'),1700);
        if(n<ROUNDS){const nb=h('button','bigbtn popin',tx('eggNext'));nb.style.animationDelay='1.2s';nb.onclick=()=>{sfx.pop();next()};wrap.append(nb)}
        else sc.later(()=>party('egg_win',{},p),2800);
      },420);
    }
  }
  next();
}

/* ================= 4. Kasih makan & evolusi ================= */
function feed(root,sc,lv){
  const chain=randomChain(lv>=3?3:2);let st=0,p=chain[0],fed=0,busy=false,want=-1;
  const NEED=2+lv;
  const box=h('div','feed'),hearts=h('div','hearts'),pet=h('button','pet'),tray=h('div','berries');
  box.append(hearts,pet,tray);root.append(box);
  let petPic=pic(p,{big:true});pet.append(petPic);
  const drawHearts=()=>{hearts.innerHTML='';for(let i=0;i<NEED;i++)hearts.append(h('span',i<fed?'on':'',i<fed?'❤️':'🤍'))};
  const fillTray=()=>{tray.innerHTML='';const n=lv>=4?5:4;let fs=sample([...FRUIT_EMO.keys()],n);if(want>=0&&!fs.includes(want))fs[0]=want;fs=shuffle(fs);
    fs.forEach((f,i)=>{const b=h('button','berry popin',FRUIT_EMO[f]);b.style.animationDelay=i*70+'ms';b.onclick=()=>give(b,f);tray.append(b)})};
  const ask=()=>{if(lv>=4){want=ri(0,FRUIT_EMO.length-1);say('feed_want',{p,f:want})}else want=-1};
  drawHearts();ask();fillTray();
  if(want<0)say('feed_intro',{p});
  pet.onclick=()=>{act(petPic,'hop');sfx.boing()};
  function give(b,f){
    if(busy)return;
    if(want>=0&&f!==want){oops(b,'feed_wrong',{p,f:want});act(petPic,'wiggle');return}
    busy=true;const [sx,sy]=center(b),[ex,ey]=center(pet);
    const fl=h('span','fx',FRUIT_EMO[f]);fl.style.fontSize='54px';document.body.append(fl);b.style.visibility='hidden';sfx.whoosh();
    fl.animate([{transform:`translate(${sx}px,${sy}px) translate(-50%,-50%)`},{transform:`translate(${(sx+ex)/2}px,${Math.min(sy,ey)-90}px) translate(-50%,-50%) scale(1.3) rotate(180deg)`,offset:.5},{transform:`translate(${ex}px,${ey}px) translate(-50%,-50%) scale(.3) rotate(360deg)`}],{duration:RM?10:600,easing:'ease-in'}).onfinish=()=>{
      fl.remove();sfx.chomp();act(petPic,'chomp');burst(ex,ey,['💖','💕','✨'],8);
      fed++;drawHearts();b.remove();
      if(fed>=NEED){evolve();return}
      if(lv>=4)ask();else say('yum');
      if(!tray.children.length||lv>=4)fillTray();
      busy=false;
    };
  }
  function evolve(){
    const nx=chain[st+1];
    say('evo_start',{p});mascot('yay');
    pet.classList.add('evo');
    const np=pic(nx,{big:true});np.style.opacity=0;pet.append(np);
    let k=0;const STEPS=RM?2:16;
    const step=()=>{k++;const showNew=k%2===1;petPic.style.opacity=showNew?0:1;np.style.opacity=showNew?1:0;tone(300+k*45,.12,'sine',.12);
      if(k<STEPS)sc.later(step,Math.max(70,430-k*24));else finish()};
    sc.later(step,900);
    function finish(){
      const fl=h('div','flash');document.body.append(fl);setTimeout(()=>fl.remove(),950);
      petPic.remove();np.style.opacity=1;petPic=np;pet.classList.remove('evo');
      const [x,y]=center(pet);burst(x,y,['⭐','✨','💫','🌟'],24);
      sfx.win();gain(nx);flyStar(x,y);
      say('praise','evo_done',{p,q:nx});sc.later(()=>act(petPic,'spin'),500);
      p=nx;st++;fed=0;drawHearts();
      if(st>=chain.length-1){sc.later(()=>party('evo_win',{p:nx},nx),3200);return}
      sc.later(()=>{busy=false;ask();fillTray();if(want<0)say('evo_more',{p:nx})},2800);
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
  let y=0,vy=0,jumps=0,dist=0,hurt=0,nextSpawn=1.2,lastOw=0;
  const items=[];const gy=()=>A.H*.8,G=()=>A.H*3.6;const ground=A.el.querySelector('.ground');
  const jump=()=>{if(jumps<2){vy=-Math.sqrt(2*G()*A.H*(jumps?.3:.44));jumps++;sfx.boing();act(hp,jumps>1?'spin':'hop',jumps>1?600:400)}};
  sc.on(A.el,'pointerdown',e=>{e.preventDefault();jump()});
  sc.on(window,'keydown',e=>{if(e.key===' '||e.key==='ArrowUp'){e.preventDefault();jump()}});
  say('run_intro',{p:me});
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
    vy+=G()*dt;y+=vy*dt;if(y>0){if(jumps>0)act(hp,'chomp',260);y=0;vy=0;jumps=0}
    hurt=Math.max(0,hurt-dt);
    const s=hs(),hx=A.W*.18,run=y===0?Math.abs(Math.sin(t*12))*-6:0;
    hero.style.transform=`translate(${hx-s/2}px,${gy()-s+y+run}px) scaleX(-1) rotate(${y===0?Math.sin(t*12)*4:-10}deg)`;
    ground.style.backgroundPosition=`${-dist%80}px 0`;
    decor.forEach(d=>{d.x-=sp*d.sp*dt;if(d.x<-120)d.x=A.W+rnd(20,160);d.el.style.transform=`translateX(${d.x}px)`});
    nextSpawn-=dt;if(nextSpawn<=0){spawn();nextSpawn=rnd(1.1,2.2)/(1+lv*.08)}
    for(let i=items.length-1;i>=0;i--){const it=items[i];it.x-=sp*dt;
      const bobY=it.k==='poke'?Math.sin(t*4+i)*8:0;
      it.el.style.transform=`translate(${it.x-it.s/2}px,${it.y+bobY}px)`;
      const heroCY=gy()-s/2+y;
      if(it.k==='rock'){if(hurt<=0&&Math.abs(it.x-hx)<s*.28+it.s*.35&&y>-it.s*.75){hurt=1.1;hero.classList.remove('hurt');void hero.offsetWidth;hero.classList.add('hurt');sfx.soft();act(hp,'sad');
        if(t-lastOw>4){lastOw=t;say('run_hit')}}}
      else if(Math.hypot(it.x-hx,(it.y+it.s/2)-heroCY)<s*.42+it.s*.4){
        it.el.remove();items.splice(i,1);const [px,py]=A.page(it.x,it.y+it.s/2);
        if(it.k==='star'){sfx.pop();burst(px,py,['✨','⭐'],6);flyStar(px,py);if(sl.fill()>=GOAL)return party('run_win',{p:me},me)}
        else yay([px,py],...fresh2(it.p,'meet','hello'));
        continue}
      if(it.x<-it.s*2){it.el.remove();items.splice(i,1)}
    }
  });
}

/* ================= 6. Gali fosil ================= */
function fossil(root,sc,lv){
  const fr=FOSSIL.filter(id=>!CAUGHT.has(id)),p=byId(pick(fr.length?fr:FOSSIL));
  const wrap=h('div','digwrap'),dig=h('div','dig enter');const stone=pic(p,{calm:true,big:true});stone.classList.add('stone');dig.append(stone);
  const cv=h('canvas');dig.append(cv);const hand=h('div','hand','👆');dig.append(hand);
  wrap.append(dig);root.append(wrap);
  say('fos_intro');
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
    const r=c/tot;if(r>.3&&!half){half=true;say('fos_half')}
    if(r>.6)reveal();
  }
  function reveal(){
    if(done)return;done=true;dig.classList.add('alive');
    const live=pic(p,{big:true});live.style.opacity=0;dig.insertBefore(live,cv);
    say('fos_glow');tone(400,.6,'sine',.12,0,1200);
    sc.later(()=>{const fl=h('div','flash');document.body.append(fl);setTimeout(()=>fl.remove(),950);
      stone.remove();live.style.opacity=1;live.classList.add('popin');
      gain(p);yay(dig,'fos_alive',{p});
      sc.later(()=>act(live,'dance'),800);sc.later(()=>party('fos_win',{p},p),3200)},1000);
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
  let x=A.W/2,tx2=x,face=1,dizzy=0,next=.6,lastOw=0;const items=[];
  sc.on(A.el,'pointerdown',e=>{tx2=A.local(e)[0]});
  sc.on(A.el,'pointermove',e=>{if(e.buttons||e.pointerType==='mouse')tx2=A.local(e)[0]});
  sc.on(window,'keydown',e=>{if(e.key==='ArrowLeft')tx2=x-80;if(e.key==='ArrowRight')tx2=x+80});
  say('cat_intro',{p:me},...(lv>=3?['cat_rockwarn']:[]));
  function spawn(){const s=hs()*.42,r=Math.random();const k=lv>=3&&r<.18?'rock':r<.9?'fruit':'poke';
    const el=h('div','rock');el.style.fontSize=s+'px';
    if(k==='poke'){el.className='sprite';const p=pick(POOL.all);el.append(pic(p,{s:s*1.6+'px'}));items.push({k,p,el,x:rnd(s,A.W-s),y:-s*2,vy:A.H*(.22+lv*.04),s:s*1.6,rot:0})}
    else{el.textContent=k==='rock'?'🪨':pick(FRUIT_EMO);items.push({k,el,x:rnd(s,A.W-s),y:-s,vy:A.H*(.24+lv*.05)*rnd(.9,1.15),s,rot:rnd(-1,1)})}
    A.el.append(el)}
  sc.loop((dt,t)=>{
    const s=hs(),gy=A.H*.8;x+=(tx2-x)*Math.min(1,dt*(dizzy>0?2:7));x=Math.max(s/2,Math.min(A.W-s/2,x));
    if(tx2<x-6)face=1;else if(tx2>x+6)face=-1;dizzy=Math.max(0,dizzy-dt);
    hero.style.transform=`translate(${x-s/2}px,${gy-s+Math.abs(Math.sin(t*8))*-4}px) scaleX(${face}) rotate(${dizzy>0?Math.sin(t*20)*10:0}deg)`;
    next-=dt;if(next<=0){spawn();next=rnd(.7,1.3)/(1+lv*.1)}
    for(let i=items.length-1;i>=0;i--){const it=items[i];it.y+=it.vy*dt;
      it.el.style.transform=`translate(${it.x-it.s/2}px,${it.y}px) rotate(${it.rot*t*90}deg)`;
      if(it.y+it.s>gy-s*.7&&it.y<gy-s*.2&&Math.abs(it.x-x)<s*.5){
        it.el.remove();items.splice(i,1);const [px,py]=A.page(it.x,it.y);
        if(it.k==='rock'){dizzy=1;sfx.soft();act(hp,'sad');if(t-lastOw>3){lastOw=t;say('cat_rock')}}
        else if(it.k==='poke'){yay([px,py],...fresh2(it.p,'cat_new','cat_again'));act(hp,'spin')}
        else{sfx.chomp();act(hp,'chomp');burst(px,py,['✨','💖'],5);flyStar(px,py);if(sl.fill()>=GOAL)return party('cat_win',{p:me},me)}
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
      if(got===1||Math.random()<.4)say(Math.random()<.7?'peek_hi':'praise',{p:o.p});
      gain(o.p);
      setTimeout(()=>{pp.classList.remove('up');setTimeout(()=>o.busy=false,350)},450);
      if(got>=GOAL)sc.later(()=>party('peek_win',{n:GOAL}),800)})}
  say('peek_intro');
  function up(){const free=holes.filter(o=>!o.busy);if(!free.length||holes.filter(o=>o.busy).length>=MAXUP)return;
    const o=pick(free);o.busy=true;o.hit=false;o.p=pick(POOL.all);o.pp.innerHTML='';o.pic=pic(o.p);o.pp.append(o.pic);
    requestAnimationFrame(()=>o.pp.classList.add('up'));tone(600,.08,'sine',.08,0,900);
    sc.later(()=>{if(!o.hit){o.pp.classList.remove('up');sc.later(()=>o.busy=false,380)}},STAY+rnd(-200,300));}
  sc.later(up,600);sc.every(up,Math.max(450,1000-lv*100));
}

/* ================= 9. Siapa itu (bayangan) ================= */
function shadow(root,sc,lv){
  const ROUNDS=5,OPTS=[3,3,4,4,5][lv-1];let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('sh_win');
    q++;const ans=pick(POOL.all);
    let others=lv>=4?DEX.filter(p=>p.id!==ans.id&&p.ty.some(t=>ans.ty.includes(t))):DEX.filter(p=>p.id!==ans.id);
    if(others.length<OPTS)others=DEX.filter(p=>p.id!==ans.id);
    const opts=shuffle([ans,...sample(others,OPTS-1)]);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const spot=h('div','spot shadow');const sp=pic(ans,{calm:true,big:true});spot.append(sp);
    const row=h('div','opts');let done=false;
    opts.forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=(200+i*90)+'ms';const pp=pic(p);b.append(pp,h('b',null,p.n));
      b.onclick=()=>{if(done)return;
        if(p.id===ans.id){done=true;b.classList.add('yes');spot.classList.remove('shadow');spot.classList.add('show');act(sp,'spin');act(pp,'hop');gain(ans);
          yay(b,'praise','sh_yes',{p:ans,t:ans.ty[0]});sc.later(next,2600)}
        else{b.classList.add('no');b.disabled=true;oops(b,'that_is',{p},'try')}};
      row.append(b)});
    box.append(spot,row);
    say(q===1?'sh_first':'sh_q');
  }
  next();
}

/* ================= 10. Berhitung ================= */
function count(root,sc,lv){
  const ROUNDS=5,MAX=[3,5,7,9,10][lv-1];let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('cnt_win');
    q++;const n=ri(1,MAX),p=pick(POOL.all),mixed=lv>=3&&Math.random()<.6;
    const other=mixed?pick(POOL.all.filter(x=>x.id!==p.id)):null,extra=mixed?ri(1,3):0;
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const tot=n+extra,area=h('div','count-area '+(tot<=3?'few':tot<=6?'mid':'many'));
    let tapped=0;
    const list=shuffle([...Array(n).fill(p),...Array(extra).fill(other)]);
    list.forEach((it,i)=>{const c=h('button','cnt popin');c.style.animationDelay=i*110+'ms';c.setAttribute('aria-label',it.n);const pp=pic(it);c.append(pp);
      c.onclick=()=>{if(it!==p){oops(c,'cnt_other',{q:it,p});return}
        if(c.classList.contains('on'))return;tapped++;c.classList.add('on');c.append(h('span','tag',tapped));act(pp,'hop');tone(400+tapped*60,.14,'triangle',.15);speak('num',{n:tapped})};
      area.append(c)});
    const row=h('div','opts');let done=false;
    const set=new Set([n]);while(set.size<(lv>=5?4:3))set.add(ri(1,Math.max(5,MAX)));
    [...set].sort((a,b)=>a-b).forEach((v,i)=>{const b=h('button','opt num popin',v);b.style.animationDelay=(300+i*90)+'ms';
      b.onclick=()=>{if(done)return;
        if(v===n){done=true;b.classList.add('yes');gain(p);area.querySelectorAll('.cnt .pic').forEach((x,j)=>setTimeout(()=>act(x,'hop'),j*90));
          yay(b,'praise','cnt_yes',{n,p});sc.later(next,2600)}
        else{b.classList.add('no');b.disabled=true;oops(b,'cnt_no')}};
      row.append(b)});
    box.append(area,row);
    say(mixed?'cnt_mixed':'cnt_q',{p});
  }
  next();
}

/* ================= 11. Besar kecil ================= */
function sizes(root,sc,lv){
  const ROUNDS=6;let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('sz_win');
    q++;const n=lv<=1?2:lv<=3?3:4,p=pick(POOL.all);
    const kinds=lv>=3?[0,1,2]:[0,1];let ask=kinds[(q-1)%kinds.length];if(ask===2&&n!==3)ask=0;
    const F=n===2?[.5,1]:n===3?[.42,.7,1]:[.35,.55,.78,1];
    const fs=shuffle(F),target=ask===0?1:ask===1?F[0]:F[1];
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const row=h('div','sizes');let done=false;
    fs.forEach((f,i)=>{const b=h('button','opt popin');b.style.animationDelay=i*100+'ms';const pp=pic(lv>=5?pick(POOL.all):p,{s:`calc(var(--base) * ${f} * ${n>3?.75:1})`});b.append(pp);
      b.onclick=()=>{if(done)return;if(f===target){done=true;b.classList.add('yes');act(pp,'spin');yay(b,'praise','sz_yes',{s:ask});sc.later(next,2200)}
        else{b.classList.add('no');act(pp,'wiggle');oops(b,'sz_no',{s:ask});setTimeout(()=>b.classList.remove('no'),900)}};
      row.append(b)});
    box.append(row);
    say('sz_q',{s:ask});
  }
  next();
}

/* ================= 12. Tebak pola ================= */
function pattern(root,sc,lv){
  const ROUNDS=5;let q=0;
  const PAT=[['AB'],['AB','AAB','ABB'],['ABC','AAB','ABB'],['AABB','ABC','ABAC'],['ABCD','AABB','ABAC','ABBC']][lv-1];
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('pat_win');
    q++;const pat=pick(PAT),keys=[...new Set(pat)],mons=sample(POOL.all,keys.length+1);
    const map=Object.fromEntries(keys.map((k,i)=>[k,mons[i]]));
    let seq='';while(seq.length<pat.length*2+1)seq+=pat;seq=seq.slice(0,Math.max(5,pat.length*2+1));
    const ans=map[seq[seq.length-1]];
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const line=h('div','count-area '+(seq.length<=5?'mid':'many'));
    [...seq.slice(0,-1)].forEach((k,i)=>{const c=h('div','cnt popin');c.style.animationDelay=i*120+'ms';c.append(pic(map[k]));line.append(c)});
    const qm=h('div','cnt popin qmark','<span>?</span>');qm.style.animationDelay=seq.length*120+'ms';line.append(qm);
    const row=h('div','opts');let done=false;
    let opts=shuffle([...new Set([...keys.map(k=>map[k]),mons[keys.length]])]).slice(0,Math.max(3,keys.length+(lv>=4?1:0)));
    if(!opts.includes(ans))opts[0]=ans;
    shuffle(opts).forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=(500+i*90)+'ms';const pp=pic(p);b.append(pp);
      b.onclick=()=>{if(done)return;if(p===ans){done=true;b.classList.add('yes');qm.innerHTML='';qm.append(pic(p));qm.classList.add('on');
          line.querySelectorAll('.pic').forEach((x,j)=>setTimeout(()=>act(x,'hop'),j*110));yay(b,'praise','pat_yes');sc.later(next,2600)}
        else{b.classList.add('no');b.disabled=true;oops(b)}};
      row.append(b)});
    box.append(line,row);
    const names=[...seq.slice(0,-1)].flatMap(k=>['name',{p:map[k]}]);
    say('pat_q');sc.later(()=>speak(...names,'pat_then'),900);
  }
  next();
}

/* ================= 13. Urutan evolusi ================= */
function order(root,sc,lv){
  const ROUNDS=lv<=2?3:4;let q=0;
  const box=h('div','q');root.append(box);
  function next(){
    if(q>=ROUNDS)return party('ord_win');
    q++;const ch=randomChain(lv>=3?3:2).slice(0,lv>=3?3:2);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const top=h('div','opts ord'),bot=h('div','opts ordb');let step=0;
    const holes=ch.map((_,i)=>{const s=h('div','opt hole2','<span>'+(i+1)+'</span>');top.append(s);if(i<ch.length-1)top.append(h('span','arrow','➜'));return s});
    shuffle(ch).forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=i*100+'ms';const pp=pic(p);b.append(pp,h('b',null,p.n));
      b.onclick=()=>{if(p===ch[step]){sfx.pop();const hole=holes[step];hole.innerHTML='';const np=pic(p);hole.append(np);hole.classList.add('yes','popin');act(np,'hop');b.style.visibility='hidden';step++;
          gain(p);
          if(step>=ch.length){const list=ch.flatMap((x,j)=>j?['then','name',{p:x}]:['name',{p:x}]);yay(hole,'praise',...list);sc.later(next,3000)}
          else speak(step===1?'ord_first':'ord_then',{p})}
        else oops(b,step===0?'ord_wrong0':'ord_wrong')};
      bot.append(b)});
    box.append(top,bot);
    say('ord_intro');
  }
  next();
}

/* ================= 14. Huruf awal ================= */
function letters(root,sc,lv){
  const ROUNDS=5,OPTS=[2,3,3,4,4][lv-1];let q=0;
  const EASY=[...'ABCDEGHIKLMPRST'];
  const box=h('div','q');root.append(box);
  const first=p=>p.n.normalize('NFD').replace(/[^A-Za-z]/g,'').charAt(0).toUpperCase();
  const ALL=[...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].filter(k=>DEX.some(p=>first(p)===k));
  function next(){
    if(q>=ROUNDS)return party('let_win');
    q++;const Lt=pick(lv<=2?EASY:ALL);
    const ans=pick(DEX.filter(p=>first(p)===Lt)),others=sample(DEX.filter(p=>first(p)!==Lt),OPTS-1);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const big=h('div','spot popin bigletter',`<span>${Lt}</span>`);
    const row=h('div','opts');let done=false;
    shuffle([ans,...others]).forEach((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=(200+i*90)+'ms';const pp=pic(p);
      const nm=h('b');nm.innerHTML=`<span class="first">${p.n.charAt(0)}</span>${p.n.slice(1)}`;b.append(pp,nm);
      b.onclick=()=>{if(done)return;if(p===ans){done=true;b.classList.add('yes');act(pp,'spin');gain(p);yay(b,'praise','let_yes',{p,L:Lt});sc.later(next,2600)}
        else{b.classList.add('no');b.disabled=true;oops(b,'let_no',{q:p,M:first(p),L:Lt})}};
      row.append(b)});
    box.append(big,row);
    say('let_q',{L:Lt});
  }
  next();
}

/* ================= 15. Kartu kembar ================= */
function memory(root,sc,lv){
  const PAIRS=[3,4,6,8,10][lv-1];
  const wrap=h('div','memwrap'),grid=h('div','mem');wrap.append(grid);root.append(wrap);
  const cols=PAIRS<=3?3:PAIRS<=6?4:5;grid.style.gridTemplateColumns=`repeat(${cols},minmax(0,1fr))`;
  grid.style.width=`min(100%,${cols*(PAIRS*2/cols>3?16:22)}vh)`;
  const set=sample(POOL.all,PAIRS),cards=shuffle([...set,...set]);
  let open=[],lock=false,matched=0,tries=0;
  cards.forEach((p,i)=>{
    const c=h('button','card popin');c.style.animationDelay=i*45+'ms';c.setAttribute('aria-label','Kartu');
    const inn=h('div','in'),f=h('div','f'),pp=pic(p);f.append(pp);inn.append(h('div','b'),f);c.append(inn);c.pp=pp;
    c.onclick=()=>{
      if(lock||c.classList.contains('up')||c.classList.contains('done'))return;
      c.classList.add('up');sfx.flip();open.push({c,p});setTimeout(()=>act(pp,'hop'),250);speak('name',{p});
      if(open.length===2){lock=true;tries++;const [a,b]=open;
        if(a.p.id===b.p.id){sc.later(()=>{a.c.classList.add('done');b.c.classList.add('done');act(a.c.pp,'spin');act(b.c.pp,'spin');gain(a.p);matched++;open=[];lock=false;
            yay(b.c,'mem_match',{p:a.p});
            if(matched===PAIRS)sc.later(()=>party('mem_win',{n:tries},a.p),1600)},450)}
        else sc.later(()=>{a.c.classList.remove('up');b.c.classList.remove('up');open=[];lock=false;sfx.soft();if(Math.random()<.3)say('mem_miss')},1100)}
    };
    grid.append(c);
  });
  say('mem_intro');
}

/* ================= 16. Puzzle ================= */
function puzzle(root,sc,lv){
  const N=[2,2,3,3,4][lv-1],ROUNDS=lv<=2?3:2;let r=0;
  const box=h('div','pz');root.append(box);
  function next(){
    if(r>=ROUNDS)return party('pz_win');
    r++;const p=pick(POOL.all);
    box.innerHTML='';box.classList.remove('enter');void box.offsetWidth;box.classList.add('enter');
    const board=h('div','board');board.style.setProperty('--n',N);
    const ghost=h('div','ghost');ghost.style.backgroundImage=`url(${HD(p.id)})`;board.append(ghost);
    const tray=h('div','tray'),SC=N<=2?.82:N===3?.62:.5;box.append(board,tray);
    const slotsEl=[];for(let i=0;i<N*N;i++){const s=h('div','slotp');s.dataset.i=i;board.append(s);slotsEl.push(s)}
    let placed=0;
    requestAnimationFrame(()=>{
      const B=board.clientWidth,ps=B/N;
      shuffle([...Array(N*N).keys()]).forEach((i,k)=>{
        const pc=h('div','piece');if(!RM)pc.animate([{opacity:0},{opacity:1}],{duration:400,delay:k*60,fill:'backwards'});pc.dataset.i=i;
        const x=-(i%N)*ps,y=-Math.floor(i/N)*ps;
        pc.style.setProperty('--rot',rnd(-10,10)+'deg');
        pc.fit=k2=>{pc.style.setProperty('--ps',ps*k2+'px');pc.style.background=`url(${HD(p.id)}) ${x*k2}px ${y*k2}px/${B*k2}px ${B*k2}px no-repeat,radial-gradient(circle at 50% 45%,#fff,#bfeaff 70%) ${x*k2}px ${y*k2}px/${B*k2}px ${B*k2}px no-repeat`};
        pc.fit(SC);tray.append(pc);drag(pc,ps);
      });
    });
    say('pz_intro',{p});
    function drag(pc,ps){
      let ox=0,oy=0,on=false;
      pc.addEventListener('pointerdown',e=>{if(pc.parentElement.classList.contains('slotp'))return;on=true;const r2=pc.getBoundingClientRect();ox=e.clientX-r2.left;oy=e.clientY-r2.top;
        const k=ps/r2.width;ox*=k;oy*=k;document.body.append(pc);pc.classList.add('drag');pc.fit(1);pc.style.width=pc.style.height=ps+'px';pc.style.left=(e.clientX-ox)+'px';pc.style.top=(e.clientY-oy)+'px';pc.setPointerCapture(e.pointerId);sfx.flip()});
      pc.addEventListener('pointermove',e=>{if(!on)return;pc.style.left=(e.clientX-ox)+'px';pc.style.top=(e.clientY-oy)+'px'});
      const end=()=>{if(!on)return;on=false;
        const r2=pc.getBoundingClientRect(),cx=r2.left+r2.width/2,cy=r2.top+r2.height/2;pc.classList.remove('drag');
        const target=slotsEl[+pc.dataset.i],tr=target.getBoundingClientRect();
        pc.style.left=pc.style.top='';pc.style.width=pc.style.height='';pc.fit(1);
        if(Math.hypot(cx-(tr.left+tr.width/2),cy-(tr.top+tr.height/2))<ps*.6){
          target.append(pc);sfx.pop();burst(tr.left+tr.width/2,tr.top+tr.height/2,['✨'],4);placed++;
          if(placed===N*N){board.classList.add('done');ghost.remove();const [x2,y2]=center(board);gain(p);
            const live=pic(p,{big:true});live.style.cssText='position:absolute;inset:0;width:100%;height:100%;--s:100%';live.classList.add('popin');
            sc.later(()=>{board.querySelectorAll('.slotp').forEach(s=>s.style.opacity=0);board.append(live);act(live,'spin')},500);
            yay([x2,y2],'praise','pz_done',{p});sc.later(next,3200)}
        }else{tray.append(pc);pc.fit(SC);pc.classList.remove('nope');void pc.offsetWidth;pc.classList.add('nope');sfx.soft()}};
      pc.addEventListener('pointerup',end);pc.addEventListener('pointercancel',end);
    }
  }
  next();
}

/* ================= 17. Ikuti irama ================= */
function simon(root,sc,lv){
  const START=1+Math.ceil(lv/2),END=START+2+Math.floor(lv/2);
  const mons=sample(POOL.all,4),box=h('div','q'),pads=h('div','opts');root.append(box);box.append(pads);
  const COL=['#ff6f61','#2fa6e0','#ffcf33','#34c27a'];
  const btns=mons.map((p,i)=>{const b=h('button','opt popin');b.style.animationDelay=i*90+'ms';b.style.borderColor=COL[i];const pp=pic(p);b.append(pp,h('b',null,p.n));b.pp=pp;pads.append(b);return b});
  let seq=[],inp=0,listening=false;
  const flash=(i,ms=420)=>{const b=btns[i];sfx.note(i);act(b.pp,'hop',ms);b.animate([{background:COL[i]},{background:'#fff'}],{duration:ms+200})};
  function play(){listening=false;inp=0;say(seq.length===START?'sim_first':'sim_again');
    const gap=Math.max(450,800-lv*60);
    seq.forEach((i,k)=>sc.later(()=>flash(i),1900+k*gap));
    sc.later(()=>{listening=true;say('sim_turn')},1900+seq.length*gap+200)}
  btns.forEach((b,i)=>b.onclick=()=>{if(!listening)return;flash(i,300);
    if(i===seq[inp]){inp++;if(inp===seq.length){listening=false;
        if(seq.length>=END){mons.forEach(p=>gain(p));yay(b,'sim_good');sc.later(()=>party('sim_win',{},mons[0]),2000)}
        else{yay(b,'praise');seq.push(ri(0,3));sc.later(play,1600)}}}
    else{listening=false;oops(b,'sim_wrong');sc.later(play,2200)}});
  for(let i=0;i<START;i++)seq.push(ri(0,3));
  play();
}

/* ================= 18. Labirin ================= */
function maze(root,sc,lv){
  const N=[4,5,6,7,8][lv-1];
  const wrap=h('div','memwrap');root.append(wrap);
  const board=h('div','board mazeb');board.style.setProperty('--n',N);wrap.append(board);
  const W=[...Array(N*N)].map(()=>({n:1,e:1,s:1,w:1})),seen=new Set([0]),st=[0];
  while(st.length){const c=st[st.length-1],x=c%N,y=Math.floor(c/N);
    const nb=[[x,y-1,'n','s'],[x+1,y,'e','w'],[x,y+1,'s','n'],[x-1,y,'w','e']].filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N&&!seen.has(b*N+a));
    if(!nb.length){st.pop();continue}const [a,b,d,o]=pick(nb),k=b*N+a;W[c][d]=0;W[k][o]=0;seen.add(k);st.push(k)}
  const cells=W.map((w,i)=>{const c=h('div');c.style.cssText=`position:relative;border-top:${w.n?4:0}px solid #2b6e2b;border-right:${w.e?4:0}px solid #2b6e2b;border-bottom:${w.s?4:0}px solid #2b6e2b;border-left:${w.w?4:0}px solid #2b6e2b;background:${(i+Math.floor(i/N))%2?'#9be28a':'#a8e897'}`;board.append(c);return c});
  const goal=N*N-1,goalEl=h('div','mzgoal','🏠');cells[goal].append(goalEl);board.style.setProperty('--cell',`calc(min(80vw,42vh,420px) / ${N})`);
  const stars=new Set();if(lv>=2)while(stars.size<Math.min(lv,N-1)){stars.add(ri(1,goal-1))}
  stars.forEach(k=>{cells[k].append(h('div','starb mzstar','⭐'))});
  const me=byId(S.buddy),tok=h('div','mztok');const tp=pic(me,{s:'92%'});tp.style.width=tp.style.height='92%';tok.append(tp);
  let at=0;cells[0].append(tok);
  say('mz_intro',{p:me},...(stars.size?['mz_stars']:[]));
  const can=(a,b)=>{const ax=a%N,ay=Math.floor(a/N),bx=b%N,by=Math.floor(b/N);
    if(bx===ax+1&&by===ay)return!W[a].e;if(bx===ax-1&&by===ay)return!W[a].w;if(by===ay+1&&bx===ax)return!W[a].s;if(by===ay-1&&bx===ax)return!W[a].n;return false};
  let bumped=0,ended=false;
  function tryMove(b){if(b===at||ended)return;if(!can(at,b)){if(Date.now()-bumped>900){bumped=Date.now();act(tp,'wiggle');sfx.soft()}return}
    at=b;cells[b].append(tok);act(tp,'hop',300);tone(500+(b%5)*60,.06,'triangle',.08);
    if(stars.has(b)){stars.delete(b);cells[b].querySelector('.mzstar')?.remove();const [x,y]=center(cells[b]);burst(x,y,['✨','⭐'],6);flyStar(x,y);sfx.pop()}
    if(b===goal){ended=true;act(tp,'spin');yay(cells[goal],'praise','mz_home',{p:me});sc.later(()=>party('mz_win',{},me),2200)}}
  const cellAt=(x,y)=>{const r=board.getBoundingClientRect();const cx=Math.floor((x-r.left)/r.width*N),cy=Math.floor((y-r.top)/r.height*N);return cx>=0&&cy>=0&&cx<N&&cy<N?cy*N+cx:-1};
  let down=false;
  sc.on(board,'pointerdown',e=>{down=true;board.setPointerCapture(e.pointerId);const c=cellAt(e.clientX,e.clientY);if(c>=0)tryMove(c)});
  sc.on(board,'pointermove',e=>{if(!down)return;const c=cellAt(e.clientX,e.clientY);if(c>=0)tryMove(c)});
  sc.on(board,'pointerup',()=>down=false);
  sc.on(window,'keydown',e=>{const d={ArrowLeft:-1,ArrowRight:1,ArrowUp:-N,ArrowDown:N}[e.key];if(d){e.preventDefault();tryMove(at+d)}});
}

/* ================= 19. Pecah gelembung ================= */
function bubbles(root,sc,lv){
  const HEX=['#ff4d4d','#2f7bff','#ffd400','#26c26b','#9b5cff','#ff8a1f','#ff7ac6'];
  const COLORS=[...Array([3,4,5,6,7][lv-1]).keys()];
  const A=arena(root,sc,'pond');const GOAL=6+lv*2;let got=0,target=pick(COLORS),lastWrong=0;const bubs=[];
  const announce=()=>{say('bb_q',{c:target});const s=$('.say');const d=h('span','target');d.style.background=HEX[target];s.append(d)};
  announce();
  const dia=()=>Math.max(64,Math.min(130,Math.min(A.W,A.H)*(.22-lv*.012)));
  function spawn(){
    if(bubs.length>8+lv)return;
    const col=Math.random()<.42?target:pick(COLORS),d=dia();
    const el=h('button','bb');el.setAttribute('aria-label','bubble');el.style.setProperty('--d',d+'px');el.style.setProperty('--c',HEX[col]);
    const b={el,col,x:rnd(0,Math.max(1,A.W-d)),y:A.H+d,vy:rnd(A.H/8,A.H/5.5)*(1+lv*.1),ph:rnd(0,6),dead:false,d};
    el.onpointerdown=e=>{e.preventDefault();hit(b)};A.el.append(el);bubs.push(b);
  }
  function hit(b){
    if(b.dead)return;
    if(b.col===target){
      b.dead=true;b.el.classList.add('popd');sfx.pop();setTimeout(()=>b.el.remove(),320);got++;
      const [px,py]=A.page(b.x+b.d/2,b.y+b.d/2);burst(px,py,['💦','🫧','✨'],7);flyStar(px,py);
      if(Math.random()<.45){const p=pick(POOL.all),f=h('div','floaty');f.append(pic(p,{s:b.d*.9+'px'}));A.el.append(f);
        f.animate([{transform:`translate(${b.x}px,${b.y}px) scale(.2)`,opacity:1},{transform:`translate(${b.x}px,${b.y-60}px) scale(1.1)`,opacity:1,offset:.3},{transform:`translate(${b.x+30}px,${b.y-200}px) scale(1)`,opacity:0}],{duration:1500,easing:'ease-out'}).onfinish=()=>f.remove();gain(p)}
      if(got>=GOAL)return party('bb_win');
      if(got%3===0){let n;do{n=pick(COLORS)}while(n===target);target=n;sc.later(announce,350)}
      else speak('bb_pop');
    }else{
      b.el.classList.remove('nope');void b.el.offsetWidth;b.el.classList.add('nope');sfx.soft();mascot('hmm');
      const now=Date.now();if(now-lastWrong>2500){lastWrong=now;speak('bb_wrong',{c:b.col,d:target})}
    }
  }
  spawn();sc.every(spawn,Math.max(380,680-lv*50));
  sc.loop((dt,t)=>{for(let i=bubs.length-1;i>=0;i--){const b=bubs[i];if(b.dead){bubs.splice(i,1);continue}
    b.y-=b.vy*dt;b.el.style.transform=`translate(${b.x+Math.sin(t*1.6+b.ph)*(14+lv*4)}px,${b.y}px)`;if(b.y<-150){b.el.remove();bubs.splice(i,1)}}});
}

/* ================= Koleksi (Pokédex lengkap) ================= */
let dexRegion=1;
function dex(){
  clear();curKey=null;Music.mode(true);$('#homeBtn').hidden=false;$('#ttl').textContent=tx('dex');
  const row=h('div','sayrow'),m=h('button','mascot');m.append(pic(byId(S.buddy)));row.append(m,h('div','say'));stage.append(row);
  const w=h('div','dexwrap'),regs=h('div','regions'),g=h('div','dex');w.append(regs,g);stage.append(w);
  REGION.forEach((r,i)=>{const gen=i+1,tot=DEX.filter(p=>p.gen===gen),has=tot.filter(p=>CAUGHT.has(p.id)).length;
    const b=h('button','reg'+(gen===dexRegion?' on':''),`${r} ${has}/${tot.length}`);b.onclick=()=>{dexRegion=gen;sfx.pop();regs.querySelectorAll('.reg').forEach(x=>x.classList.remove('on'));b.classList.add('on');draw();speak('dex_region',{r:i})};regs.append(b)});
  function draw(){g.innerHTML='';g.scrollTop=0;
    for(const p of DEX){if(p.gen!==dexRegion)continue;
      const has=CAUGHT.has(p.id);
      const c=h('button','dexc'+(has?'':' lock')+(p.id===S.buddy?' buddy':''));
      c.append(pic(p,{calm:true,lazy:true}),h('b',null,has?p.n:'???'),h('small',null,'#'+String(p.id).padStart(4,'0')));
      c.onclick=()=>{if(!has){sfx.soft();speak('dex_lock');return}sfx.pop();detail(p)};
      g.append(c)}}
  draw();
  say('dex_intro',{n:Math.min(300,CAUGHT.size),m:DEX.length});
}
function detail(p){
  const o=h('div','party'),b=h('div','box');const pp=pic(p,{big:true});
  const types=p.ty.map(t=>`<span>${TYPE_EMO[t]} ${typeName(t)}</span>`).join('');
  b.append(h('h2',null,p.n),pp,h('div','tagrow',`${types}<span>🗺️ ${REGION[p.gen-1]}</span><span>#${String(p.id).padStart(4,'0')}</span>`));
  const row=h('div','row');
  const bud=h('button','bigbtn',p.id===S.buddy?tx('myBuddy'):tx('makeBuddy'));
  bud.onclick=()=>{S.buddy=p.id;save();act(pp,'spin');sfx.good();speak('buddy_set',{p});bud.textContent=tx('myBuddy');document.querySelectorAll('.dexc.buddy').forEach(x=>x.classList.remove('buddy'))};
  const cl=h('button','bigbtn alt',tx('close'));cl.onclick=()=>{o.remove();stopVoice()};
  row.append(bud,cl);b.append(row);o.append(b);o.onclick=e=>{if(e.target===o){o.remove();stopVoice()}};document.body.append(o);
  pp.onclick=()=>{act(pp,pick(['hop','spin','dance','wiggle']));sfx.boing()};
  speak('dex_detail',{p,t:p.ty[0],r:p.gen-1},...(p.leg?['dex_legend']:[]));
  setTimeout(()=>act(pp,'hop'),300);
}

/* ================= pengaturan ================= */
function settings(){
  const o=h('div','party'),b=h('div','box help');
  b.append(h('h2',null,tx('setTitle')));
  const f1=h('label','field',tx('lang'));const sel=h('select');sel.id='langSel';
  sel.append(new Option('Bahasa Indonesia','id'),new Option('English','en'));sel.value=S.lang;f1.append(sel);
  const f2=h('label','field',tx('music'));const ms=h('select');ms.id='musicSel';ms.append(new Option(tx('on'),'1'),new Option(tx('off'),'0'));ms.value=S.music?'1':'0';f2.append(ms);
  const f3=h('label','field',tx('mvol'));const rg=h('input');rg.id='mvolSel';rg.type='range';rg.min='0';rg.max='1';rg.step='.05';rg.value=S.mvol;f3.append(rg);
  rg.oninput=()=>{S.mvol=+rg.value;Music.level()};
  ms.onchange=()=>{S.music=ms.value==='1';S.music?Music.start():Music.stop();Music.level()};
  const note=h('p',null,tx('deviceNote'));
  const row=h('div','row');const test=h('button','bigbtn alt',tx('test'));const ok=h('button','bigbtn',tx('save'));
  const apply=()=>{const ch=S.lang!==sel.value;S.lang=sel.value;save();loadIdx(S.lang);return ch};
  test.onclick=()=>{apply();speak('test')};
  ok.onclick=()=>{const ch=apply();o.remove();if(ch&&!curKey)home()};
  const er=h('button','pbtn',tx('erase'));
  er.onclick=()=>{b.innerHTML='';b.append(h('h2',null,'🗑️'),h('p',null,tx('eraseAsk')));const r2=h('div','row');
    const y=h('button','bigbtn',tx('eraseYes'));y.style.background='var(--coral)';y.onclick=()=>{try{localStorage.removeItem(KEY)}catch(e){}Object.assign(S,DEF,{lv:{},lang:S.lang});CAUGHT=new Set(S.caught);save();$('#starN').textContent=0;o.remove();home()};
    const n=h('button','bigbtn alt',tx('cancel'));n.onclick=()=>{o.remove();settings()};r2.append(y,n);b.append(r2)};
  row.append(test,ok);b.append(f1,f2,f3,note,row,er);o.append(b);o.onclick=e=>{if(e.target===o)o.remove()};document.body.append(o);
}

/* ================= pasang aplikasi ================= */
let installEvt=null;
function standalone(){return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();installEvt=e});
addEventListener('appinstalled',()=>{installEvt=null;if(!curKey)home()});
async function installApp(){
  sfx.pop();
  if(installEvt){installEvt.prompt();const r=await installEvt.userChoice.catch(()=>null);installEvt=null;if(r&&r.outcome==='accepted')return}
  const ua=navigator.userAgent,ios=/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1),android=/Android/.test(ua);
  const steps=UI[ios?'iosSteps':android?'andSteps':'pcSteps'][L()];
  const o=h('div','party'),b=h('div','box help');
  b.append(h('h2',null,tx('installTitle',{d:ios?'iPhone':android?'Android':tx('other')})));
  const ol=h('ol','guide');steps.forEach(t=>ol.append(h('li',null,t)));b.append(ol);
  b.append(h('p',null,tx('installNote')));
  const ok=h('button','bigbtn',tx('ok'));ok.onclick=()=>o.remove();b.append(ok);
  o.append(b);o.onclick=e=>{if(e.target===o)o.remove()};document.body.append(o);ok.focus();
}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'||location.hostname==='127.0.0.1')){
  addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
}

/* ================= tombol atas ================= */
$('#homeBtn').onclick=()=>{sfx.pop();home()};
$('#dexBtn').onclick=()=>{sfx.pop();dex()};
$('#stars').onclick=()=>{sfx.pop();speak('stars',{n:Math.min(300,S.stars)})};
const sndUI=()=>{$('#sndBtn').textContent=S.sound?'🔊':'🔇';$('#sndBtn').setAttribute('aria-label',S.sound?'Matikan suara':'Nyalakan suara')};
$('#sndBtn').onclick=()=>{S.sound=!S.sound;save();sndUI();if(S.sound){sfx.pop();Music.start()}else{stopVoice();Music.stop()}Music.level()};
sndUI();$('#starN').textContent=S.stars;

if(!RM){for(let i=0;i<10;i++){const b=h('div','deco-bub');const s=rnd(10,34);b.style.width=b.style.height=s+'px';b.style.left=rnd(0,100)+'vw';b.style.animationDuration=rnd(9,18)+'s';b.style.animationDelay=-rnd(0,18)+'s';document.body.append(b)}}
home();
window.__game={open,home,dex,GAMES,S,say,compose};
})();
