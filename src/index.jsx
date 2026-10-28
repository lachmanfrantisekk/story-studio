import React from 'react';
import storyboard from '../storyboard.json';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';

// A5: each of the 6 narration beats has four distinct, directed shots.
// Never present a 12.5-second narration beat as one unchanging shot.
const W=1080, H=1920, FPS=storyboard.fps;
const BEAT=storyboard.secondsPerScene;
const TOTAL=Math.round(BEAT*FPS*storyboard.scenes.length);
const OUTRO=Math.round(storyboard.endCardSeconds*FPS);
const CYAN='#83e7e4', CORAL='#ff7180', WHITE='#f2fbff';
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
const tr=(f,a,b,x=0,y=1)=>interpolate(f,[a,b],[x,y],clamp);
const pad=(n)=>String(n).padStart(2,'0');
const shots=[
  // Shot durations in each beat sum to 12.5 seconds.
  [{d:2.5,type:'establish',cap:'02:07 • CESTA DOMŮ'}, {d:3.0,type:'walk',cap:'ADAM ŠEL SÁM.'}, {d:4,type:'footsteps',cap:'LES BYL NEZVYKLE TICHO.'}, {d:3,type:'rear',cap:'PAK SE OZVAL TELEFON.'}],
  [{d:2,type:'vibrate',cap:'NOVÁ ZPRÁVA'}, {d:3.5,type:'phoneclose',cap:'ODESÍLATEL: ADAM'}, {d:4,type:'shock',cap:'JEHO VLASTNÍ ČÍSLO.'}, {d:3,type:'behind',cap:'ZA NÍM NĚCO PRASKLO.'}],
  [{d:3,type:'textclose',cap:'NEOTÁČEJ SE.'}, {d:3,type:'eyes',cap:'ZTUHL.'}, {d:3.5,type:'listen',cap:'NĚKDO ZA NÍM DÝCHAL.'}, {d:3,type:'shadow',cap:'ALE NEVIDĚL NIKOHO.'}],
  [{d:3,type:'pace',cap:'PŘIDAL DO KROKU.'}, {d:3,type:'pursuit',cap:'KROKY ZRYCHLILY.'}, {d:3.5,type:'run',cap:'ROZBĚHL SE.'}, {d:3,type:'trip',cap:'TELEFON ZNOVU ZAVIBROVAL.'}],
  [{d:2.5,type:'unlock',cap:'OTEVŘEL MAPU.'}, {d:3,type:'map',cap:'DVĚ MODRÉ TEČKY.'}, {d:4,type:'mapzoom',cap:'OBĚ NESLY JEHO JMÉNO.'}, {d:3,type:'suspicion',cap:'DRUHÁ SE PŘIBLIŽOVALA.'}],
  [{d:3,type:'mapbehind',cap:'BYLA PŘÍMO ZA NÍM.'}, {d:3,type:'turn',cap:'POMALU SE OTOČIL.'}, {d:4,type:'reveal',cap:'V TEMNOTĚ SE NĚCO POHNULO.'}, {d:2.5,type:'blackout',cap:'SIGNÁL ZMIZEL.'}],
].flatMap((group,beat)=>group.map((s,i)=>({...s,beat,index:beat*4+i})));
let sec=0;
const SHOTS=shots.map(s=>{const entry={...s,start:Math.round(sec*FPS),end:Math.round((sec+s.d)*FPS)};sec+=s.d;return entry});
if(Math.abs(sec-75)>.01)throw new Error('Shots must total exactly 75 seconds');
const activeShot=(f)=>SHOTS.find(s=>f>=s.start&&f<s.end)||SHOTS.at(-1);
const SignalIcon=({size=70})=><svg viewBox="0 0 100 100" width={size} height={size}><g fill="none" stroke={CYAN} strokeWidth="7" strokeLinecap="round"><path d="M10 36Q50 0 90 36"/><path d="M24 52Q50 27 76 52"/><path d="M38 67Q50 55 62 67"/></g><circle cx="50" cy="84" r="7" fill={CYAN}/><path d="M72 6L56 49" stroke={CORAL} strokeWidth="8" strokeLinecap="round"/></svg>;

const Pine=({x,y,s=1,tone='#153345'})=><g transform={`translate(${x} ${y}) scale(${s})`}>
  <path d="M-7 0L-7 -260L7 -260L7 0" fill="#13202b"/>
  <path d="M0 -620L-132 -260L-76 -263L-165 -90L165 -90L76 -263L132 -260Z" fill={tone} stroke="#0b2631" strokeWidth="6"/>
  <path d="M0 -620L-78 -318L-43 -330" stroke="#567b85" strokeWidth="5" opacity=".22" fill="none"/>
</g>;
const Mist=({f,layer=0})=><g opacity={layer?.14:.23}>{Array.from({length:7},(_,i)=><ellipse key={i} cx={((i*287+f*(layer?-.28:.36))%1700)-250} cy={870+(i%4)*165} rx={260+i%3*85} ry={65+i%2*15} fill="#d6faff"/>)}</g>;
const Trees=({f,near=false})=><g transform={`translate(${near?-(f*.85)%260:-(f*.14)%75} 0)`}>
 {Array.from({length:12},(_,i)=><Pine key={i} x={i*145-230} y={near?1480+(i%3)*175:1210+(i%3)*70} s={near?.9+(i%3)*.23:.61+(i%3)*.09} tone={near?(i%2?'#0b2733':'#102c33'):(i%2?'#244655':'#173c4b')}/>)}
 </g>;

// Articulated original vector puppet. Arms and legs rotate at independently animated pivots;
// this is actual limb motion, not image pan/zoom.
const Hero=({frame=0,mode='walk',small=false,side='right',phone=false,fright=false})=>{
 const running=['run','pace','pursuit','trip'].includes(mode);
 const moving=running||mode==='walk';
 const stride=running?.35:.17, p=frame*stride;
 const ang=moving?Math.sin(p)*(running?31:18):mode==='turn'?tr(frame,0,85,0,18):0;
 const bob=moving?Math.abs(Math.sin(p))* (running?13:7):Math.sin(frame*.04)*2;
 const tilt=running?10:fright?-6:0;
 const eyesWide=fright||['shock','eyes','reveal'].includes(mode);
 return <g transform={`translate(0 ${-bob}) scale(${small?.72:1}) rotate(${tilt})`}>
 <ellipse cx="0" cy="10" rx="106" ry="24" fill="#081a23" opacity=".7"/>
 <g transform="translate(-35 -170)" strokeLinecap="round"><g transform={`rotate(${ang},0,0)`}><path d="M0 0L-17 160" stroke="#263743" strokeWidth="36"/><path d="M-17 160L-30 185" stroke="#121921" strokeWidth="28"/></g></g>
 <g transform="translate(35 -170)" strokeLinecap="round"><g transform={`rotate(${-ang},0,0)`}><path d="M0 0L11 160" stroke="#263743" strokeWidth="36"/><path d="M11 160L32 185" stroke="#121921" strokeWidth="28"/></g></g>
 <path d="M-68 -370Q0 -396 70 -370L88 -168Q5 -135 -78 -166Z" fill="#315666" stroke="#7098a4" strokeWidth="6"/>
 <path d="M-60 -354L0 -309L63 -354" fill="none" stroke="#1d3541" strokeWidth="12"/>
 <path d="M-55 -370Q-100 -343 -99 -280Q-88 -235 -60 -229" fill="none" stroke="#142c3a" strokeWidth="19"/>
 <g transform="translate(-71 -353)"><g transform={`rotate(${-ang*.72-8})`}><path d="M0 0L-17 129" stroke="#315666" strokeWidth="33" strokeLinecap="round"/><circle cx="-17" cy="133" r="17" fill="#d9b19b"/></g></g>
 <g transform="translate(71 -353)"><g transform={`rotate(${phone?-48:ang*.72+8})`}><path d="M0 0L16 127" stroke="#315666" strokeWidth="33" strokeLinecap="round"/><circle cx="16" cy="134" r="17" fill="#d9b19b"/></g></g>
 <path d="M-25 -438L-28 -377L32 -377L23 -438" fill="#d7ab97"/>
 <ellipse cx="0" cy="-470" rx="76" ry="91" fill="#e4bba5" stroke="#9b7168" strokeWidth="4"/>
 <path d="M-74 -469Q-102 -558 -29 -577Q34 -594 74 -534Q83 -507 70 -475L35 -529Q-22 -505 -74 -469Z" fill="#131f2c"/>
 <path d="M-55 -526Q-21 -552 12 -551" fill="none" stroke="#344457" strokeWidth="9" opacity=".6"/>
 <ellipse cx="-27" cy="-463" rx="9" ry={eyesWide?11:7} fill="#17232f"/>
 <ellipse cx="28" cy="-463" rx="9" ry={eyesWide?11:7} fill="#17232f"/>
 <path d={eyesWide?'M-14 -424Q0 -436 14 -424':'M-12 -426Q0 -418 12 -426'} stroke="#734945" fill="none" strokeWidth="4" strokeLinecap="round"/>
 {phone&&<g transform="translate(111 -306) rotate(-8)"><rect x="-12" y="-4" width="58" height="108" rx="9" fill="#071928" stroke="#7cd8e4" strokeWidth="5"/><rect x="-4" y="7" width="42" height="82" rx="3" fill="#2f8f9d"/><circle cx="17" cy="51" r="7" fill={CORAL}/></g>}
 </g>;
};

const Phone=({frame,showText=false,map=false,zoom=false})=>{
 const pulse=.65+.35*Math.sin(frame*.12);
 return <div style={{position:'absolute',left:112,top:330,width:855,height:1220,transform:`rotate(${Math.sin(frame*.025)*1.5}deg) scale(${1+tr(frame,0,120,0,.045)})`,background:'#091924',border:'24px solid #1d343f',boxShadow:'0 30px 120px #000, inset 0 0 80px #07101b',borderRadius:80,color:'#edfcff',overflow:'hidden'}}>
  <div style={{height:90,padding:'22px 52px',fontSize:26,color:'#87a9b8',display:'flex',justifyContent:'space-between'}}><span>02:07</span><span>◔ ▴  ▰</span></div>
  {map?<>
    <div style={{position:'absolute',inset:'125px 0 0',background:'repeating-linear-gradient(0deg,transparent,transparent 85px,#385361 87px),repeating-linear-gradient(90deg,#1a3540,#1a3540 115px,#304651 117px)',transform:zoom?'scale(1.12)':'none'}}/>
    <div style={{position:'absolute',top:145,left:35,fontSize:35,fontWeight:900}}>ŽIVÁ POLOHA</div>
    <div style={{position:'absolute',top:630,left:480,width:35,height:35,background:CORAL,borderRadius:'50%',boxShadow:`0 0 ${50*pulse}px ${25*pulse}px #ff718088`}}/>
    <div style={{position:'absolute',top:zoom?710:840,left:zoom?425:265,width:35,height:35,background:CYAN,borderRadius:'50%',boxShadow:`0 0 50px 20px #83e7e477`}}/>
    <div style={{position:'absolute',bottom:105,left:55,right:55,borderRadius:25,background:'#071722ee',padding:27,fontSize:36,fontWeight:900}}>ADAM · ADAM <span style={{color:CORAL}}>●</span></div>
   </>:<>
    <div style={{padding:'50px 55px',fontSize:30,color:CYAN,letterSpacing:3}}>NOVÁ ZPRÁVA</div>
    <div style={{padding:'0 55px',fontSize:47,fontWeight:900}}>ODESÍLATEL</div>
    <div style={{padding:'18px 55px',fontSize:68,fontWeight:950}}>ADAM</div>
    <div style={{height:2,margin:'28px 55px',background:'#567783'}}/>
    <div style={{padding:'45px 60px',fontSize:showText?88:45,lineHeight:1.14,fontWeight:950,color:showText?CORAL:WHITE}}>{showText?'NEOTÁČEJ SE.':'Máte novou zprávu.'}</div>
    <div style={{position:'absolute',bottom:105,left:55,fontSize:28,color:'#709ba6'}}>ZPRÁVA PŘIJATA · 02:07</div>
   </>}
 </div>;
};
const World=({frame,shot})=>{
 const f=frame, type=shot.type;
 const close=['eyes','shock','suspicion','turn','reveal'].includes(type);
 const rear=['rear','behind','shadow','listen'].includes(type);
 const move=['walk','pace','pursuit','run','trip'].includes(type);
 const moonShift=Math.sin(f*.003)*24;
 const cam=(type==='establish'?-.03:type==='pursuit'?.11:type==='reveal'?.07:0)+tr(frame,shot.start,shot.end,0,.035);
 const flash=type==='vibrate' || type==='trip';
 const dark=type==='reveal'||type==='blackout';
 return <AbsoluteFill style={{background:'#0b1925',overflow:'hidden'}}>
 <svg viewBox="0 0 1080 1920" preserveAspectRatio="xMidYMid slice" style={{width:'100%',height:'100%',transform:`scale(${1+cam})`}}>
  <defs><linearGradient id="skyA5" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#071628"/><stop offset=".66" stopColor="#294855"/><stop offset="1" stopColor="#56696b"/></linearGradient><radialGradient id="haloA5"><stop stopColor="#c9f8ff" stopOpacity=".35"/><stop offset="1" stopColor="#91d1e5" stopOpacity="0"/></radialGradient><linearGradient id="pathA5"><stop stopColor="#53676a"/><stop offset="1" stopColor="#293a42"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#skyA5)"/>
  <circle cx={800+moonShift} cy="340" r="350" fill="url(#haloA5)"/>
  <circle cx={800+moonShift} cy="340" r="72" fill="#b6d5dc"/>
  <path d="M0 1050Q260 820 540 1020T1080 935V1450H0" fill="#203f4c"/>
  <Trees f={f}/><Mist f={f}/>
  <path d="M0 1920L385 1130H705L1080 1920Z" fill="url(#pathA5)"/>
  <path d="M410 1920L495 1130" stroke="#aec6cb" strokeWidth="9" opacity=".22"/>
  <path d="M710 1920L572 1130" stroke="#aec6cb" strokeWidth="9" opacity=".16"/>
  {['footsteps','rear','behind'].includes(type)&&<g><ellipse cx="520" cy="1540" rx="21" ry="39" fill="#071a24" opacity=".7"/><ellipse cx="597" cy="1630" rx="27" ry="43" fill="#071a24" opacity=".75"/></g>}
  {['behind','shadow','pursuit','mapbehind','reveal'].includes(type)&&<g opacity={type==='reveal'?.82:.3} transform={`translate(${type==='reveal'?740:850} 1270) scale(${type==='reveal'?1.4:.78})`}><ellipse cy="-335" rx="52" ry="65" fill="#030a12"/><path d="M-72 -320Q0 -345 72 -320L99 10H-99Z" fill="#030a12"/><circle cx="-20" cy="-340" r="6" fill={CORAL}/><circle cx="23" cy="-340" r="6" fill={CORAL}/></g>}
  {['walk','pace','pursuit','run','trip','shock','suspicion','listen','turn','reveal','rear','behind','eyes','shadow','establish','footsteps'].includes(type)&&<g transform={`translate(${close?525:move?460+Math.sin(f*.025)*40:520} ${close?1510:1500}) scale(${close?1.7:type==='establish'?.58:1.14})`}><Hero frame={f-shot.start} mode={type} fright={close||rear} small={false} phone={type==='suspicion'||type==='shock'}/></g>}
  <Trees f={-f} near/><Mist f={f} layer={1}/>
  {dark&&<rect width="1080" height="1920" fill="#020811" opacity={type==='blackout'?tr(f-shot.start,0,22,0,.98):.26}/>}
 </svg>
 {['phoneclose','textclose','map','mapzoom','mapbehind','unlock','vibrate'].includes(type)&&<Phone frame={f-shot.start} showText={type==='textclose'} map={['map','mapzoom','mapbehind','unlock'].includes(type)} zoom={type==='mapzoom'||type==='mapbehind'}/>}
 {flash&&<AbsoluteFill style={{background:'#80edee',opacity:Math.max(0,.25*Math.sin((f-shot.start)*.62))}}/>}
 </AbsoluteFill>;
};
const Head=({frame})=><div style={{position:'absolute',top:105,left:64,right:64,display:'flex',justifyContent:'space-between',alignItems:'center',color:WHITE,textShadow:'0 4px 30px #000',pointerEvents:'none'}}><div style={{display:'flex',gap:13,alignItems:'center'}}><SignalIcon size={57}/><span style={{fontSize:28,fontWeight:950,letterSpacing:3}}>MIMO SIGNÁL</span></div><span style={{fontSize:23,color:CYAN,fontWeight:850,letterSpacing:2}}>MS-001 · PART 01</span></div>;
const Subtitles=({frame,shot})=>{
 // Remains on-screen only for its own short shot, instead of whole 12.5-sec scenes.
 const local=frame-shot.start;
 const appear=spring({frame:local,fps:FPS,config:{damping:200,mass:.65}});
 const leave=tr(local,(shot.end-shot.start)-10,(shot.end-shot.start),1,.1);
 const text=shot.cap;
 return <div style={{position:'absolute',bottom:295,left:55,right:55,textAlign:'center',transform:`translateY(${22*(1-appear)}px)`,opacity:appear*leave}}>
 <span style={{display:'inline-block',fontSize:57,lineHeight:1.12,letterSpacing:0,fontWeight:950,padding:'16px 22px',color:text.includes('NEOTÁČEJ')?CORAL:WHITE,background:'#061321b8',boxShadow:'0 6px 30px #0006',borderRadius:11,textShadow:'0 5px 16px #000'}}>{text}</span></div>;
};
const EndCard=({frame})=>{
 const local=frame-(TOTAL-OUTRO);
 const a=spring({frame:Math.max(0,local),fps:FPS,config:{damping:150}});
 return <AbsoluteFill style={{background:'radial-gradient(circle at 50% 32%,#1b4552 0%,#061420 70%)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',textAlign:'center',color:WHITE,fontFamily:'Arial,sans-serif'}}>
  <SignalIcon size={142}/><div style={{color:CYAN,fontSize:30,letterSpacing:8,fontWeight:900,marginTop:17}}>MIMO SIGNÁL</div>
  <div style={{fontSize:86,fontWeight:950,lineHeight:1.06,margin:'92px 65px 20px',transform:`scale(${.94+.06*a})`,opacity:a}}>{storyboard.series.endHook}</div>
  <div style={{height:8,width:370,background:CORAL,margin:45}}/>
  <div style={{fontSize:65,fontWeight:950,color:CORAL}}>PART {pad(storyboard.series.nextPart)}</div>
  <div style={{fontSize:38,fontWeight:800,marginTop:16}}>POKRAČOVÁNÍ PŘÍŠTĚ</div>
  <div style={{position:'absolute',bottom:160,fontSize:27,color:'#afcdd5'}}>@mimosignal</div>
 </AbsoluteFill>
};
const Pilot=()=>{
 const frame=useCurrentFrame();
 const shot=activeShot(frame);
 return <AbsoluteFill style={{fontFamily:'Arial,sans-serif',background:'#081623'}}>
  <World frame={frame} shot={shot}/>
  <Head frame={frame}/>
  <Subtitles frame={frame} shot={shot}/>
  {frame>=TOTAL-OUTRO&&<EndCard frame={frame}/>}
 </AbsoluteFill>;
};
const Cover=()=> <AbsoluteFill style={{fontFamily:'Arial,sans-serif',background:'#091525'}}>
 <World frame={800} shot={{type:'reveal',start:750,end:900}}/><AbsoluteFill style={{background:'linear-gradient(180deg,#071320bb,transparent 38%,#07132011 58%,#071320ee)'}}/>
 <Head frame={0}/>
 <div style={{position:'absolute',top:310,left:65,right:65,fontSize:81,fontWeight:950,lineHeight:1.06,color:WHITE,textShadow:'0 7px 22px #000'}}>{storyboard.series.coverHook}</div>
 <div style={{position:'absolute',bottom:290,left:65,right:65,height:8,background:CYAN}}/>
 <div style={{position:'absolute',bottom:165,left:65,right:65,fontSize:85,fontWeight:950,color:WHITE,textShadow:'0 6px 25px #000'}}>{storyboard.series.title}</div>
 <div style={{position:'absolute',bottom:73,left:65,right:65,display:'flex',justifyContent:'space-between',fontWeight:950,fontSize:40,color:CORAL}}><span>PART {pad(storyboard.series.part)}</span><span style={{fontSize:28,color:WHITE}}>@mimosignal</span></div>
 </AbsoluteFill>;
const Root=()=> <><Composition id="Pilot" component={Pilot} durationInFrames={TOTAL} fps={FPS} width={W} height={H}/><Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={W} height={H}/></>;
registerRoot(Root);
