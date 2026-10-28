import React from 'react';
import storyboard from '../storyboard.json';
import {registerRoot, Composition, AbsoluteFill, useCurrentFrame, interpolate, spring} from 'remotion';

const W = 1080;
const H = 1920;
const D = Math.round(storyboard.secondsPerScene * storyboard.fps);
const TOTAL = D * storyboard.scenes.length;
const OUTRO = Math.round((storyboard.endCardSeconds || 2.5) * storyboard.fps);
const B = storyboard.brand;
const S = storyboard.series;
const BRAND = '#64eadf';
const RED = '#ff687b';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const padPart = (n) => String(n).padStart(2, '0');

const SignalMark = ({size=80}) => (
  <svg viewBox="0 0 120 120" width={size} height={size} aria-label="MIMO SIGNÁL">
    <path d="M18 45A52 52 0 0 1 102 37 M30 60A35 35 0 0 1 88 52 M44 73A17 17 0 0 1 74 67" fill="none" stroke={BRAND} strokeWidth="8" strokeLinecap="round"/>
    <circle cx="60" cy="83" r="8" fill={BRAND}/>
    <path d="M84 9L62 58" stroke={RED} strokeWidth="10" strokeLinecap="round"/>
  </svg>
);

// Drawn from original SVG primitives: independent moving limbs and shifting surroundings.
const Person = ({f, idx, cover=false}) => {
  const running = idx===3 || idx===4;
  const walking = idx===0 || idx===1;
  const moving = running || walking;
  const phase = f*(running?.32:.14);
  const swing = moving ? Math.sin(phase)*(running?28:16) : 0;
  const bob = moving ? Math.abs(Math.sin(phase))*6 : 0;
  const x = cover?660:idx===3?interpolate(f,[0,D],[340,650],clamp):idx===4?580:520;
  const jitter = (idx===2||idx===5) ? Math.sin(f*.09)*2 : 0;
  return <g transform={`translate(${x+jitter} ${1180-bob})`}>
    <ellipse cx="0" cy="25" rx="105" ry="22" fill="#07101e" opacity=".55"/>
    <g stroke="#192539" strokeWidth="32" strokeLinecap="round">
      <line x1="-23" y1="-115" x2={-25+swing} y2="10"/>
      <line x1="25" y1="-115" x2={25-swing} y2="10"/>
    </g>
    <path d="M-74 -310 Q0 -345 74 -310 L64 -105 L-62 -105Z" fill="#4b7188" stroke="#a3c6d1" strokeWidth="5"/>
    <path d="M-70 -300Q-95 -250 -92 -194" stroke="#274054" strokeWidth="16" fill="none"/>
    <g stroke="#d6ac94" strokeWidth="26" strokeLinecap="round">
      <line x1="-65" y1="-285" x2={-92-swing} y2="-160"/>
      <line x1="65" y1="-285" x2={88+swing} y2="-170"/>
    </g>
    <rect x="-32" y="-382" width="64" height="76" rx="27" fill="#d6ac94"/>
    <ellipse cx="0" cy="-406" rx="65" ry="80" fill="#d6ac94"/>
    <path d="M-65 -412 Q-70 -505 0 -493 Q79 -490 64 -407 Q20 -450 -65 -412" fill="#1b2533"/>
    <circle cx="-22" cy="-401" r="5" fill="#182231"/>
    <circle cx="22" cy="-401" r="5" fill="#182231"/>
    {(idx===1||idx===2||idx===4||cover) && <g>
      <rect x="65" y="-230" width="55" height="90" rx="8" fill="#101d31" stroke="#8de7f4" strokeWidth="5"/>
      <rect x="73" y="-218" width="39" height="65" rx="3" fill="#2a8da8"/>
      <circle cx="92" cy="-184" r="6" fill="#ff687b"/>
    </g>}
  </g>;
};

const Forest = ({frame=0,idx=0,cover=false}) => (
  <svg viewBox="0 0 1080 1920" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="sky" x2="0" y2="1"><stop stopColor="#081325"/><stop offset="1" stopColor="#25465b"/></linearGradient>
      <radialGradient id="moon"><stop stopColor="#b9eaf0" stopOpacity=".55"/><stop offset="1" stopColor="#b9eaf0" stopOpacity="0"/></radialGradient>
      <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#010710" stopOpacity=".74"/><stop offset=".42" stopColor="#010710" stopOpacity=".06"/><stop offset="1" stopColor="#010710" stopOpacity=".9"/></linearGradient>
    </defs>
    <rect width="1080" height="1920" fill="url(#sky)"/>
    <circle cx="810" cy="360" r="290" fill="url(#moon)"/>
    <circle cx="810" cy="360" r="70" fill="#c2e6e8"/>
    {Array.from({length:10},(_,i)=><g key={i} transform={`translate(${i*155-100+(frame*.25*(i%2?1:-1))%120} 0)`}>
      <path d={`M0 1240 L${-100-i*2} 1240 L-15 ${350+(i%3)*100} L25 ${350+(i%3)*100} L100 1240Z`} fill={i%2?'#132b39':'#102635'}/>
      <path d={`M-160 720 L0 ${200+i*23} L160 720Z`} fill={i%2?'#183445':'#143040'}/>
    </g>)}
    <path d="M0 1920 L340 1160 L740 1160 L1080 1920Z" fill="#263e48"/>
    <path d="M0 1920 L430 1160 L660 1160 L1080 1920Z" fill="#45545a"/>
    <g opacity=".18">{Array.from({length:16},(_,i)=><ellipse key={i} cx={((i*223+frame*(i%2?-.5:.6))%1350)-120} cy={700+i*75} rx="220" ry="25" fill="#d5f4fa"/>)}</g>
    <Person f={frame % D} idx={idx} cover={cover}/>
    {cover && <g><circle cx="867" cy="690" r="15" fill={RED}/><path d="M867 687v-160" stroke={RED} strokeWidth="5" strokeDasharray="16 10" opacity=".7"/></g>}
    {idx===5&&!cover && <rect width="1080" height="1920" fill="#030711" opacity={interpolate(frame%D,[240,330],[0,.95],clamp)}/>}
    {cover && <rect width="1080" height="1920" fill="url(#shade)"/>}
  </svg>
);

const Headbar = ({staticMode=false}) => (
  <div style={{position:'absolute',top:104,left:64,right:64,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
    <div style={{display:'flex',gap:14,alignItems:'center'}}><SignalMark size={72}/><span style={{color:'#efffff',fontSize:32,fontWeight:900,letterSpacing:4}}>{B.name}</span></div>
    <div style={{fontSize:21,color:BRAND,fontWeight:800,letterSpacing:2}}>{staticMode?S.genre:S.episodeCode}</div>
  </div>
);

const EndCard = ({frame=0}) => {
  const start = TOTAL - OUTRO;
  const local = frame - start;
  const appear = spring({frame:local,fps:storyboard.fps,config:{damping:160,mass:.7}});
  const next = S.nextPartPlanned && Number.isInteger(S.nextPart);
  return <AbsoluteFill style={{background:'linear-gradient(155deg,#071324,#0d2936 65%,#07121b)',display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center',color:'#fff',textAlign:'center',fontFamily:'Arial,sans-serif'}}>
    <div style={{position:'absolute',top:100}}><SignalMark size={110}/></div>
    <div style={{fontSize:30,letterSpacing:8,color:BRAND,marginBottom:42,fontWeight:900,opacity:appear}}>MIMO SIGNÁL</div>
    <div style={{width:850,fontSize:95,lineHeight:1.09,fontWeight:950,letterSpacing:-2,transform:`scale(${.9+.1*appear})`,opacity:appear,textShadow:'0 9px 40px #000'}}>{S.endHook || 'A CO BYS UDĚLAL TY?'}</div>
    <div style={{width:420,height:7,background:RED,margin:'52px 0'}}/>
    <div style={{fontSize:64,fontWeight:900,color:RED}}>{next?`PART ${padPart(S.nextPart)}`:'KONEC PŘÍBĚHU'}</div>
    <div style={{fontSize:36,fontWeight:700,marginTop:12,letterSpacing:3}}>{next?(S.endPrompt || 'POKRAČOVÁNÍ PŘÍŠTĚ'):'JAKÝ JE TVŮJ NÁZOR?'}</div>
    <div style={{position:'absolute',bottom:178,color:'#a9d6df',fontSize:29,letterSpacing:3}}>{B.handle} · {B.tagline}</div>
  </AbsoluteFill>;
};

const Pilot=()=>{
  const frame=useCurrentFrame();
  const idx=Math.min(storyboard.scenes.length-1,Math.floor(frame/D));
  const f=frame%D;
  const fade=interpolate(f,[0,18,D-25,D],[0,1,1,0],clamp);
  return <AbsoluteFill style={{backgroundColor:'#081323',overflow:'hidden',fontFamily:'Arial,sans-serif'}}>
    <Forest frame={frame} idx={idx}/>
    <Headbar/>
    <div style={{position:'absolute',top:290,width:'100%',textAlign:'center',fontSize:74,fontWeight:900,color:'#e8faff',textShadow:'0 4px 30px #000',opacity:fade}}>{storyboard.scenes[idx].title}</div>
    <div style={{position:'absolute',bottom:270,left:80,right:80,color:'#fff',textAlign:'center',fontSize:57,fontWeight:900,lineHeight:1.18,textShadow:'0 6px 22px #000',opacity:fade}}>{storyboard.scenes[idx].caption}</div>
    <div style={{position:'absolute',bottom:113,left:80,right:80,height:8,background:'#ffffff33',borderRadius:10}}><div style={{height:'100%',width:`${frame/TOTAL*100}%`,background:BRAND,borderRadius:10}}/></div>
    {frame>=TOTAL-OUTRO && <EndCard frame={frame}/>}
  </AbsoluteFill>;
};

const Cover=()=> <AbsoluteFill style={{background:'#071324',fontFamily:'Arial,sans-serif',overflow:'hidden'}}>
  <Forest frame={850} idx={1} cover/>
  <Headbar staticMode/>
  <div style={{position:'absolute',top:298,left:69,right:67,color:'#fff',fontSize:86,lineHeight:1.03,fontWeight:950,letterSpacing:-1,textShadow:'0 8px 24px #000'}}>{S.coverHook}</div>
  <div style={{position:'absolute',bottom:269,left:70,right:70,height:7,background:BRAND}}/>
  <div style={{position:'absolute',bottom:153,left:70,right:70,color:'#fff',fontWeight:950,fontSize:86,lineHeight:1.03,textShadow:'0 6px 25px #000'}}>{S.title}</div>
  <div style={{position:'absolute',bottom:72,left:73,right:70,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
    <span style={{fontWeight:900,fontSize:38,color:RED,letterSpacing:3}}>PART {padPart(S.part)}</span>
    <span style={{fontSize:25,fontWeight:800,color:'#d4eaf0'}}>{B.handle}</span>
  </div>
</AbsoluteFill>;

const Root = () => <>
  <Composition id="Pilot" component={Pilot} durationInFrames={TOTAL} fps={storyboard.fps} width={W} height={H}/>
  <Composition id="Cover" component={Cover} durationInFrames={1} fps={storyboard.fps} width={W} height={H}/>
</>;
registerRoot(Root);
