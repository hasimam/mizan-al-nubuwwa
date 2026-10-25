'use strict';
// Run against a local static server. No build step or project dependencies required.
// PLAYWRIGHT_MODULE can point to a bundled Playwright installation.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.MIZAN_TEST_URL || 'http://127.0.0.1:8765';
(async () => {
 const browser = await chromium.launch({channel:'chrome',headless:true});
 try {
  const page = await browser.newPage({viewport:{width:1280,height:900}});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base);
  assert.equal(await page.locator('.empty-state').count(),1);
  assert.equal(await page.locator('.law').count(),0);
  const data=await page.evaluate(()=>({laws:window.MIZAN.laws,activities:window.MIZAN_ACTIVITIES}));
  assert.equal(data.laws.length,21);
  assert.equal(Object.keys(data.activities).length,21);
  assert.equal(new Set(data.laws.map(l=>l.id)).size,21);
  let choicesChecked=0;
  for(const law of data.laws){
   await page.goto(`${base}/#law-${law.id}`);
   const card=page.locator(`#law-${law.id}`);
   assert.equal(await card.getAttribute('open'),'');
   assert.equal(await card.locator('.comparison p').nth(0).textContent(),law.summary);
   assert.equal(await card.locator('.comparison p').nth(1).textContent(),law.reflection);
   assert.equal(await card.locator('.law-body > p').textContent(),law.practice);
   const lab=card.locator('.leadership-lab');
   assert.equal(await lab.getAttribute('open'),null);
   await lab.locator(':scope > summary').click();
   assert.equal(await lab.locator('[data-choice]').count(),3);
   assert.equal(await lab.locator('.lab-followup').isVisible(),false);
   for(let i=0;i<3;i++){
    await lab.locator(`[data-choice="${i}"]`).click();
    assert.equal(await lab.locator('[aria-pressed="true"]').count(),1);
    assert.equal(await lab.locator('.scenario-feedback h4').textContent(),data.activities[law.id].choices[i][1]);
    assert.equal(await lab.locator('.scenario-feedback p').textContent(),data.activities[law.id].choices[i][2]);
    assert.equal(await lab.locator('.lab-followup').isVisible(),true);
    assert.equal(await card.getAttribute('open'),'');
    choicesChecked++;
   }
   await lab.locator('.lab-evidence > summary').click();
   assert.equal(await lab.locator('.lab-evidence > p').first().textContent(),law.reflection);
   assert.equal(new URL(page.url()).hash,`#law-${law.id}`);
   await lab.locator('.lab-retry').click();
   assert.equal(await lab.locator('[aria-pressed="true"]').count(),0);
   assert.equal(await lab.locator('.lab-followup').isVisible(),false);
   assert.equal(await lab.locator('[data-choice="0"]').evaluate(el=>el===document.activeElement),true);
  }
  // Choices survive group navigation in memory, but disappear on reload.
  await page.goto(`${base}/#law-12`);
  await page.locator('#law-12 .lab-summary').click();
  await page.locator('#law-12 [data-choice="2"]').click();
  await page.locator('[data-group="0"]').click();
  await page.locator('[data-group="2"]').click();
  await page.locator('#law-12 > summary').click();
  await page.locator('#law-12 .lab-summary').click();
  assert.equal(await page.locator('#law-12 [data-choice="2"]').getAttribute('aria-pressed'),'true');
  await page.reload();
  await page.locator('#law-12 .lab-summary').click();
  assert.equal(await page.locator('#law-12 [aria-pressed="true"]').count(),0);
  // Native disclosure and answer buttons work using the keyboard.
  await page.locator('#law-12 .lab-summary').focus();
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#law-12 .leadership-lab').getAttribute('open'),null);
  await page.keyboard.press('Enter');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  assert.equal(await page.locator('#law-12 [data-choice="0"]').getAttribute('aria-pressed'),'true');
  assert.deepEqual(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length})),{local:0,session:0});
  // Original law accordion still closes its sibling.
  await page.locator('#law-13 > summary').click();
  await page.waitForFunction(()=>document.querySelectorAll('.law[open]').length===1 && location.hash==='#law-13');
  assert.equal(await page.locator('.law[open]').count(),1);
  assert.equal(new URL(page.url()).hash,'#law-13');
  fs.mkdirSync(path.join(__dirname,'../test-results'),{recursive:true});
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   await page.goto(`${base}/?viewport=${width}#law-12`);
   await page.locator('#law-12 .lab-summary').click();
   await page.locator('#law-12 [data-choice="2"]').click();
   await page.locator('#law-12 .lab-evidence > summary').click();
   await page.evaluate(()=>document.fonts.ready);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,`horizontal overflow at ${width}`);
   const bounds=await page.locator('#law-12 .leadership-lab').boundingBox();
   assert.ok(bounds.x>=0 && bounds.x+bounds.width<=width);
   await page.screenshot({path:path.join(__dirname,`../test-results/activity-${width}.png`),fullPage:true});
  }
  assert.deepEqual(errors,[]);
  console.log(JSON.stringify({lawsChecked:21,choicesChecked,viewportWidths:[320,390,768,1280],checks:['original text','direct links','nested disclosures','retry and focus','keyboard operation','group navigation','session-only state','no horizontal overflow'],browserErrors:errors},null,2));
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
