const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || undefined,args:['--no-sandbox']});
  try {
    const p = await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
    const errors = [];
    p.on('pageerror', e => errors.push(e.message));
    await p.goto('http://localhost:3000');
    // Shape of installed 2.2 data: no year field, active marks need not be in profiles.
    await p.evaluate(() => {
      const old = defaults(); delete old.year;
      old.v.af1 = {cc:'12',ex:'16'}; old.lock = 'off'; old.lang = 'fr';
      old.profiles.edp = {...defaults(),v:{af1:{cc:'9',ex:'13'}}};
      localStorage.setItem(KEY,JSON.stringify(old));
    });
    await p.reload(); await p.click('#entry-start');
    assert.equal(await p.inputValue('#cc-af1'),'12');
    assert.equal(await p.inputValue('#study-year'),'m1');
    const firstModules = {
      afa:['Théorie des semi-groupes et applications','Opérateurs non bornés','Théorie des opérateurs différentiels'],
      ama:['Équations intégrales','Théorie spectrale','Théorie des semi-groupes'],
      edp:['Théorie des semi-groupes et applications pour les EDP','EDP elliptiques non linéaires','Théorie de régularité']
    };
    await p.selectOption('#study-year','m2');
    for (const [i,spec] of ['afa','ama','edp'].entries()) {
      await p.selectOption('#speciality',spec);
      assert.equal(await p.textContent('#nl-s1'),'Semestre 3');
      assert.equal(await p.textContent('#nl-s2'),'Semestre 4');
      assert.deepEqual(await p.evaluate(() => SEMS.map(s => {
        const r=calcSem(s); return [r.coefTotal,r.crTotal,r.total];
      })),[[17,30,7],[17,30,1]]);
      assert.deepEqual(await p.evaluate(() => SEMS[0].ues[0].mods.map(m => m.name)),firstModules[spec]);
      assert.deepEqual(await p.evaluate(() => SEMS[0].ues.flatMap(u=>u.mods).map(m=>[m.coef,m.cr,m.cc])),
        [[3,6,.4],[3,6,.4],[3,6,.4],[3,5,.4],[2,4,.4],[2,2,.4],[1,1,0]]);
      await p.fill('#cc-m2-f1',String(10+i)); await p.fill('#ex-m2-f1','20');
      assert.equal(await p.evaluate(() => calcMod(SEMS[0].ues[0].mods[0]).avg),.4*(10+i)+12);
      await p.selectOption('#sel-m2-option','2');
      await p.fill('#tgv-s1',String(12+i));
      await p.click('[data-view="s2"]');
      assert.equal(await p.locator('#cc-m2-pfe').count(),0);
      assert.match(await p.textContent('#mod-m2-pfe'),/Note finale du mémoire/);
      await p.fill('#ex-m2-pfe',String(14+i));
      assert.equal(await p.evaluate(() => calcSem(SEMS[1]).credits),30);
      // Annual average combines semesters equally; all coursework completed at 10.
      await p.evaluate(() => {
        SEMS[0].ues.forEach(u=>u.mods.forEach(m=>{state.v[m.id]={cc:'10',ex:'10'};}));
        save();update();
      });
      assert.equal(await p.evaluate(() => update().y),12+i/2);
      assert.equal(await p.evaluate(() => update().yDone),true);
      await p.click('[data-view="s1"]');
      // Exercise year-specific deletion, custom modules, and saved choices.
      await p.click('[data-act="del:m2-research"]'); await p.click('#confirm-accept');
      await p.click('#fab'); await p.fill('#sh-name','M2 custom '+spec);
      await p.fill('#sh-coef','2'); await p.fill('#sh-cr','3');
      await p.click('[data-act="sheet:save"]');
    }
    await p.selectOption('#study-year','m1');
    assert.equal(await p.inputValue('#cc-af1'),'9');
    await p.selectOption('#speciality','afa');
    assert.equal(await p.inputValue('#cc-af1'),'12');
    assert.equal(await p.locator('#mod-mm').count(),1);
    assert.equal(await p.evaluate(()=>state.custom.length),0);
    await p.selectOption('#study-year','m2');
    assert.equal(await p.evaluate(()=>state.target.s1),12);
    assert.equal(await p.inputValue('#sel-m2-option'),'2');
    assert.equal(await p.locator('#mod-m2-research').count(),0);
    assert.equal(await p.evaluate(()=>state.custom[0].name),'M2 custom afa');
    await p.reload(); await p.click('#entry-start');
    assert.equal(await p.inputValue('#study-year'),'m2');
    await p.click('#b-lang');
    assert.equal(await p.textContent('#nl-s1'),'Semester 3');
    assert.equal(await p.textContent('#nl-s2'),'Semester 4');
    assert.match(await p.evaluate(()=>summaryText()),/Master 2[\s\S]*Semester 3[\s\S]*Semester 4/);
    assert.match(await p.evaluate(()=>buildTranscriptPdf().output()),/Master 2/);
    assert.match(await p.evaluate(()=>buildTranscriptPdf().output()),/Semester 4/);
    const snapshot = await p.evaluate(()=>makeBackup());
    assert.equal(snapshot.version,2);
    assert.equal(Object.keys(snapshot.data.profiles).length,6);
    await p.evaluate(snapshot=>{
      const clean=validateBackup(snapshot);
      state.v={}; applyBackup(clean);
    },snapshot);
    for (const [i,spec] of ['afa','ama','edp'].entries()) {
      await p.selectOption('#speciality',spec);
      assert.equal(await p.evaluate(()=>state.v['m2-pfe'].ex),String(14+i));
      assert.equal(await p.evaluate(()=>state.custom[0].name),'M2 custom '+spec);
    }
    // Legacy backups import as M1 and initialize all M2 profiles empty.
    const legacy=JSON.parse(JSON.stringify(snapshot)); legacy.version=1; delete legacy.data.year;
    for(const key of ['m2_afa','m2_ama','m2_edp']) delete legacy.data.profiles[key];
    await p.evaluate(legacy=>applyBackup(validateBackup(legacy)),legacy);
    assert.equal(await p.inputValue('#study-year'),'m1');
    await p.selectOption('#speciality','afa'); await p.click('[data-view="s1"]');
    assert.equal(await p.inputValue('#cc-af1'),'12');
    await p.selectOption('#study-year','m2');
    assert.equal(await p.inputValue('#cc-m2-f1'),'');
    // Invalid M2 unit metadata must fail without replacing current data.
    const invalid=JSON.parse(JSON.stringify(snapshot)); invalid.data.profiles.m2_afa.custom[0].ue='UEF11';
    assert.equal(await p.evaluate(bad=>{try{validateBackup(bad);return false;}catch{return true;}},invalid),true);
    for(const width of [320,390,768,1440]) {
      await p.setViewportSize({width,height:900});
      assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'overflow '+width);
    }
    assert.deepEqual(errors,[]);
    console.log('PASS: all M2 curricula, weights, credits, PFE/annual calculations, M1 upgrade, six-profile isolation, custom modules/deletion, reload, bilingual labels, PDF, v2 backup round trip, v1 restore, invalid backup, responsive widths');
  } finally { await browser.close(); }
})().catch(e=>{console.error(e);process.exit(1);});
