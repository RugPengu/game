// RugPengu enhanced clicker script
(function(){
  const walletKey = 'pengu_wallet_v2';
  const balanceKey = 'pengu_balance_v2';
  const clicksKey = 'pengu_clicks_v2';

  // helper
  function randHex(len){ let s=''; const chars='0123456789abcdef'; for(let i=0;i<len;i++) s+=chars[Math.floor(Math.random()*chars.length)]; return s; }
  function now(){ return new Date().toLocaleTimeString(); }
  function qs(sel){ return document.querySelector(sel); }
  function qsa(sel){ return document.querySelectorAll(sel); }

  // init wallet
  let wallet = localStorage.getItem(walletKey);
  if(!wallet){
    wallet = '0x' + randHex(6) + '...' + randHex(6);
    localStorage.setItem(walletKey, wallet);
  }
  qs('#walletAddr').textContent = wallet;

  let balance = parseInt(localStorage.getItem(balanceKey) || '0', 10);
  let clicks = parseInt(localStorage.getItem(clicksKey) || '0', 10);
  const balanceEl = qs('#balance');
  const logEl = qs('#log');
  const bonusMsg = qs('#bonusMsg');
  const penguBtn = qs('#penguBtn');
  const progressBar = qs('#progressBar');

  function updateUI(){
    balanceEl.textContent = balance.toLocaleString();
    progressBar.style.width = ( (clicks % 10) * 10 ) + '%';
  }

  function addLog(txt){
    const li = document.createElement('li');
    li.textContent = `${now()} — ${txt}`;
    logEl.insertBefore(li, logEl.firstChild);
  }

  updateUI();
  if(clicks>0) addLog('Welcome back — your score was restored.');

  // animations & effects
  function wobble(){
    penguBtn.animate([{transform:'translateY(0) rotate(0)'},{transform:'translateY(-6px) rotate(-6deg)'},{transform:'translateY(0) rotate(0)'}],{duration:220,iterations:1});
  }

  // simple confetti
  function burstConfetti(){
    const wrap = qs('#confetti');
    for(let i=0;i<20;i++){
      const s = document.createElement('span');
      s.style.left = Math.random()*100 + '%';
      s.style.background = ['#ffd700','#ff7ab6','#7ee7c7','#ffb86b'][Math.floor(Math.random()*4)];
      s.style.width = Math.floor(Math.random()*10)+6+'px';
      s.style.height = Math.floor(Math.random()*14)+8+'px';
      wrap.appendChild(s);
      setTimeout(()=> s.remove(), 1600);
    }
  }

  penguBtn.addEventListener('click', ()=>{
    clicks++;
    balance += 1;
    localStorage.setItem(balanceKey, balance);
    localStorage.setItem(clicksKey, clicks);
    updateUI();
    wobble();

    // every 10 clicks: random bonus
    if(clicks % 10 === 0){
      const bonus = Math.floor(Math.random()*90) + 10; // 10–99
      balance += bonus;
      localStorage.setItem(balanceKey, balance);
      bonusMsg.textContent = `Lucky drop! +${bonus} PENGU`;
      addLog(`Got bonus +${bonus} PENGU`);
      burstConfetti();
      setTimeout(()=> bonusMsg.textContent = '', 3500);
    } else {
      addLog('Clicked +1 PENGU');
      // small subtle glow
      penguBtn.style.boxShadow = '0 18px 30px rgba(10,100,255,0.12)';
      setTimeout(()=> penguBtn.style.boxShadow = '', 250);
    }
  });

  qs('#resetBtn').addEventListener('click', ()=>{
    if(confirm('Reset your local pengu score? This clears your browser storage.')){
      localStorage.removeItem(balanceKey);
      localStorage.removeItem(clicksKey);
      balance = 0; clicks = 0;
      updateUI();
      addLog('Score reset');
    }
  });

  // share button: copies score or opens tweet
  /* qs('#shareBtn').addEventListener('click', ()=>{
    const score = balance;
    const text = `I scored ${score} PENGU on the RugPengu clicker! Join the nest: https://rugpengu.onepage.me #PenguArmy`;
    if(navigator.share){
      navigator.share({title:'RugPengu score', text, url:'https://rugpengu.onepage.me'}).catch(()=>{});
    } else {
      navigator.clipboard.writeText(text).then(()=>{
        alert('Score copied to clipboard — paste to share!');
      });
    }
  }); */

  // main page button
  qs('#mainPageBtn').addEventListener('click', ()=>{
    window.location.href = 'https://rugpengu.onepage.me';
  });

})();
