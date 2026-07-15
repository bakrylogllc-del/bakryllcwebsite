"use client";

/**
 * SECTION 7 — Contact (circle → form morph)
 * Exact demo HTML embedded; only CSS color tokens remapped to Bakry brand.
 * See SECTIONS.md
 */

const CONTACT_HTML = `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Circle to Form Morph</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet">
<style>
  :root{
    /* ---- Bakry brand colors only ---- */
    --bg: #E6E2D6;
    --grid-line: rgba(17, 17, 17, 0.09);
    --accent-dark: #111111;
    --accent-text: #E6E2D6;
    --muted-text: rgba(230,226,214,0.55);
    --font-display: 'Bebas Neue', 'Arial Narrow', Impact, sans-serif;
  }

  *{ box-sizing:border-box; margin:0; padding:0; }

  html,body{
    width:100%; height:100%;
    background: transparent;
    overflow:hidden;
    font-family: var(--font-display);
    cursor: none;
  }
  *, *::before, *::after { cursor: none !important; }

  .stage{
    position:relative;
    width:100%; height:100%;
    display:flex; align-items:center; justify-content:center;
    overflow:hidden;
    background: transparent;
  }

  /* ---------- launcher pill ---------- */
  .launcher{
    position:relative;
    z-index:6;
    width:148px; height:148px;
    border-radius:50%;
    background: var(--accent-dark);
    color: var(--accent-text);
    border:none;
    cursor:pointer;
    font-family: var(--font-display);
    font-weight:400;
    letter-spacing:1.5px;
    font-size:22px;
    text-transform:uppercase;
    display:flex; align-items:center; justify-content:center;
    transition: transform .35s cubic-bezier(.22,1,.36,1);
  }
  .launcher:hover{ transform:scale(1.06); }
  .launcher:active{ transform:scale(.96); }

  /* ---------- morph panel ---------- */
  .panel{
    position:fixed;
    z-index:5;
    top:50%; left:50%;
    width:min(640px, 88vw);
    height:min(640px, 88vw);
    border-radius:50%;
    background: var(--accent-dark);
    transform: translate(-50%,-50%) scale(0.23125);
    transform-origin:center center;
    overflow:hidden;
    box-shadow: 0 0px 0px rgba(0,0,0,0);
    transition:
      transform .8s cubic-bezier(.31,1.7,.4,1),
      box-shadow .8s cubic-bezier(.31,1.7,.4,1),
      width .55s cubic-bezier(.65,0,.35,1),
      height .55s cubic-bezier(.65,0,.35,1),
      border-radius .55s cubic-bezier(.65,0,.35,1);
    pointer-events:none;
  }

  /* STAGE 1: hover -> circle scales up to full size, dotted bg + animated words appear */
  .panel.teased{
    transform: translate(-50%,-50%) scale(1);
    border-radius:50%;
    box-shadow: 0 40px 90px rgba(0,0,0,0.35), 0 0 0 18px rgba(255,255,255,0.03);
    pointer-events:auto;
    cursor:pointer;
  }

  /* STAGE 2: click -> circle reshapes into the contact form */
  .panel.open{
    transform: translate(-50%,-50%) scale(1);
    width:min(440px, 90vw);
    height:min(520px, 86vh);
    border-radius:28px;
    box-shadow: 0 40px 90px rgba(0,0,0,0.35);
    pointer-events:auto;
  }

  /* dotted texture inside panel — shows during tease AND open states */
  .panel::before{
    content:"";
    position:absolute; inset:0;
    background-image: radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1.5px);
    background-size: 16px 16px;
    opacity:0;
    transition: opacity .3s ease;
  }
  .panel.teased::before,
  .panel.open::before{ opacity:1; transition-delay:.15s; }

  /* sparkle accents, only during the tease state, like the source clip */
  .sparkle{
    position:absolute;
    color: rgba(255,255,255,0.8);
    font-size:22px;
    opacity:0;
    transform:scale(.5);
    transition: opacity .3s ease, transform .3s ease;
    pointer-events:none;
  }
  .panel.teased .sparkle{ opacity:1; transform:scale(1); animation: sparkleTwinkle 1.8s ease-in-out infinite; }
  .sparkle.s1{ top:14%; left:18%; transition-delay:.05s; animation-delay:0s; }
  .sparkle.s2{ top:22%; right:14%; transition-delay:.1s; animation-delay:.4s; }
  .sparkle.s3{ bottom:20%; left:15%; transition-delay:.15s; animation-delay:.8s; }
  .sparkle.s4{ bottom:16%; right:18%; transition-delay:.2s; animation-delay:1.2s; }

  @keyframes sparkleTwinkle{
    0%, 100%{ opacity:.5; transform:scale(.8) rotate(0deg); }
    50%{ opacity:1; transform:scale(1.3) rotate(20deg); }
  }

  /* animated "LET'S WORK" teaser text, stacked over the form so it can cross-fade */
  .tease-words{
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    flex-direction:column;
    gap:6px;
    opacity:0;
    pointer-events:none;
    transition: opacity .3s ease;
    z-index:2;
  }
  .panel.teased .tease-words{ opacity:1; transition-delay:.1s; }
  .panel.open .tease-words{ opacity:0; transition-delay:0s; }

  .tease-line{
    display:flex;
    justify-content:center;
    overflow:visible;
  }

  .tease-words .letter{
    display:inline-block;
    color: var(--accent-text);
    font-weight:800;
    font-size:clamp(38px, 8vw, 64px);
    letter-spacing:1px;
    text-transform:uppercase;
    line-height:0.95;
    transform: translateY(0);
    opacity:0;
    transition: opacity .4s ease, transform .5s cubic-bezier(.22,1,.36,1);
  }
  .letter.space{ width:0.35em; }

  .panel.teased .letter{
    opacity:1;
  }

  /* continuous floating motion once revealed */
  @keyframes letterFloat{
    0%, 100%{ transform: translateY(0) rotate(0deg); }
    50%{ transform: translateY(-14px) rotate(var(--tilt, 2deg)); }
  }
  .panel.teased .letter{
    animation: letterFloat 2.2s ease-in-out infinite;
  }

  .tease-hint{
    margin-top:14px;
    font-size:11px;
    letter-spacing:2px;
    color: var(--muted-text);
    text-transform:uppercase;
    opacity:0;
    transition: opacity .3s ease .35s;
  }
  .panel.teased .tease-hint{ opacity:1; }

  .panel-inner{
    position:absolute; inset:0;
    display:flex; flex-direction:column;
    opacity:0;
    transform:scale(.85);
    transition: opacity .35s ease, transform .4s cubic-bezier(.22,1,.36,1);
  }
  .panel.open .panel-inner{
    opacity:1; transform:scale(1);
    transition-delay:.25s;
  }

  .panel-header{
    display:flex; align-items:center; justify-content:space-between;
    padding:18px 22px;
    background: rgba(255,255,255,0.04);
    border-bottom:1px solid rgba(255,255,255,0.08);
  }
  .panel-header h3{
    color: var(--accent-text);
    font-size:14px;
    letter-spacing:1.5px;
    text-transform:uppercase;
    font-weight:700;
  }
  .close-btn{
    width:28px; height:28px;
    border-radius:50%;
    border:1px solid rgba(255,255,255,0.3);
    background:transparent;
    color: var(--accent-text);
    cursor:pointer;
    font-size:14px;
    line-height:1;
    display:flex; align-items:center; justify-content:center;
    transition: background .2s ease;
  }
  .close-btn:hover{ background: rgba(255,255,255,0.12); }

  .panel-body{
    flex:1;
    padding:24px 22px;
    display:flex; flex-direction:column; gap:16px;
    overflow:auto;
  }

  .field{
    width:100%;
    padding:14px 16px;
    background: transparent;
    border:1px solid rgba(255,255,255,0.25);
    border-radius:10px;
    color: var(--accent-text);
    font-size:13px;
    letter-spacing:0.5px;
    text-transform:uppercase;
    font-family: var(--font-display);
    outline:none;
    transition: border-color .2s ease;
  }
  .field::placeholder{ color: var(--muted-text); text-transform:uppercase; letter-spacing:0.5px; }
  .field:focus{ border-color: rgba(255,255,255,0.7); }
  textarea.field{ resize:none; min-height:100px; font-family:var(--font-display); }

  .submit-btn{
    margin-top:4px;
    padding:15px;
    background: #C6B28A;
    color: #111111;
    border:none;
    border-radius:10px;
    font-weight:700;
    letter-spacing:1px;
    text-transform:uppercase;
    font-size:13px;
    cursor:pointer;
    transition: transform .2s ease, opacity .2s ease;
  }
  .submit-btn:hover{ transform:translateY(-2px); }
  .submit-btn:active{ transform:translateY(0); opacity:.85; }

  .overlay{
    position:fixed; inset:0;
    background: rgba(0,0,0,0);
    z-index:4;
    pointer-events:none;
    transition: background .5s ease;
  }
  .overlay.open{
    background: rgba(0,0,0,0.35);
    pointer-events:auto;
  }

  /* ripple ring fired at the moment of expansion, like a shockwave from the source clip */
  .ripple{
    position:fixed;
    z-index:4;
    top:50%; left:50%;
    width:148px; height:148px;
    border-radius:50%;
    border:2px solid var(--accent-dark);
    transform: translate(-50%,-50%) scale(1);
    opacity:0;
    pointer-events:none;
  }
  .ripple.fire{
    animation: rippleOut .8s cubic-bezier(.2,.7,.3,1);
  }
  .ripple.ripple-2.fire{
    animation: rippleOut .8s cubic-bezier(.2,.7,.3,1) .12s;
  }
  @keyframes rippleOut{
    0%{ opacity:.55; transform:translate(-50%,-50%) scale(1); }
    100%{ opacity:0; transform:translate(-50%,-50%) scale(6.5); }
  }

  @media (prefers-reduced-motion: reduce){
    .panel, .panel-inner, .launcher{ transition-duration:.01s !important; }
  }
</style>
</head>
<body>

<div class="stage">
  <button class="launcher" id="launcher">Contact</button>
</div>

<div class="overlay" id="overlay"></div>
<div class="ripple" id="ripple"></div>
<div class="ripple ripple-2" id="ripple2"></div>

<div class="panel" id="panel">
  <div class="sparkle s1">✦</div>
  <div class="sparkle s2">✦</div>
  <div class="sparkle s3">✦</div>
  <div class="sparkle s4">✦</div>

  <div class="tease-words" id="teaseWords">
    <div class="tease-line" data-word="LET'S"></div>
    <div class="tease-line" data-word="WORK"></div>
    <div class="tease-hint">Click to continue</div>
  </div>

  <div class="panel-inner">
    <div class="panel-header">
      <h3>Let's Work Together</h3>
      <button class="close-btn" id="closeBtn">✕</button>
    </div>
    <div class="panel-body">
      <input class="field" type="text" placeholder="Name">
      <input class="field" type="text" placeholder="Phone Number">
      <textarea class="field" placeholder="Message"></textarea>
      <button class="submit-btn">Send Message</button>
    </div>
  </div>
</div>

<script>
  // ---- build animated letters for the teaser text ----
  const teaseLines = document.querySelectorAll('.tease-line');
  let letterIndex = 0;
  teaseLines.forEach(line => {
    const word = line.dataset.word;
    [...word].forEach(ch => {
      const el = document.createElement('span');
      el.className = 'letter' + (ch === ' ' ? ' space' : '');
      el.textContent = ch === ' ' ? '\\u00A0' : ch;
      const delay = (letterIndex * 0.08).toFixed(2);
      const tilt = (letterIndex % 2 === 0 ? 1 : -1) * (3 + (letterIndex % 3) * 1.5);
      el.style.animationDelay = delay + 's';
      el.style.setProperty('--tilt', tilt + 'deg');
      el.style.transitionDelay = delay + 's';
      line.appendChild(el);
      letterIndex++;
    });
  });

  // ---- circle -> teaser -> form interaction ----
  const launcher = document.getElementById('launcher');
  const panel = document.getElementById('panel');
  const overlay = document.getElementById('overlay');
  const closeBtn = document.getElementById('closeBtn');

  const ripple = document.getElementById('ripple');
  const ripple2 = document.getElementById('ripple2');
  let state = 'idle'; // idle -> teased -> open
  // Phones: no hover — one tap expands, second tap opens form
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function setPull(v){
    window.__pullStrength = v;
  }

  function fireRipple(){
    [ripple, ripple2].forEach(r => {
      r.classList.remove('fire');
      void r.offsetWidth;
      r.classList.add('fire');
    });
  }

  function enterTeased(){
    if(state !== 'idle') return;
    state = 'teased';
    setPull(1);
    panel.classList.add('teased');
    overlay.classList.add('open');
    launcher.style.opacity = '0';
    launcher.style.pointerEvents = 'none';
    fireRipple();
  }

  function enterOpen(){
    if(state === 'open') return;
    state = 'open';
    setPull(1.6);
    panel.classList.remove('teased');
    panel.classList.add('open');
    fireRipple();

    // Phone: same tap that opens must not focus a field / open the keyboard
    if (!canHover) {
      panel.querySelectorAll('.field').forEach((el) => {
        el.setAttribute('readonly', 'readonly');
        el.blur();
      });
      const ae = document.activeElement;
      if (ae && panel.contains(ae) && typeof ae.blur === 'function') ae.blur();
      setTimeout(() => {
        panel.querySelectorAll('.field').forEach((el) => {
          el.removeAttribute('readonly');
        });
      }, 500);
    }
  }

  function reset(){
    state = 'idle';
    setPull(0);
    panel.classList.remove('teased','open');
    overlay.classList.remove('open');
    panel.querySelectorAll('.field').forEach((el) => {
      el.removeAttribute('readonly');
    });
    setTimeout(()=>{
      launcher.style.opacity = '1';
      launcher.style.pointerEvents = 'auto';
    }, 250);
  }

  if (canHover) {
    // Desktop: hover expands, click opens form
    launcher.addEventListener('pointerenter', enterTeased);
    panel.addEventListener('pointerenter', () => {
      if(state === 'idle') enterTeased();
    });
    panel.addEventListener('pointerleave', () => {
      if(state === 'teased') reset();
    });
    panel.addEventListener('click', () => {
      if(state === 'teased') enterOpen();
    });
  } else {
    // Phone: tap Contact → expand; tap expanded circle → open form
    launcher.addEventListener('click', (e) => {
      e.preventDefault();
      if (state === 'idle') enterTeased();
    });
    panel.addEventListener('click', (e) => {
      if (state === 'teased') {
        e.preventDefault();
        e.stopPropagation();
        // lock fields before morph so this tap can't land in an input
        panel.querySelectorAll('.field').forEach((el) => {
          el.setAttribute('readonly', 'readonly');
        });
        enterOpen();
        requestAnimationFrame(() => {
          const ae = document.activeElement;
          if (ae && panel.contains(ae) && typeof ae.blur === 'function') ae.blur();
        });
      }
    });
  }

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    reset();
  });
  overlay.addEventListener('click', () => {
    if(state === 'open' || (!canHover && state === 'teased')) reset();
  });
</script>

</body>
</html>`;

export function ContactMorphSection() {
  return (
    <section
      id="contact"
      className="relative w-full overflow-hidden bg-transparent"
      style={{ height: "100svh", minHeight: 560 }}
      aria-label="Contact"
    >
      <iframe
        title="Contact"
        srcDoc={CONTACT_HTML}
        className="block h-full w-full border-0 bg-transparent"
        style={{ colorScheme: "normal" }}
        sandbox="allow-scripts allow-same-origin allow-forms"
        onLoad={() => {
          window.dispatchEvent(new Event("bakry:iframe-cursor"));
        }}
      />
    </section>
  );
}

export default ContactMorphSection;
