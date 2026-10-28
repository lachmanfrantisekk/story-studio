import React from 'react';
import storyboard from '../storyboard.json';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';
import {ArtDefs, IllustratedForest, IllustratedAdam, CinematicGrain} from './visuals';

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

// Original stylized game-illustration assets (A6) live in visuals.jsx.
// An articulated character rig is drawn in SVG at every frame, not an image zoom.

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
 const type=shot.type;
 const local=frame-shot.start;
 const near=['shock','eyes','suspicion','listen','turn','reveal','behind','shadow'].includes(type);
 const motion=['walk','pace','pursuit','run','trip'].includes(type);
 const actorTypes=['establish','walk','footsteps','rear','shock','eyes','listen','behind','shadow','pace','pursuit','run','trip','suspicion','turn','reveal','blackout'];
 const actor=actorTypes.includes(type);
 const phoneShot=['phoneclose','textclose','map','mapzoom','mapbehind','unlock','vibrate'].includes(type);
 const focus={
   establish:{x:565,y:1575,s:.72},walk:{x:510,y:1535,s:1.24},footsteps:{x:475,y:1740,s:1.62},rear:{x:560,y:1550,s:1.05},
   shock:{x:510,y:1820,s:2.25},eyes:{x:515,y:1870,s:2.9},listen:{x:560,y:1710,s:1.65},behind:{x:380,y:1540,s:.92},
   shadow:{x:445,y:1540,s:.82},pace:{x:475,y:1550,s:1.27},pursuit:{x:460,y:1515,s:1.18},run:{x:430,y:1540,s:1.25},trip:{x:470,y:1540,s:1.32},
   suspicion:{x:490,y:1750,s:1.9},turn:{x:500,y:1760,s:1.85},reveal:{x:290,y:1580,s:.97},blackout:{x:505,y:1600,s:1.2}
 }[type]||{x:500,y:1510,s:1.2};
 const jitter=motion?Math.sin(local*.31)*7:Math.sin(local*.03)*2;
 const slowCamera=tr(local,0,shot.end-shot.start,0,phoneShot?.04:.02);
 const fadeBlack=type==='blackout'?tr(local,7,31,.18,1):type==='reveal'?.1:0;
 const accent=['vibrate','shock','eyes','suspicion','textclose'].includes(type);
 return <AbsoluteFill style={{background:'#071421',overflow:'hidden'}}>
   <AbsoluteFill style={{transform:`scale(${1+slowCamera}) translateX(${jitter}px)`}}><IllustratedForest frame={frame} shot={shot}/></AbsoluteFill>
   {actor&&<svg viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible'}}>
      <ArtDefs/>
      <ellipse cx={focus.x} cy={focus.y-420*focus.s} rx={220*focus.s} ry={345*focus.s} fill={accent?'#7bdce2':'#d1ad7f'} opacity={accent?.16:.045} filter="url(#a6SoftGlow)"/>
      <g transform={`translate(${focus.x+jitter} ${focus.y}) scale(${focus.s})`}>
       <IllustratedAdam frame={local} mode={type} fright={near} phone={['shock','suspicion','listen','turn'].includes(type)} turn={type==='turn'?24:0}/>
      </g>
   </svg>}
   {phoneShot&&<><AbsoluteFill style={{background:'#061525',opacity:.44}}/><Phone frame={local} showText={type==='textclose'} map={['map','mapzoom','mapbehind','unlock'].includes(type)} zoom={type==='mapzoom'||type==='mapbehind'}/></>}
   {accent&&<AbsoluteFill style={{background:'radial-gradient(circle at 52% 68%,#74dded24,transparent 70%)',mixBlendMode:'screen'}}/>}
   {type==='vibrate'&&<AbsoluteFill style={{background:'#c1f8ff',opacity:Math.max(0,.11*Math.sin(local*.6))}}/>}
   <CinematicGrain/>
   {fadeBlack>0&&<AbsoluteFill style={{background:'#01070e',opacity:fadeBlack}}/>}
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
 <World frame={380} shot={{type:'suspicion',start:370,end:500}}/><AbsoluteFill style={{background:'linear-gradient(180deg,#04101bea,transparent 38%,#06142011 57%,#04101bee)'}}/>
 <Head frame={0}/>
 <div style={{position:'absolute',top:310,left:65,right:65,fontSize:78,fontWeight:950,lineHeight:1.06,color:WHITE,textShadow:'0 7px 22px #000'}}>{storyboard.series.coverHook}</div>
 <div style={{position:'absolute',bottom:290,left:65,right:65,height:8,background:CYAN}}/>
 <div style={{position:'absolute',bottom:165,left:65,right:65,fontSize:85,fontWeight:950,color:WHITE,textShadow:'0 6px 25px #000'}}>{storyboard.series.title}</div>
 <div style={{position:'absolute',bottom:73,left:65,right:65,display:'flex',justifyContent:'space-between',fontWeight:950,fontSize:40,color:CORAL}}><span>PART {pad(storyboard.series.part)}</span><span style={{fontSize:28,color:WHITE}}>@mimosignal</span></div>
 </AbsoluteFill>;
const Root=()=> <><Composition id="Pilot" component={Pilot} durationInFrames={TOTAL} fps={FPS} width={W} height={H}/><Composition id="Cover" component={Cover} durationInFrames={1} fps={FPS} width={W} height={H}/></>;
registerRoot(Root);
