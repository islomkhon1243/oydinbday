(() => {
  const dialog=document.querySelector('#modal'),content=document.querySelector('#modal-content');
  document.querySelectorAll('[data-universe]').forEach(button=>button.addEventListener('click',()=>{
    const image=button.querySelector('img').cloneNode();image.removeAttribute('loading');
    const caption=document.createElement('p');caption.textContent=button.querySelector('h3').innerText.replace(/\s+/g,' ');
    content.replaceChildren(image,caption);dialog.classList.add('universe-modal');dialog.showModal();
  }));
  dialog.addEventListener('close',()=>dialog.classList.remove('universe-modal'));
})();

