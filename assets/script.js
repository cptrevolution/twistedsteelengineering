document.querySelectorAll('.year').forEach(el=>el.textContent=new Date().getFullYear());
/* Basic monthly lock for static hosting. This is a deterrent, not secure access control. */
(()=>{
  const params=new URLSearchParams(location.search),now=new Date();
  const billingMonth=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
  const storageKey='tse_payment_month',testMode=params.get('payment-test')==='1';
  if(params.get('payment-reset')==='1')localStorage.removeItem(storageKey);
  if(!((now.getDate()>=15||testMode)&&localStorage.getItem(storageKey)!==billingMonth))return;
  document.documentElement.classList.add('payment-locked');
  const lock=document.createElement('div');lock.className='payment-lock';lock.setAttribute('role','dialog');lock.setAttribute('aria-modal','true');
  lock.innerHTML=`<div class="payment-lock__panel"><img src="assets/twisted-steel-logo.jpg" alt="Twisted Steel Engineering"><p class="payment-lock__eyebrow">ACCOUNT NOTICE</p><h1>Website temporarily unavailable</h1><p>Payment for this website is due. Please contact the site administrator to restore access.</p><form class="payment-lock__form"><label for="payment-code">Administrator code</label><div><input id="payment-code" type="password" autocomplete="off" required placeholder="Enter code"><button type="submit">Unlock</button></div><p class="payment-lock__error" aria-live="polite"></p></form>${testMode?'<small>Test mode is active</small>':''}</div>`;
  document.body.appendChild(lock);const form=lock.querySelector('form'),input=lock.querySelector('input'),error=lock.querySelector('.payment-lock__error');
  form.addEventListener('submit',async e=>{e.preventDefault();const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(input.value.trim()));const hash=[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,'0')).join('');if(hash==='46e9844494ec1b4b0208a9e92e38db23381703ad4367f904cf109a82099baeaa'){localStorage.setItem(storageKey,billingMonth);document.documentElement.classList.remove('payment-locked');lock.remove()}else{error.textContent='Incorrect code. Please try again.';input.value='';input.focus()}});setTimeout(()=>input.focus(),50);
})();
const menu=document.querySelector('.menu');if(menu){menu.addEventListener('click',()=>{const nav=document.querySelector('nav');nav.classList.toggle('open');if(nav.classList.contains('open')){Object.assign(nav.style,{display:'flex',position:'absolute',top:'72px',left:'0',right:'0',padding:'25px',background:'#f2f0e9',flexDirection:'column',gap:'20px'})}else nav.removeAttribute('style')})}
const form=document.querySelector('#contact-form');if(form){form.addEventListener('submit',e=>{e.preventDefault();alert('Thank you. Please call Robert Wassenaar on +27 71 817 5856 to discuss your project.');window.location.href='tel:+27718175856'})}
