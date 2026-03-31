#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https');
const ICONS=['box2-fill','box2-heart','box2-heart-fill','boxes','braces','braces-asterisk','bricks','briefcase','briefcase-fill','brightness-alt-high','brightness-alt-high-fill','brightness-alt-low','brightness-alt-low-fill','brightness-high','brightness-high-fill','brightness-low','brightness-low-fill','brilliance','broadcast','broadcast-pin','browser-chrome','browser-edge','browser-firefox','browser-safari','brush','brush-fill','bucket','bucket-fill','bug','bug-fill','building','building-add','building-check','building-dash','building-down','building-exclamation','building-fill','building-fill-add','building-fill-check','building-fill-dash','building-fill-down','building-fill-exclamation','building-fill-gear','building-fill-lock','building-fill-slash','building-fill-up','building-fill-x','building-gear','building-lock','building-slash','building-up','building-x','buildings','buildings-fill','bullseye','bus-front','bus-front-fill','c-circle','c-circle-fill','c-square','c-square-fill','cake','cake-fill','cake2','cake2-fill','calculator','calculator-fill','calendar','calendar-check','calendar-check-fill','calendar-date','calendar-date-fill','calendar-day','calendar-day-fill','calendar-event','calendar-event-fill','calendar-fill','calendar-heart','calendar-heart-fill','calendar-minus','calendar-minus-fill','calendar-month','calendar-month-fill','calendar-plus','calendar-plus-fill','calendar-range','calendar-range-fill','calendar-week','calendar-week-fill','calendar-x','calendar-x-fill','calendar2','calendar2-check','calendar2-check-fill','calendar2-date','calendar2-date-fill','calendar2-day','calendar2-day-fill','calendar2-event','calendar2-event-fill'];
const SVG_DIR=path.join(__dirname,'..','icons','bootstrap');
function fetch(url){return new Promise((resolve,reject)=>{https.get(url,res=>{if(res.statusCode===301||res.statusCode===302)return fetch(res.headers.location).then(resolve).catch(reject);let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve({status:res.statusCode,body:d}));}).on('error',reject);});}
function enc(svg){return svg.replace(/\n\s*/g,' ').replace(/"/g,"'").replace(/#/g,'%23').replace(/</g,'%3C').replace(/>/g,'%3E').trim();}
async function main(){
  const css=['\n/* ── Essential UI Icons (Part 4) ── */\n'];
  const ok=[],fail=[];
  for(const name of ICONS){
    const url=`https://raw.githubusercontent.com/twbs/icons/main/icons/${name}.svg`;
    try{
      const{status,body}=await fetch(url);
      if(status!==200||!body.includes('<svg')){fail.push(name);console.log(`  ✗  ${name}  (${status})`);continue;}
      fs.writeFileSync(path.join(SVG_DIR,`${name}.svg`),body,'utf8');
      const inner=body.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'').trim();
      css.push(`.icon-${name} { --icon-url: url("data:image/svg+xml,${enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>${inner}</svg>`)}"); }`);
      ok.push(name);console.log(`  ✔  ${name}`);
    }catch(e){fail.push(name);console.log(`  ✗  ${name}  (${e.message})`);}
    await new Promise(r=>setTimeout(r,80));
  }
  fs.writeFileSync(path.join(SVG_DIR,'_essential-icons-4.css'),css.join('\n')+'\n','utf8');
  console.log(`\n  Done — ${ok.length} ok, ${fail.length} failed`);
  if(fail.length)console.log('  Failed:',fail.join(', '));
}
main().catch(console.error);
