'use strict';
const {laws,refs}=window.MIZAN;
const groupNames=['قوانين الأساس','قوانين التمكين','قوانين القيادة الفاعلة','قوانين الأثر والاستدامة'];
const ar=n=>new Intl.NumberFormat('ar-u-nu-arab').format(n);
const details=document.getElementById('details');
function showGroup(group,lawId){
 const entries=laws.filter(l=>l.group===group);
 document.querySelectorAll('[data-group]').forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.group)===group));
 details.innerHTML=`<div class="details-head"><h2>${groupNames[group]}</h2><p>اختر قانوناً لقراءة تفاصيله.</p></div><div class="laws">${entries.map(l=>{const r=refs[l.ref];return `<details class="law" id="law-${l.id}" ${l.id===lawId?'open':''}><summary><span class="law-number">${ar(l.id).padStart(2,'٠')}</span><span class="law-name">${l.title}</span><span class="toggle" aria-hidden="true">+</span></summary><div class="law-body"><div class="comparison"><div><h3>الفكرة القيادية</h3><p>${l.summary}</p></div><div><h3>في ضوء القرآن والسنة</h3><p>${l.reflection}</p></div></div><blockquote><p>«${r.text}»</p><a href="${r.url}" target="_blank" rel="noopener">${r.label} ↗</a></blockquote><h3>تطبيق عملي</h3><p>${l.practice}</p></div></details>`;}).join('')}</div><p class="content-note">التأملات والتطبيقات من إعداد المشروع. <a href="https://store.maxwellleadership.com/products/25th-anniversary-edition-workbook-the-21-irrefutable-laws-of-leadership" target="_blank" rel="noopener">مصدر ترتيب القوانين ↗</a></p>`;
}
document.querySelector('.compass-nav').addEventListener('click',event=>{
 const button=event.target.closest('[data-group]');if(!button)return;
 const group=Number(button.dataset.group);showGroup(group);history.replaceState(null,'',`#path-${group+1}`);
});
details.addEventListener('toggle',event=>{
 const law=event.target;if(!law.matches('.law')||!law.open)return;
 details.querySelectorAll('.law[open]').forEach(other=>{if(other!==law)other.open=false;});
 history.replaceState(null,'',`#${law.id}`);
},true);
function restoreSelection(){
 const lawMatch=location.hash.match(/^#law-(\d+)$/),pathMatch=location.hash.match(/^#path-([1-4])$/);
 if(lawMatch){const law=laws.find(l=>l.id===Number(lawMatch[1]));if(law)showGroup(law.group,law.id);}
 else if(pathMatch)showGroup(Number(pathMatch[1])-1);
}
restoreSelection();window.addEventListener('hashchange',restoreSelection);
