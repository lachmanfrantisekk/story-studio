import React from 'react';
import {AbsoluteFill, interpolate, staticFile} from 'remotion';

// MIMO SIGNÁL visual system A6: authored, layered SVG scenery and rigged illustrated actor.
// All components are deterministic across frames. Art is original vector code, no AI API, no stock assets.
const cap={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
const lerp=(frame,start,end,a=0,b=1)=>interpolate(frame,[start,end],[a,b],cap);
const C={sky:'#071524', night:'#06121d', teal:'#7fe5df', warm:'#fac894', ink:'#0d1d29', jacket:'#243b4d', rim:'#6cd9db'};
const hash=(n)=>{let x=Math.sin(n*127.1+12.73)*43758.54;return x-Math.floor(x)};

export const ArtDefs=()=> <defs>
 <linearGradient id="a6Sky" x1="0" y1="0" x2="0.2" y2="1"><stop stopColor="#061424"/><stop offset=".48" stopColor="#18364a"/><stop offset=".83" stopColor="#345265"/><stop offset="1" stopColor="#61756a"/></linearGradient>
 <radialGradient id="a6MoonGlow"><stop stopColor="#d5f8f5" stopOpacity=".37"/><stop offset=".32" stopColor="#a3d5d8" stopOpacity=".14"/><stop offset="1" stopColor="#6ac9de" stopOpacity="0"/></radialGradient>
 <linearGradient id="a6Ground" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#566c69"/><stop offset=".42" stopColor="#364e4d"/><stop offset="1" stopColor="#142c32"/></linearGradient>
 <linearGradient id="a6Trail" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#9b9381"/><stop offset=".4" stopColor="#5e6560"/><stop offset="1" stopColor="#273d42"/></linearGradient>
 <linearGradient id="a6Trunk" x1="0" y1="0" x2="1" y2="0"><stop stopColor="#0a1a26"/><stop offset=".32" stopColor="#273a3e"/><stop offset=".55" stopColor="#46504a"/><stop offset=".86" stopColor="#142a30"/></linearGradient>
 <linearGradient id="a6Needles" x1="0" y1="0" x2=".6" y2="1"><stop stopColor="#426565"/><stop offset=".5" stopColor="#1d4652"/><stop offset="1" stopColor="#102c39"/></linearGradient>
 <linearGradient id="a6Hood" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#445a67"/><stop offset=".5" stopColor="#263b4c"/><stop offset="1" stopColor="#152735"/></linearGradient>
 <linearGradient id="a6Coat" x1="0" y1="0" x2="1" y2=".9"><stop stopColor="#496578"/><stop offset=".38" stopColor="#2b4457"/><stop offset="1" stopColor="#182938"/></linearGradient>
 <linearGradient id="a6Pants" x1="0" y1="0" x2="1" y2=".8"><stop stopColor="#32495a"/><stop offset=".5" stopColor="#263745"/><stop offset="1" stopColor="#182634"/></linearGradient>
 <linearGradient id="a6Skin" x1="0" y1="0" x2="1" y2=".4"><stop stopColor="#ffe1c5"/><stop offset=".5" stopColor="#dca58f"/><stop offset="1" stopColor="#ad796e"/></linearGradient>
 <linearGradient id="a6Hair" x1="0" y1="0" x2=".85" y2="1"><stop stopColor="#57616a"/><stop offset=".24" stopColor="#30353e"/><stop offset=".72" stopColor="#18232e"/><stop offset="1" stopColor="#0b1823"/></linearGradient>
 <linearGradient id="a6Phone" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#4ddbd5"/><stop offset="1" stopColor="#164758"/></linearGradient>
 <radialGradient id="a6Vignette"><stop offset=".48" stopColor="#06111b" stopOpacity="0"/><stop offset="1" stopColor="#030811" stopOpacity=".74"/></radialGradient>
 <radialGradient id="a6HeadLamp"><stop stopColor="#fff0bc" stopOpacity=".44"/><stop offset=".4" stopColor="#ffc57c" stopOpacity=".12"/><stop offset="1" stopColor="#fac894" stopOpacity="0"/></radialGradient>
 <radialGradient id="a6PhoneGlow"><stop stopColor="#64eff6" stopOpacity=".48"/><stop offset="1" stopColor="#33b6dd" stopOpacity="0"/></radialGradient>
 <filter id="a6SoftGlow" x="-130%" y="-130%" width="360%" height="360%"><feGaussianBlur stdDeviation="19"/></filter>
 <filter id="a6Fog" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="34"/></filter>
 </defs>;

const Tree=({x,y,scale=1,variant=0,near=false})=>{
 const tone=near?'#112935':variant%3===0?'#1d4550':variant%3===1?'#2e5660':'#2a4652';
 const h=470+(variant%4)*44;
 return <g transform={`translate(${x} ${y}) scale(${scale})`}>
   <path d={`M-12 25 Q-17 -200 -8 ${-h} L15 ${-h} Q16 -210 14 25Z`} fill="url(#a6Trunk)" stroke="#102533" strokeWidth="4"/>
   {[0,1,2,3,4].map(i=><g key={i} transform={`translate(0 ${-h+65+i*85})`}>
     <path d={`M4 -160 Q-42 -105 -${110-i*8} -10 L-${67-i*7} -22 Q-102 24 -${142-i*8} 35 Q-75 20 0 -50 Q65 17 ${142-i*8} 38 Q100 -30 ${70-i*8} -23 L${112-i*8} -10Z`} fill={tone} stroke={near?'#081d28':'#153643'} strokeWidth="5"/>
     <path d={`M-5 -111 Q-54 -54 -${90-i*6} -26`} fill="none" stroke="#8aada1" strokeWidth="5" opacity=".18" strokeLinecap="round"/>
   </g>)}
   <path d={`M0 ${-h}L-56 ${-h+110}L0 ${-h+95}L60 ${-h+125}Z`} fill={tone}/>
   <path d="M-8 -350L-8 -34M7 -210L4 -55" stroke="#79917e" opacity=".16" strokeWidth="4" fill="none"/>
  </g>;
};
const BroadTrunk=({x,y,scale=1,flip=false})=><g transform={`translate(${x} ${y}) scale(${flip?-scale:scale} ${scale})`}>
  <path d="M-48 140Q-23 -200 -55 -400Q-97 -720 -69 -1100L58 -1100Q35 -760 65 -540Q84 -190 72 140Z" fill="url(#a6Trunk)" stroke="#0b212c" strokeWidth="10"/>
  <path d="M-48 -810Q-190 -860 -278 -980M59 -705Q220 -840 290 -1010M-17 -510Q-120 -615 -205 -635" stroke="#172c33" strokeWidth="40" fill="none" strokeLinecap="round"/>
  <path d="M-31 -950Q-22 -595 -10 -245M38 -760Q43 -485 38 -110" stroke="#7c9a8c" strokeWidth="9" opacity=".18" fill="none"/>
  <path d="M-52 -260Q-41 -330 -50 -405M61 -600Q41 -690 60 -800" stroke="#061824" strokeWidth="8" opacity=".5" fill="none"/>
  </g>;
const Fern=({x,y,scale=1,light=false})=><g transform={`translate(${x} ${y}) scale(${scale})`}>
  {[[-60,-70],[-31,-100],[0,-120],[39,-97],[65,-61]].map(([dx,dy],i)=><g key={i}>
  <path d={`M0 0 Q${dx*.4} ${dy*.45} ${dx} ${dy}`} fill="none" stroke={light?'#648575':'#274f4d'} strokeWidth="7"/>
  {[.32,.55,.79].map((t,j)=> <g key={j} transform={`translate(${dx*t} ${dy*t}) rotate(${dx<0?-32:32})`}><path d="M-3 0Q-34 -23 -44 -10Q-25 9 -3 5M3 0Q30 -25 45 -7Q24 12 3 5" fill={light?'#44695c':'#173f43'}/></g>)}
  </g>)}
 </g>;
const Stone=({x,y,scale=1,light=false})=><g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M-58 2L-42 -31L14 -44L61 -12L75 10L34 26L-37 21Z" fill={light?'#627a73':'#30484a'} stroke="#1a3338" strokeWidth="4"/><path d="M-45 -20L14 -43L22 -8L-4 11Z" fill="#9aaca0" opacity=".22"/><path d="M22 -8L60 -12L73 10L31 24Z" fill="#0b2732" opacity=".52"/></g>;
const Starfield=()=> <g>{Array.from({length:64},(_,i)=>{const x=hash(i+30)*1080,y=hash(i+91)*840,r=hash(i+8)*1.7+.45;return <circle key={i} cx={x} cy={y} r={r} fill="#d8f6ff" opacity={.2+hash(i)*.6}/>})}</g>;
const MovingMist=({f,near=false})=><g opacity={near?.25:.18} filter="url(#a6Fog)">{Array.from({length:7},(_,i)=><ellipse key={i} cx={-250+i*250+Math.sin(f*.005+i)*95+(near?-f*.18:f*.07)%210} cy={(near?1270:1000)+(i%3)*170+Math.sin(f*.008+i)*30} rx={250+i%3*65} ry={55+i%3*18} fill={near?'#9ed3c8':'#b7d5d7'}/>)}</g>;
const GroundDetails=({f})=><g>
 {Array.from({length:70},(_,i)=>{const x=hash(i*2+16)*1080,y=1160+hash(i*5+54)*730;const outside=x<430-(y-1200)*.23||x>645+(y-1200)*.25;return outside?<g key={i} opacity={.24+hash(i+7)*.34}><path d={`M${x} ${y}l${5+hash(i+7)*9} ${-4-hash(i+2)*11}`} stroke="#95a88d" strokeWidth="2"/><ellipse cx={x+4} cy={y+3} rx={2+hash(i+5)*5} ry="2" fill="#162e34"/></g>:<Stone key={i} x={x} y={y} scale={.1+hash(i)*.19} light={i%3===0}/>})}
 </g>;

export const IllustratedForest=({frame,shot,subjectFocus=false})=>{
 const type=shot.type,local=frame-shot.start;
 const chasing=['pursuit','run','pace','trip'].includes(type);
 const pan=chasing?Math.sin(frame*.16)*7:Math.sin(frame*.014)*10;
 const nearMove=chasing?frame*.52:frame*.095;
 const colorWarm=['shock','phoneclose','vibrate','textclose','suspicion'].includes(type);
 const shadow=['behind','shadow','pursuit','mapbehind','reveal'].includes(type);
 const reveal=type==='reveal';
 return <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position:'absolute',inset:0}}>
 <ArtDefs/>
 <rect width="1080" height="1920" fill="url(#a6Sky)"/>
 <Starfield/>
 <circle cx="819" cy="330" r="390" fill="url(#a6MoonGlow)"/>
 <circle cx="819" cy="330" r="64" fill="#c9e1df"/><path d="M805 299Q835 305 830 337M787 336L807 351" stroke="#8aa9ad" strokeWidth="5" fill="none" opacity=".3"/>
 <path d="M0 990L110 790L240 927L345 755L500 975L640 822L807 970L928 746L1080 906V1370H0Z" fill="#183848"/>
 <path d="M0 1088L160 945L318 1010L478 865L645 1113L800 907L1080 1041V1440H0Z" fill="#26434a"/>
 <path d="M0 1135Q260 1060 490 1121Q750 1025 1080 1120V1920H0Z" fill="url(#a6Ground)"/>
 <g transform={`translate(${pan*.24} 0)`} opacity=".7">{Array.from({length:12},(_,i)=><Tree key={i} x={-160+i*119+(i%3)*27} y={1240+(i%3)*25} scale={.65+(i%3)*.05} variant={i+3}/>)}</g>
 <MovingMist f={frame}/>
 {/* A thin distant observation mast connects the environment to the mystery without repeating the foreground. */}
 {['establish','rear','behind','shadow','pursuit','reveal'].includes(type)&&<g transform="translate(835 1040)" opacity=".58">
    <path d="M-35 0L-18 -220L-2 0M35 0L18 -220L2 0M-24 -77L23 -77M-24 -144L24 -144" fill="none" stroke="#0a2532" strokeWidth="11"/>
    <path d="M-52 -227L47 -227L32 -272L-35 -272Z" fill="#1d3944" stroke="#0c2631" strokeWidth="9"/>
    <path d="M-22 -268L-11 -247L9 -248L15 -267" fill="#e0ab7a" opacity=".72"/>
    <circle cx="0" cy="-283" r="6" fill="#fa6b72"/>
    <circle cx="0" cy="-283" r="43" fill="url(#a6HeadLamp)"/>
 </g>}
 <path d="M-130 1920Q150 1530 400 1210Q489 1118 519 1110Q588 1115 666 1210Q910 1510 1260 1920Z" fill="url(#a6Trail)"/>
 <path d="M-60 1920Q225 1490 445 1190" stroke="#a9af9b" strokeWidth="6" opacity=".22" fill="none"/>
 <path d="M1160 1920Q798 1450 606 1164" stroke="#c7bea5" strokeWidth="5" opacity=".19" fill="none"/>
 {Array.from({length:18},(_,i)=>{const y=1200+i*42, x=540+Math.sin(i*5.1)*180*(i/18);return <path key={i} d={`M${x} ${y}l${12+i*1.4} ${i%2===0?-5:3}`} stroke="#141f24" strokeWidth={2+i*.2} opacity=".24"/>})}
 <GroundDetails f={frame}/>
 <g transform={`translate(${pan*.6} 0)`}>{Array.from({length:7},(_,i)=><Tree key={i} x={-270+i*222+(i%2)*38} y={1375+(i%2)*95} scale={.96+(i%3)*.14} variant={i} near/>)}</g>
 <g opacity=".8"><Fern x={74} y={1740} scale={1.55} light/><Fern x={1025} y={1615} scale={1.2}/><Fern x={800} y={1730} scale={.6}/><Stone x={150} y={1770} scale={.9}/><Stone x={948} y={1820} scale={1.1}/></g>
 {shadow&&<g transform={`translate(${reveal?730:858} 1310) scale(${reveal?1.23:.66})`} opacity={reveal?.9:.34}>
  <ellipse cy="-250" rx="61" ry="75" fill="#061018" stroke="#47616d" strokeWidth="4"/>
  <path d="M-63 -220Q-100 -165 -115 72L-75 65L-48 -110L-35 90L40 90L52 -118L80 70L118 72Q110 -155 68 -221Z" fill="#030c13"/>
  <circle cx="-22" cy="-255" r="5" fill="#ff707c"/><circle cx="24" cy="-255" r="5" fill="#ff707c"/><ellipse cx="0" cy="-255" rx="104" ry="35" fill="#f47177" opacity=".11" filter="url(#a6SoftGlow)"/>
 </g>}
 <MovingMist f={frame} near/>
 <g transform={`translate(${-nearMove%220} 0)`} opacity=".85"><BroadTrunk x={-190} y={2000} scale={1.2}/><BroadTrunk x={1300} y={1930} scale={1.3} flip/></g>
 {Array.from({length:28},(_,i)=>{const x=hash(i+74)*1080,y=hash(i+50)*1800,phase=frame*.017+i*2;return <circle key={i} cx={x+Math.sin(phase)*13} cy={y+Math.cos(phase*.8)*12} r={hash(i+9)*2.5+.8} fill={i%5===0?'#ffd69d':'#a1e6df'} opacity={.12+Math.abs(Math.sin(phase))*.23}/>})}
 {colorWarm&&<circle cx="690" cy="1120" r="530" fill="url(#a6PhoneGlow)" opacity=".37"/>}
 <rect width="1080" height="1920" fill="url(#a6Vignette)" pointerEvents="none"/>
 </svg>;
};

// Illustrated full-body character: independently animated hips, knees, shoulders,
// elbows, head and wrist/phone. Lighting and clothing stay rigged to the body.
export const IllustratedAdam=({frame=0,mode='walk',phone=false,fright=false,turn=0,face='front'})=>{
 const running=['run','pace','pursuit','trip'].includes(mode);
 const moving=running||['walk'].includes(mode);
 const speed=running?.29:.16;
 const cycle=frame*speed;
 const swing=moving?Math.sin(cycle)*(running?28:17):0;
 const knee=moving?Math.max(0,Math.sin(cycle+1))* (running?28:13):0;
 const bob=moving?Math.abs(Math.cos(cycle))*(running?17:9):Math.sin(frame*.045)*2;
 const flinch=fright?Math.sin(frame*.05)*1.8:0;
 const headTurn=turn?lerp(frame,0,85,0,turn):fright?8:0;
 const eyesWide=fright||['shock','eyes','reveal','suspicion'].includes(mode);
 const handPose=phone?true:['shock','suspicion','listen'].includes(mode);
 return <g transform={`translate(0 ${-bob})`}>
  {/* contact shadow */}<ellipse cy="14" rx="112" ry="22" fill="#051520" opacity=".68"/>
  {/* left and right legs */}
  <g transform="translate(-38 -184)"><g transform={`rotate(${swing})`}>
   <path d="M-6 -6Q-22 58 -14 112L-17 151L17 154L27 75L26 -4Z" fill="url(#a6Pants)" stroke="#142534" strokeWidth="5"/>
   <path d="M-16 118L17 121L10 155L-9 178L-55 180Q-69 168 -44 154L-18 148Z" fill="#121b28" stroke="#485565" strokeWidth="5"/>
   <path d="M-48 176L12 176" stroke="#7c8279" strokeWidth="5"/>
   <path d="M-6 30L7 75" stroke="#76909a" opacity=".19" strokeWidth="5"/>
  </g></g>
  <g transform="translate(36 -184)"><g transform={`rotate(${-swing})`}>
   <path d="M-25 -4Q-20 60 -24 116L-18 150L20 151L30 70L12 -8Z" fill="url(#a6Pants)" stroke="#142534" strokeWidth="5"/>
   <g transform={`rotate(${knee*.3} 0 95)`}><path d="M-18 117L20 121L21 154L48 168Q62 185 42 186L-15 180L-25 164Z" fill="#121b28" stroke="#485565" strokeWidth="5"/>
   <path d="M-15 180L48 182" stroke="#7c8279" strokeWidth="5"/></g>
   <path d="M-6 40L-5 90" stroke="#76909a" opacity=".18" strokeWidth="5"/>
  </g></g>
  {/* backpack behind silhouette */}
  <path d="M-82 -357Q-129 -342 -125 -260Q-128 -195 -83 -188L-43 -191L-50 -348Z" fill="#1b2c39" stroke="#56727a" strokeWidth="6"/>
  <path d="M-114 -299Q-108 -268 -111 -238" stroke="#72929b" strokeWidth="8" opacity=".55"/>
  <path d="M-122 -268L-75 -268" stroke="#0e202c" strokeWidth="12"/>
  {/* hood collar */}
  <path d="M-76 -400Q-101 -430 -71 -450Q0 -467 76 -438Q106 -418 77 -389L52 -363L-55 -367Z" fill="url(#a6Hood)" stroke="#122735" strokeWidth="7"/>
  <path d="M-64 -408Q0 -435 65 -409" stroke="#9fabb0" strokeWidth="6" fill="none" opacity=".4"/>
  {/* arms behind chest, actual rotations */}
  <g transform="translate(-74 -354)"><g transform={`rotate(${-swing*.7-7-flinch})`}>
   <path d="M0 -6Q-25 4 -27 43L-18 98Q-19 120 -2 125L15 115L23 38L23 -7Z" fill="url(#a6Coat)" stroke="#152837" strokeWidth="6"/>
   <path d="M-11 98L17 103" stroke="#8aa9a8" strokeWidth="5"/>
   <g transform="translate(-2 118)"><path d="M-17 -9Q-19 8 -5 15Q10 20 18 4L10 -10Z" fill="url(#a6Skin)"/></g>
  </g></g>
  <g transform="translate(75 -352)"><g transform={`rotate(${handPose?-50:swing*.7+7})`}>
   <path d="M0 -6Q-25 0 -24 48L-17 97Q-18 115 0 122L18 113L21 40L24 -3Z" fill="url(#a6Coat)" stroke="#142836" strokeWidth="6"/>
   <path d="M-12 99L17 102" stroke="#92b1b4" strokeWidth="5" opacity=".6"/>
   <g transform="translate(1 118)"><path d="M-17 -8Q-21 12 -1 16Q13 18 18 -4L8 -12Z" fill="url(#a6Skin)"/></g>
   {handPose&&<g transform="translate(13 92) rotate(16)"><rect x="-15" y="-49" width="56" height="103" rx="10" fill="#0b1b29" stroke="#6bd1d4" strokeWidth="6"/><rect x="-6" y="-36" width="38" height="74" rx="3" fill="url(#a6Phone)"/><circle cx="13" cy="10" r="12" fill="#d8faff" opacity=".48"/><path d="M-11 18L4 1" stroke="#b8faff" strokeWidth="3"/></g>}
  </g></g>
  {/* torso */}
  <path d="M-75 -376Q-49 -390 -14 -389L32 -384Q72 -385 83 -345L91 -186Q24 -148 -87 -179L-89 -320Q-89 -356 -75 -376Z" fill="url(#a6Coat)" stroke="#172c3c" strokeWidth="7"/>
  <path d="M-83 -348Q-45 -336 -15 -314Q33 -295 80 -350" stroke="#aec5c5" strokeWidth="6" opacity=".24" fill="none"/>
  <path d="M-24 -379Q0 -351 10 -332L14 -180" stroke="#0b2434" strokeWidth="12" fill="none"/>
  <path d="M-17 -377L-6 -328L-6 -215" stroke="#88a5a9" strokeWidth="3" opacity=".54" fill="none"/>
  <path d="M-76 -220Q-25 -206 22 -213L78 -225" stroke="#111e2d" strokeWidth="10" fill="none"/>
  <path d="M-75 -285L-19 -279L-17 -241L-67 -245Z" fill="#304f60" stroke="#162b39" strokeWidth="4"/>
  <path d="M38 -286L75 -291L74 -249L38 -249Z" fill="#324f5f" stroke="#172b37" strokeWidth="4"/>
  <path d="M-64 -274L-24 -271M44 -276L68 -280" stroke="#a8c8c1" strokeWidth="3" opacity=".35"/>
  <path d="M-47 -373Q-43 -298 -51 -211" fill="none" stroke="#0e2330" strokeWidth="11" opacity=".62"/>
  <path d="M-48 -366L-31 -324" stroke="#92a3aa" strokeWidth="6" opacity=".55"/>
  <path d="M-10 -183L-10 -200M24 -182L28 -200" stroke="#a8c0b5" strokeWidth="5"/>
  {/* neck and scarf */}
  <path d="M-28 -433L-26 -379Q-1 -357 30 -379L24 -438" fill="url(#a6Skin)" stroke="#9c7772" strokeWidth="3"/>
  <path d="M-49 -385Q-15 -414 35 -391Q46 -375 25 -366Q-4 -354 -41 -369Z" fill="#172a38" stroke="#627a7b" strokeWidth="5"/>
  <path d="M-16 -372Q-2 -343 1 -312" stroke="#182b34" strokeWidth="19" strokeLinecap="round"/>
  {/* head tilt + turning, animated independently from body */}
  <g transform={`translate(0 -469) rotate(${headTurn + flinch*.5})`}>
   <ellipse cx="-69" cy="0" rx="16" ry="22" fill="url(#a6Skin)" stroke="#b08278" strokeWidth="3"/>
   <ellipse cx="69" cy="0" rx="16" ry="22" fill="url(#a6Skin)" stroke="#b08278" strokeWidth="3"/>
   <path d="M-68 -38Q-64 -92 3 -100Q72 -92 76 -31L68 36Q38 87 0 88Q-42 84 -68 37Z" fill="url(#a6Skin)" stroke="#8c6969" strokeWidth="4"/>
   <path d="M-50 37Q-8 77 42 43" fill="none" stroke="#f3c6ad" strokeWidth="5" opacity=".36"/>
   {/* warm/cyan rim underlit profile */}
   <path d="M-61 -37Q-54 -68 -28 -85M58 -23Q68 -10 62 27" stroke="#b7f3e9" strokeWidth="7" opacity=".42" fill="none"/>
   {/* eyebrows are expressive */}
   <path d={eyesWide?'M-48 -21Q-30 -36 -13 -25':'M-48 -17Q-30 -29 -13 -20'} stroke="#2a2b36" strokeWidth="8" strokeLinecap="round" fill="none"/>
   <path d={eyesWide?'M15 -26Q32 -39 48 -24':'M15 -19Q33 -29 50 -17'} stroke="#2a2b36" strokeWidth="8" strokeLinecap="round" fill="none"/>
   <ellipse cx="-31" cy="-4" rx="15" ry={eyesWide?15:12} fill="#f4f4e7"/>
   <ellipse cx="32" cy="-4" rx="15" ry={eyesWide?15:12} fill="#f4f4e7"/>
   <circle cx="-28" cy="-3" r="8" fill="#3d4c46"/><circle cx="33" cy="-3" r="8" fill="#3d4c46"/>
   <circle cx="-25" cy="-7" r="3.2" fill="#fcffff"/><circle cx="36" cy="-7" r="3.2" fill="#fcffff"/>
   <path d="M0 3Q-5 19 2 24L13 21" stroke="#a47771" strokeWidth="4" fill="none" strokeLinecap="round"/>
   <path d={eyesWide?'M-15 52Q0 39 18 53Q4 67 -15 52':'M-14 51Q0 47 15 50'} stroke="#824c52" strokeWidth="4" fill={eyesWide?'#6b3741':'none'} strokeLinecap="round"/>
   {/* freckles and blush */}
   {[-1,1].map((side,i)=><g key={i} opacity=".45" transform={`translate(${side*35} 29)`}>{[0,1,2].map((k)=><circle key={k} cx={k*6-6} cy={k%2?3:0} r="2" fill="#9c6b62"/>)}</g>)}
   {/* distinctive uneven sculpted hair, 2.5D layers */}
   <path d="M-72 -9Q-94 -62 -52 -98Q-53 -130 -9 -125Q17 -151 50 -123Q91 -121 85 -65L71 -9L58 -59Q41 -59 28 -47Q2 -48 -11 -62Q-35 -31 -67 -39Z" fill="url(#a6Hair)" stroke="#101c29" strokeWidth="6"/>
   <path d="M-68 -66Q-82 -118 -35 -129L-7 -101Q-15 -134 20 -139Q39 -122 40 -108Q69 -125 78 -87" fill="none" stroke="#53626b" strokeWidth="10" opacity=".45" strokeLinecap="round"/>
   <path d="M-66 -76Q-46 -55 -35 -58Q-14 -73 -5 -59Q12 -77 27 -74Q48 -59 68 -69" stroke="#0f1c28" strokeWidth="13" fill="none" strokeLinecap="round"/>
   <path d="M-40 -124Q-45 -107 -31 -97M14 -129Q4 -109 8 -94M47 -111Q40 -91 50 -84" stroke="#75808a" strokeWidth="4" opacity=".4" fill="none" strokeLinecap="round"/>
  </g>
  {/* glow on hand when phone is raised */}
  {handPose&&<circle cx="127" cy="-328" r="165" fill="url(#a6PhoneGlow)" opacity=".5" style={{pointerEvents:'none'}}/>}
 </g>;
};

export const CinematicGrain=()=> <AbsoluteFill style={{pointerEvents:'none',backgroundImage:`url("${staticFile('grain.png')}")`,backgroundRepeat:'repeat',backgroundSize:'410px 410px',opacity:.18,mixBlendMode:'screen'}}/>;
