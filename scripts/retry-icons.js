#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https');
const RETRY=['brightness-alt-low','brightness-alt-low-fill','brightness-high','brightness-high-fill','brightness-low','brightness-low-fill','brilliance'];
const SVG_DIR=path.join(__dirname,'..','icons','bootstrap');
function fetch(url){return new Promise((resolve,reject)=>{https.get(url,res=>{if(res.statusCode===301||res.statusCode===302)return fetch(res.headers.location).then(resolve).catch(reject);let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve({status:res.statusCode,body:d}));}).on('error',reject);});}
function enc(svg){return svg.replace(/\n\s*/g,' ').replace(/"/g,"'").replace(/#/g,'%23').replace(/</g,'%3C').replace(/>/g,'%3E').trim();}
async function main(){
  const css=[];const ok=[],fail=[];
  for(const name of RETRY){
    await new Promise(r=>setTimeout(r,2500));
    const url=`https://raw.githubusercontent.com/twbs/icons/main/icons/${name}.svg`;
    try{
      const{status,body}=await fetch(url);
      if(status!==200||!body.includes('<svg')){fail.push(name);console.log(`  ✗  ${name}  (${status})`);continue;}
      fs.writeFileSync(path.join(SVG_DIR,`${name}.svg`),body,'utf8');
      const inner=body.replace(/<svg[^>]*>/,'').replace(/<\/svg>/,'').trim();
      css.push(`.icon-${name} { --icon-url: url("data:image/svg+xml,${enc(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>${inner}</svg>`)}"); }`);
      ok.push(name);console.log(`  ✔  ${name}`);
    }catch(e){fail.push(name);console.log(`  ✗  ${name}  (${e.message})`);}
  }
  if(css.length) fs.appendFileSync(path.join(SVG_DIR,'_essential-icons-4.css'),'\n'+css.join('\n')+'\n');
  console.log(`\n  Done — ${ok.length} ok, ${fail.length} failed`);
  if(fail.length)console.log('  Still failed:',fail.join(', '));
}
main().catch(console.error);
