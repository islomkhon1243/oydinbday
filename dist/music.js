(() => {
  // Source excerpts: Benom 1:36–2:01; Gradusy 1:42–2:08; MOT 1:08–1:36; Taylor 0:48–1:20; Vremya 0:42–1:14.
  const tracks = [
    {artist:'Benom', title:'Yoningdaman', file:'benom.mp3', start:0, end:25},
    {artist:'Градусы', title:'Режиссёр', file:'gradusy.mp3', start:0, end:26},
    {artist:'МОТ', title:'Капкан', file:'mot.mp3', start:0, end:28},
    {artist:'Taylor Swift', title:'The Fate of Ophelia', file:'taylor.mp3', start:0, end:32},
    {artist:'Время и Стекло', title:'Так выпала карта', file:'vremya.mp3', start:0, end:32}
  ];
  const player = document.createElement('aside');
  player.className='music-player'; player.setAttribute('aria-label','Музыка для Ойдин');
  player.innerHTML=`<span class="music-symbol" aria-hidden="true">♫</span><div class="music-info"><label for="song-choice">С любовью, в каждой ноте</label><select id="song-choice" aria-label="Выбрать песню"></select><span id="music-status" role="status">Включаем музыку…</span></div><div class="music-buttons"><button type="button" id="music-prev" aria-label="Предыдущая песня">‹</button><button type="button" id="music-play" aria-label="Включить музыку">▶</button><button type="button" id="music-next" aria-label="Следующая песня">›</button></div><label class="music-volume">Громкость<input id="music-volume" type="range" min="0" max="1" step="0.05" value="0.45" aria-label="Громкость музыки"></label><div class="music-progress" role="progressbar" aria-label="Прогресс фрагмента" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span></span></div>`;
  document.body.append(player);
  const audio = new Audio(); audio.preload='metadata'; audio.volume=.45;
  const choice=player.querySelector('select'), play=player.querySelector('#music-play'), status=player.querySelector('#music-status'), progress=player.querySelector('.music-progress');
  tracks.forEach((track,i)=>choice.add(new Option(`${track.artist} — ${track.title}`,i)));
  let index=0, wanted=true, blocked=false, revision=0, advancing=false, failed=new Set();
  const showStatus = text => { status.textContent=text; };
  function renderPlaying(){play.textContent=audio.paused?'▶':'Ⅱ';play.setAttribute('aria-label',audio.paused?'Включить музыку':'Приостановить музыку');player.classList.toggle('is-playing',!audio.paused);}
  async function tryPlay(){
    if(!wanted)return;
    const current=revision;
    try{await audio.play();if(current!==revision)return;blocked=false;showStatus('Фрагмент припева · далее автоматически');}
    catch(error){if(current!==revision||error.name==='AbortError')return;if(error.name==='NotAllowedError'){blocked=true;showStatus('Коснись страницы, чтобы зазвучала музыка');}else{showStatus('Не удалось включить. Нажми ▶, чтобы повторить.');}renderPlaying();}
  }
  function loadTrack(next,shouldPlay=true){
    revision++;audio.pause();index=(next+tracks.length)%tracks.length;wanted=shouldPlay;advancing=false;choice.value=String(index);
    progress.firstElementChild.style.width='0%';progress.setAttribute('aria-valuenow','0');
    audio.src='assets/music/'+tracks[index].file;
    // Pre-cut excerpts avoid seek/range delays on mobile connections.
    
    showStatus(shouldPlay?'Включаем музыку…':'Музыка на паузе');audio.load();renderPlaying();if(shouldPlay)tryPlay();
  }
  audio.addEventListener('loadedmetadata',()=>{audio.currentTime=Math.min(tracks[index].start,Math.max(0,audio.duration-1));if(wanted)tryPlay();});
  audio.addEventListener('playing',()=>{failed.clear();blocked=false;showStatus('Фрагмент припева · далее автоматически');renderPlaying();});
  audio.addEventListener('pause',renderPlaying);
  audio.addEventListener('timeupdate',()=>{
    const track=tracks[index],ratio=Math.max(0,Math.min(1,(audio.currentTime-track.start)/(track.end-track.start)));
    progress.firstElementChild.style.width=ratio*100+'%';progress.setAttribute('aria-valuenow',String(Math.round(ratio*100)));
    if(wanted&&!advancing&&audio.currentTime>=Math.min(track.end,audio.duration)-.08){advancing=true;loadTrack(index+1);}
  });
  audio.addEventListener('ended',()=>{if(wanted&&!advancing){advancing=true;loadTrack(index+1);}});
  audio.addEventListener('error',()=>{failed.add(index);if(wanted&&failed.size<tracks.length){loadTrack(index+1);}else{wanted=false;showStatus('Музыка не загрузилась. Нажми ▶, чтобы повторить.');renderPlaying();}});
  play.addEventListener('click',()=>{if(wanted&&!audio.paused){wanted=false;blocked=false;audio.pause();showStatus('Музыка на паузе');}else{wanted=true;blocked=false;if(audio.error){failed.clear();loadTrack(index);}else{if(audio.currentTime>=tracks[index].end)audio.currentTime=tracks[index].start;tryPlay();}}});
  player.querySelector('#music-prev').addEventListener('click',()=>loadTrack(index-1));
  player.querySelector('#music-next').addEventListener('click',()=>loadTrack(index+1));
  choice.addEventListener('change',()=>loadTrack(Number(choice.value)));
  player.querySelector('#music-volume').addEventListener('input',event=>{audio.volume=Number(event.target.value);});
  // Autoplay policies require a trusted gesture; an intentional pause stays paused.
  function unlock(event){if(player.contains(event.target))return;if(wanted&&blocked)tryPlay();}
  document.addEventListener('click',unlock);document.addEventListener('keydown',unlock);
  loadTrack(0);
})();

