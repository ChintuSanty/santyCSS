#!/usr/bin/env node
'use strict';
const fs=require('fs'),path=require('path'),https=require('https');
const ICONS=['ban','ban-fill','bandaid','bandaid-fill','bank','bank2','bar-chart','bar-chart-fill','bar-chart-line','bar-chart-line-fill','bar-chart-steps','basket','basket-fill','basket2','basket2-fill','basket3','basket3-fill','battery','battery-charging','battery-full','battery-half','battery-low','beaker','beaker-fill','behance','bell','bell-fill','bell-slash','bell-slash-fill','bezier','bezier2','bicycle','bing','binoculars','binoculars-fill','blockquote-left','blockquote-right','bluesky','bluetooth','body-text','book','book-fill','book-half','bookmark','bookmark-check','bookmark-check-fill','bookmark-dash','bookmark-dash-fill','bookmark-fill','bookmark-heart','bookmark-heart-fill','bookmark-plus','bookmark-plus-fill','bookmark-star','bookmark-star-fill','bookmark-x','bookmark-x-fill','bookmarks','bookmarks-fill','bookshelf','boombox','boombox-fill','bootstrap','bootstrap-fill','bootstrap-reboot','border','border-all','border-bottom','border-center','border-inner','border-left','border-middle','border-outer','border-right','border-style','border-top','border-width','bounding-box','bounding-box-circles','box','box-arrow-down','box-arrow-down-left','box-arrow-down-right','box-arrow-in-down','box-arrow-in-down-left','box-arrow-in-down-right','box-arrow-in-left','box-arrow-in-right','box-arrow-in-up','box-arrow-in-up-left','box-arrow-in-up-right','box-arrow-left','box-arrow-right','box-arrow-up','box-arrow-up-left','box-arrow-up-right','box-fill','box-seam','box-seam-fill','box2'];
const SVG_DIR=path.join(__dirname,'..','icons','bootstrap');
function fetch(url){return new Promise((resolve,reject)=>{https.get(url,res=>{if(res.statusCode===301||res.statusCode===302)return fetch(res.headers.location).then(resolve).catch(reject);let d='';res.on('data',c=>d+=c);res.on('end',()=>resolve({status:res.statusCode,body:d}));}).on('error',reject);});}
function enc(svg){return svg.replace(/\n\s*/g,' ').replace(/"/g,"'").replace(/#/g,'%23').replace(/</g,'%3C').replace(/>/g,'%3E').trim();}
async function main(){
  const css=['\n/* ── Essential UI Icons (Part 3) ── */\n'];
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
  fs.writeFileSync(path.join(SVG_DIR,'_essential-icons-3.css'),css.join('\n')+'\n','utf8');
  console.log(`\n  Done — ${ok.length} ok, ${fail.length} failed`);
  if(fail.length)console.log('  Failed:',fail.join(', '));
}
main().catch(console.error);
