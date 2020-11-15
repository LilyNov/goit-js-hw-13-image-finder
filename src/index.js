import "./css/common.css";
import ImgApiService from './js/apiService.js'
import refs from './js/refs.js'
import templateCards from './template/template.hbs'
import { error } from "@pnotify/core";
import "./js/pnotify.js";
const imgApiService = new ImgApiService();


refs.form.addEventListener('submit', onSearch)
refs.galeryList.addEventListener('click', onImgClickModalOpen);
refs.btnLightbox.addEventListener('click', btnModalClose);
refs.overley.addEventListener('click', onBackdropClickCloseModal);




function onSearch(evt) {
    evt.preventDefault()
  clearGaleryList()
  
  imgApiService.query = evt.currentTarget.elements.query.value;
  if (!imgApiService.query) {
    return
  }
  imgApiService.resetPage();
  imgApiService.fetchImg().then(renderImgCard).catch(error({
        text: "Please enter a more specific query!"
        
  }) )
}



function renderImgCard(hits) {
  const markupImgCard = templateCards(hits)
  refs.galeryList.insertAdjacentHTML('beforeend', markupImgCard)
}

function clearGaleryList() {
  refs.galeryList.innerHTML = '';
}

// Typical Observer's registration

const endPage = document.querySelector('.end-page');
const spinerEl = document.querySelector('.spinner');
const textEl = document.querySelector('.load-text')

function onLoadMore() {
  imgApiService.fetchImg().then(renderImgCard).finally(offLoadMore)  
}

function offLoadMore() {
  spinerEl.classList.remove('is-hidden')
  textEl.classList.add('is-hidden')
}

const callback = entries => {
    entries.forEach(entry => {
       
      if (entry.isIntersecting && imgApiService.query) {
        spinerEl.classList.add('is-hidden')
        setTimeout(() => {
          onLoadMore()
          observer.disconnect() 
        }, 1000);
          
          
        }
  });
}

const options = {
  rootMargin: '100px',
  threshold: 0.5
}


const observer = new IntersectionObserver(callback, options);
observer.observe(endPage);



//Делегирование
function onImgClickModalOpen(evt) {
  evt.preventDefault();
  refs.galeryList.addEventListener('keydown', selectButtonActions);
  if (evt.target.nodeName !== 'IMG') {
    return;
  }

  refs.backdrop.classList.add('is-open');
  refs.img.src =''
  refs.img.src = evt.target.parentNode.href;
  refs.img.alt = evt.target.alt;
}

//закрыть модалку

function btnModalClose() {
  refs.galeryList.removeEventListener('keydown', selectButtonActions);
  refs.backdrop.classList.remove('is-open');
  refs.img.src = '';
}

// клик в бекдроп с закрытием модалки

function onBackdropClickCloseModal(evt) {
  if (evt.currentTarget === evt.target) {
    btnModalClose();
  }
}

function selectButtonActions(evt) {
  // console.log(evt.code);
  if (evt.code === 'Escape') {
    btnModalClose();
  }
}

