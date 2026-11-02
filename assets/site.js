/* ===== Site settings: edit these before deploying ===== */
const CONFIG = {
  whatsapp: "2348030935547",   // international format, no + or spaces (WhatsApp chat buttons)
  // Formspree form endpoint that receives demo requests from both product pages
  formspree: "https://formspree.io/f/myeklbzk"
};

(function(){
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  // Mobile menu
  const nav=$('#nav'), mb=$('#menuBtn');
  if(nav&&mb){
    mb.addEventListener('click',()=>{const o=nav.classList.toggle('open');mb.setAttribute('aria-expanded',o);closeProducts()});
    nav.addEventListener('click',e=>{if(e.target.closest('a')){nav.classList.remove('open');mb.setAttribute('aria-expanded','false')}});
  }

  // Products menu
  const pb=$('#prodBtn'), pm=$('#prodMenu');
  function closeProducts(){if(pb&&pm){pm.hidden=true;pb.setAttribute('aria-expanded','false')}}
  if(pb&&pm){
    pb.addEventListener('click',e=>{e.stopPropagation();const open=pm.hidden;pm.hidden=!open;pb.setAttribute('aria-expanded',open);if(open){nav&&nav.classList.remove('open');mb&&mb.setAttribute('aria-expanded','false');const f=$('a',pm);f&&f.focus()}});
    document.addEventListener('click',e=>{if(!pm.hidden&&!pm.contains(e.target))closeProducts()});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!pm.hidden){closeProducts();pb.focus()}});
  }

  const yr=$('#yr'); if(yr)yr.textContent=new Date().getFullYear();

  // Screen tabs
  const tabs=$$('.tab');
  function sel(t){tabs.forEach(x=>{const on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;const p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on})}
  tabs.forEach((t,i)=>{t.addEventListener('click',()=>sel(t));t.addEventListener('keydown',e=>{let j=null;if(e.key==='ArrowRight')j=(i+1)%tabs.length;if(e.key==='ArrowLeft')j=(i-1+tabs.length)%tabs.length;if(j!==null){e.preventDefault();sel(tabs[j]);tabs[j].focus()}})});

  // Tour video
  const tour=$('#tour'), tp=$('#tourPlay');
  if(tour&&tp){
    tp.addEventListener('click',()=>{const p=tour.play();if(p&&p.catch)p.catch(()=>{})});
    tour.addEventListener('play',()=>tour.parentElement.classList.add('playing'));
    tour.addEventListener('ended',()=>tour.parentElement.classList.remove('playing'));
  }

  // Lightbox
  document.addEventListener('click',e=>{
    const z=e.target.closest('.zoom'); if(!z)return;
    const lb=document.createElement('div');lb.className='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','Enlarged screen');
    const im=document.createElement('img');im.src=z.dataset.full;im.alt=z.querySelector('img').alt;
    const cl=document.createElement('button');cl.type='button';cl.textContent='Close';
    lb.append(im,cl);document.body.appendChild(lb);cl.focus();
    const onKey=ev=>{if(ev.key==='Escape')close()};
    const close=()=>{lb.remove();document.removeEventListener('keydown',onKey);z.focus()};
    lb.addEventListener('click',close);document.addEventListener('keydown',onKey);
  });

  // Billing toggle
  const bm=$('#billM'), by=$('#billY');
  if(bm&&by){
    const bill=y=>{bm.setAttribute('aria-pressed',!y);by.setAttribute('aria-pressed',y);$$('[data-m]').forEach(el=>el.textContent=y?el.dataset.y:el.dataset.m)};
    bm.addEventListener('click',()=>bill(false));by.addEventListener('click',()=>bill(true));
  }

  // Plan buttons preselect the plan in the form
  $$('[data-plan]').forEach(a=>a.addEventListener('click',()=>{const p=$('#f-plan');if(p)p.value=a.dataset.plan}));

  // Copy buttons
  $$('.copy').forEach(b=>b.addEventListener('click',()=>{
    const done=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy',1600)};
    const selectText=()=>{const n=b.previousElementSibling;const r=document.createRange();r.selectNodeContents(n);const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Press Ctrl+C'};
    try{navigator.clipboard.writeText(b.dataset.copy).then(done,selectText)}catch(e){selectText()}
  }));

  // Demo request forms (one per product page) → Formspree
  $$('form[data-demo]').forEach(setupForm);

  function setupForm(form){
    const btn=$('button[type=submit]',form), alertBox=$('.form-alert',form), draftKey=form.dataset.draft;
    const tmr=new Date();tmr.setDate(tmr.getDate()+1);
    $$('input[data-future]',form).forEach(d=>d.min=tmr.toISOString().slice(0,10));

    const textFields=$$('input[data-label]:not([type=radio]):not([type=checkbox]),textarea[data-label]',form);
    try{const d=JSON.parse(localStorage.getItem(draftKey)||'{}');textFields.forEach(el=>{if(d[el.name]!=null)el.value=d[el.name]})}catch(e){}
    form.addEventListener('input',()=>{try{const d={};textFields.forEach(el=>d[el.name]=el.value);localStorage.setItem(draftKey,JSON.stringify(d))}catch(e){}});

    function setErr(inp,msg){
      const fld=inp.closest('.fld'), el=fld&&$('.err',fld);
      if(el){el.textContent=msg;if(!el.id)el.id=inp.id+'-err';inp.setAttribute('aria-describedby',el.id)}
      inp.classList.toggle('bad-input',!!msg);inp.setAttribute('aria-invalid',!!msg);
      return !msg;
    }
    function validate(){
      let first=null;
      $$('input,select,textarea',form).forEach(inp=>{
        if(inp.type==='checkbox'||inp.type==='radio'||inp.name==='_gotcha')return;
        const v=inp.value.trim(); let msg='';
        if(inp.type==='tel'){const n=v.replace(/\D/g,'');if(!(n.length>=10&&n.length<=14))msg='Enter a phone number we can call or WhatsApp, e.g. 0803 000 0000.'}
        else if(inp.type==='email'){if(v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))msg='Check the email address, or leave it blank.'}
        else if(inp.required&&!v)msg=inp.dataset.msg||'This field is required.';
        if(!setErr(inp,msg)&&!first)first=inp;
      });
      if(first)first.focus();
      return !first;
    }
    function value(name){const el=form.elements[name];return el?String(el.value||'').trim():''}
    function payload(ref){
      const subj=value(form.dataset.subject), extra=value(form.dataset.subjectExtra);
      const p={'_subject':form.dataset.product+' demo request: '+subj+(extra?' ('+extra+(form.dataset.subjectSuffix||'')+')':''),'Product':form.dataset.product,'Reference':ref};
      $$('[data-label]',form).forEach(el=>{
        if(el.tagName==='FIELDSET'){
          const vals=$$('input:checked',el).map(x=>x.value);
          p[el.dataset.label]=vals.length?vals.join(', '):'-';
        }else if(el.name==='email'){
          if(el.value.trim())p.email=el.value.trim();   // lets you reply straight to the visitor
        }else{
          p[el.dataset.label]=el.value.trim()||'-';
        }
      });
      p['Source']='Lynxpaq website';
      p['_gotcha']=value('_gotcha');
      return p;
    }
    function showError(msg){
      alertBox.innerHTML='<b>Your request was not sent.</b> '+esc(msg)+' Your details are still filled in, so you can try again. You can also reach us on +234 803 093 5547 or lynxpaq@gmail.com.';
      alertBox.hidden=false;alertBox.scrollIntoView({block:'nearest',behavior:'smooth'});
    }
    function showDone(ref){
      const box=document.createElement('div');box.className='done';box.setAttribute('role','status');box.tabIndex=-1;
      box.innerHTML='<button type="button" class="x" aria-label="Close confirmation"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button>'
        +'<h3>Request received</h3><p>Thank you, '+esc(value('name'))+'. We will contact you on '+esc(value('phone'))+' within one working day to confirm your demo for '+esc(value(form.dataset.subject))+'.</p><span class="ref">Reference: '+ref+'</span><p>Quote this reference if you call or message us.</p>'
        +'<button type="button" class="btn btn-ghost js-close">Close</button>';
      form.classList.add('sent');form.appendChild(box);box.focus();
      $$('.x,.js-close',box).forEach(b=>b.addEventListener('click',closeDone));
      box.addEventListener('keydown',e=>{if(e.key==='Escape')closeDone()});
      try{localStorage.removeItem(draftKey)}catch(e){}
    }
    function closeDone(){
      const box=$('.done',form); if(box)box.remove();
      form.reset();form.classList.remove('sent');
      btn.disabled=false;btn.textContent='Request my demo';
      const f=$('input[name=name]',form); if(f)f.focus({preventScroll:true});
      const sec=form.closest('section'); if(sec)sec.scrollIntoView({block:'start',behavior:'smooth'});
    }

    form.addEventListener('submit',async e=>{
      e.preventDefault();
      alertBox.hidden=true;
      if(!validate())return;
      const ref='LX-'+Date.now().toString(36).toUpperCase().slice(-6);
      if(!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(CONFIG.formspree)||/YOUR_FORM_ID/.test(CONFIG.formspree)){
        showError('The demo form is not connected yet.');return;
      }
      btn.disabled=true;btn.textContent='Sending…';
      try{
        const r=await fetch(CONFIG.formspree,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload(ref))});
        if(r.ok){showDone(ref);return}
        let msg='Something went wrong on our side.';
        try{const j=await r.json();if(j&&j.errors&&j.errors.length)msg=j.errors.map(x=>x.message).join(' ')+'.'}catch(_){}
        throw new Error(msg);
      }catch(x){
        btn.disabled=false;btn.textContent='Request my demo';
        showError(x&&x.message&&!/fetch|network/i.test(x.message)?x.message:'Check your internet connection.');
      }
    });
  }
})();
