(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hero=document.querySelector('.hero');
  const cue=document.createElement('a');cue.className='scroll-cue';cue.href='#story';cue.innerHTML='ДАЛЬШЕ — ЕЩЁ ТЕПЛЕЕ <span aria-hidden="true">↓</span>';hero.append(cue);
  const reminder=document.createElement('button');reminder.type='button';reminder.className='reminder';reminder.innerHTML='<small>МАЛЕНЬКОЕ НАПОМИНАНИЕ ДЛЯ ТЕБЯ ↻</small><span class="reminder-text" aria-live="polite">Ты делаешь этот мир добрее ♡</span>';document.querySelector('.qualities').append(reminder);
  const words=['Ты любима просто за то, что ты есть ♡','Твоё доброе сердце — большая ценность.','Ты заслуживаешь такой же заботы, какую даришь другим.','Где бы мы ни были, ты всегда моя родная.','Рядом с тобой даже обычный день становится теплее.','Ты делаешь этот мир добрее ♡'];let word=0;
  reminder.addEventListener('click',()=>{reminder.querySelector('.reminder-text').textContent=words[word++%words.length];reminder.classList.remove('pulse');requestAnimationFrame(()=>reminder.classList.add('pulse'));});
  if(reduced.matches)return;
  const bar=document.createElement('div');bar.className='read-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);
  let queued=false;function update(){bar.style.transform=`scaleX(${Math.min(1,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight))})`;queued=false;}
  addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});update();
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}})},{threshold:.08});document.querySelectorAll('.section > *, .quality-grid article, .world-grid button, .photos button').forEach((node,i)=>{node.style.setProperty('--reveal-delay',`${(i%3)*65}ms`);node.classList.add('reveal-ready');observer.observe(node);});}
  for(let i=0;i<12;i++){const spark=document.createElement('span');spark.className='ambient-spark';spark.setAttribute('aria-hidden','true');spark.textContent=i%3?'✧':'♡';spark.style.cssText=`left:${4+(i*31)%92}%;top:${8+(i*19)%78}%;font-size:${12+i%4*5}px;--duration:${7+i%5}s;--delay:-${i}s`;hero.append(spark);}
  let last=0;document.addEventListener('click',event=>{if(reduced.matches||event.target.closest('.music-player,dialog,select,input')||event.clientX===0&&event.clientY===0||Date.now()-last<180)return;last=Date.now();for(let i=0;i<3;i++){const heart=document.createElement('span');heart.className='click-heart';heart.textContent=i===1?'✧':'♡';heart.setAttribute('aria-hidden','true');heart.style.cssText=`left:${event.clientX+(i-1)*12}px;top:${event.clientY}px;--drift:${(i-1)*30}px;animation-delay:${i*.08}s`;document.body.append(heart);setTimeout(()=>heart.remove(),1700)}});
})();
