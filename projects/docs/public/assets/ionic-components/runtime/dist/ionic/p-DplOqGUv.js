/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import{a as o,w as s}from"./p-ChhhtsGZ.js";import{a as t,s as r}from"./p-B4FrqdW0.js";import{c as a}from"./p-7CBuOvEo.js";import"./p-Dojwmvde.js";const m=()=>{const m=window;m.addEventListener("statusTap",(()=>{o((()=>{const o=document.elementFromPoint(m.innerWidth/2,m.innerHeight/2);if(!o)return;const n=t(o);n&&new Promise((o=>a(n,o))).then((()=>{s((async()=>{n.style.setProperty("--overflow","hidden"),await r(n,300),n.style.removeProperty("--overflow")}))}))}))}))};export{m as startStatusTap}