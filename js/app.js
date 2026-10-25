'use strict';
const {laws,refs}=window.MIZAN;
const groupNames=['قوانين الأساس','قوانين التمكين','قوانين القيادة الفاعلة','قوانين الأثر والاستدامة'];
const ar=n=>new Intl.NumberFormat('ar-u-nu-arab').format(n);
const details=document.getElementById('details');
const activitySelections=new Map();
const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function renderActivity(law){
 const activity=window.MIZAN_ACTIVITIES?.[law.id];
 if(!activity)return '';
 return `<details class="leadership-lab" data-activity="${law.id}"><summary class="lab-summary"><span class="lab-mark" aria-hidden="true">✧</span><span class="lab-summary-copy"><strong>جرّب موقفًا</strong><span>قرار صغير، وفرصة للتأمّل</span></span><span class="lab-state">ابدأ التجربة</span><span class="lab-chevron" aria-hidden="true">⌄</span></summary><div class="lab-content"><div class="lab-kicker"><span>مختبر القيادة</span><span>موقف افتراضي · بلا درجات</span></div><h3 id="scenario-${law.id}" class="scenario-question">ماذا تختار؟</h3><p class="scenario-text">${escapeHTML(activity.scenario)}</p><div class="scenario-choices" role="group" aria-labelledby="scenario-${law.id}">${activity.choices.map((choice,index)=>`<button type="button" class="scenario-choice" data-choice="${index}" aria-pressed="false" aria-controls="feedback-${law.id}"><span class="choice-number" aria-hidden="true">${ar(index+1)}</span><span>${escapeHTML(choice[0])}</span></button>`).join('')}</div><div class="scenario-feedback" id="feedback-${law.id}" role="status" aria-live="polite" aria-atomic="true"></div><div class="lab-followup" hidden><details class="lab-evidence"><summary>تأمّل المبدأ والشاهد <span aria-hidden="true">↗</span></summary><p>${escapeHTML(law.reflection)}</p><a href="${escapeHTML(refs[law.ref].url)}" target="_blank" rel="noopener">${escapeHTML(refs[law.ref].label)} ↗</a><p class="lab-source-note">هذا الموقف تمرين تربوي من إعداد المشروع؛ وليس رواية من السيرة أو حكمًا على الشخص.</p></details><div class="lab-next"><h4>خطوة في واقعك</h4><p>${escapeHTML(activity.nextStep)}</p><p class="lab-reflection">${escapeHTML(law.question)}</p></div><button type="button" class="lab-retry">جرّب اختيارًا آخر <span aria-hidden="true">↺</span></button><p class="lab-privacy">اختيارك للتأمّل فقط، ولا يُحفظ بعد إعادة تحميل الصفحة.</p></div></div></details>`;
}
function applySelection(lab,index){
 const activity=window.MIZAN_ACTIVITIES[Number(lab.dataset.activity)];
 const choice=activity.choices[index];
 lab.querySelectorAll('[data-choice]').forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.choice)===index?'true':'false'));
 lab.querySelector('.scenario-feedback').innerHTML=`<h4>${escapeHTML(choice[1])}</h4><p>${escapeHTML(choice[2])}</p>`;
 lab.querySelector('.lab-followup').hidden=false;
 lab.querySelector('.lab-state').textContent='استكشفت الموقف';
}

function showGroup(group,lawId){
 const entries=laws.filter(l=>l.group===group);
 document.querySelectorAll('[data-group]').forEach(button=>button.setAttribute('aria-pressed',Number(button.dataset.group)===group));
 details.innerHTML=`<div class="details-head"><h2>${groupNames[group]}</h2><p>اختر قانوناً لقراءة تفاصيله.</p></div><div class="laws">${entries.map(l=>{const r=refs[l.ref];return `<details class="law" id="law-${l.id}" ${l.id===lawId?'open':''}><summary><span class="law-number">${ar(l.id).padStart(2,'٠')}</span><span class="law-name">${l.title}</span><span class="toggle" aria-hidden="true">+</span></summary><div class="law-body"><div class="comparison"><div><h3>الفكرة القيادية</h3><p>${l.summary}</p></div><div><h3>في ضوء القرآن والسنة</h3><p>${l.reflection}</p></div></div><blockquote><p>«${r.text}»</p><a href="${r.url}" target="_blank" rel="noopener">${r.label} ↗</a></blockquote><h3>تطبيق عملي</h3><p>${l.practice}</p>${renderActivity(l)}</div></details>`;}).join('')}</div><p class="content-note">التأملات والتطبيقات من إعداد المشروع.</p>`;
 details.querySelectorAll('[data-activity]').forEach(lab=>{const selection=activitySelections.get(Number(lab.dataset.activity));if(selection!==undefined)applySelection(lab,selection);});
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

details.addEventListener('click',event=>{
 const choice=event.target.closest('[data-choice]');
 const retry=event.target.closest('.lab-retry');
 if(!choice&&!retry)return;
 const lab=event.target.closest('[data-activity]');
 const lawId=Number(lab.dataset.activity);
 if(choice){
  const index=Number(choice.dataset.choice);
  activitySelections.set(lawId,index);
  applySelection(lab,index);
 }else{
  activitySelections.delete(lawId);
  lab.querySelectorAll('[data-choice]').forEach(button=>button.setAttribute('aria-pressed','false'));
  lab.querySelector('.scenario-feedback').replaceChildren();
  lab.querySelector('.lab-followup').hidden=true;
  lab.querySelector('.lab-state').textContent='ابدأ التجربة';
  lab.querySelector('[data-choice]').focus();
 }
});
