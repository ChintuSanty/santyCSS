#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https');
const ICONS=['usb-drive','usb-drive-fill','usb-fill','usb-micro','usb-micro-fill','usb-mini','usb-mini-fill','usb-plug','usb-plug-fill','usb-symbol','valentine','valentine2','vector-pen','view-list','view-stacked','vignette','vimeo','vinyl','vinyl-fill','virus','virus2','voicemail','volume-down','volume-down-fill','volume-mute','volume-mute-fill','volume-off','volume-off-fill','volume-up','volume-up-fill','vr','wallet','wallet-fill','wallet2','watch','water','webcam','webcam-fill','wechat','whatsapp','wifi','wifi-1','wifi-2','wifi-off','wikipedia','wind','window','window-dash','window-desktop','window-dock','window-fullscreen','window-plus','window-sidebar','window-split','window-stack','window-x','windows','wordpress','wrench','wrench-adjustable','wrench-adjustable-circle','wrench-adjustable-circle-fill','x','x-circle','x-circle-fill','x-diamond','x-diamond-fill','x-lg','x-octagon','x-octagon-fill','x-square','x-square-fill','xbox','yelp','yin-yang','youtube','zoom-in','zoom-out'];

const SVG_DIR=path.join(__dirname,'..','icons','bootstrap');
function fetch(url){return new Promise((resolve,reject)=>{https.get(url,res=>{if(res.statusCode===301||res.statusCode===302)return fetch(res.headers.location).then(resolve).catch(reject);let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve({status:res.statusCode,body:d}));}).on('error',reject);});}
function enc(svg){return svg.replace(/\n\s*/g,' ').replace(/"/g,"'").replace(/#/g,'%23').replace(/</g,'%3C').replace(/>/g,'%3E').trim();}

async function main(){
  const css=['\n/* ── Essential UI Icons (Part 7) ── */\n'];
  const ok=[],fail=[];
  for(const name of ICONS){
    const url=`https://raw.githubusercontent.com/twbs/icons/main/icons/${name}.svg`;
    try{
      const{status,body}=await fetch(url);
      if(status===429){
        await new Promise(r=>setTimeout(r,3000));
        const r2=await fetch(url);
        if(r2.status!==200||!r2.body.includes('<svg')){fail.push(name);console.log(`  ✗  ${name}  (429 retry fail)`);continue;}
        fs.writeFileSync(path.join(SVG_DIR,`${name}.svg`),r2.body,'utf8');
        const inner=r2.body.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'').trim();
        css.push(`.icon-${name} { --icon-url: url("data:image/svg+xml,${enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>${inner}</svg>`)}"); }`);
        ok.push(name);console.log(`  ✔  ${name} (retry)`);
      } else if(status!==200||!body.includes('<svg')){
        fail.push(name);console.log(`  ✗  ${name}  (${status})`);
      } else {
        fs.writeFileSync(path.join(SVG_DIR,`${name}.svg`),body,'utf8');
        const inner=body.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'').trim();
        css.push(`.icon-${name} { --icon-url: url("data:image/svg+xml,${enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>${inner}</svg>`)}"); }`);
        ok.push(name);console.log(`  ✔  ${name}`);
      }
    }catch(e){fail.push(name);console.log(`  ✗  ${name}  (${e.message})`);}
    await new Promise(r=>setTimeout(r,100));
  }
  fs.writeFileSync(path.join(SVG_DIR,'_essential-icons-7.css'),css.join('\n')+'\n','utf8');
  console.log(`\n  Done — ${ok.length} ok, ${fail.length} failed`);
  if(fail.length)console.log('  Failed:',fail.join(', '));
  if(fail.length) fs.writeFileSync(path.join(__dirname,'failed-7.json'),JSON.stringify(fail),'utf8');
}
main().catch(console.error);
