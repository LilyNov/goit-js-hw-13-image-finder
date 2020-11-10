import "./css/common.css";
import ImgApiService from './js/apiService.js'
import refs from './js/refs.js'
import templateCards from './template/template.hbs'
import { error } from "@pnotify/core";
import "./js/pnotify.js";
const imgApiService = new ImgApiService();



refs.form.addEventListener('submit', onSearch)
refs.loadMoreBth.addEventListener('click', onLoadMore)
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
  imgApiService.fetchImg().then(isValidSearchQuery).catch(itsError => { console.log(itsError) })
}

function onLoadMore() {
  imgApiService.fetchImg().then(renderImgCard);  
}

function renderImgCard(hits) {
  const markupImgCard = templateCards(hits)
  refs.galeryList.insertAdjacentHTML('beforeend', markupImgCard)
}

function clearGaleryList() {
  refs.galeryList.innerHTML = '';
}

function isValidSearchQuery(evt) {
  const itsError = error({
        text: "Please enter a more specific query!"
        
  });
  console.log(imgApiService.query.length);
  
  if (imgApiService.query.length >= 2) {
    renderImgCard(evt)
    return
  }
  
   return itsError
     
}

//Делегирование
function onImgClickModalOpen(evt) {
  evt.preventDefault();
  console.log(evt.target.nodeName);
  refs.galeryList.addEventListener('keydown', selectButtonActions);
  if (evt.target.nodeName !== 'IMG') {
    return;
  }

  refs.backdrop.classList.add('is-open');
  console.dir(evt.target);
  refs.img.src =''
  refs.img.src = evt.target.parentNode.href;
  refs.img.alt = evt.target.alt;
}
// .thref
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
    console.log('это клик в бекдроп');
    console.log(evt.target);
    console.log(evt.currentTarget);
  }
}

function selectButtonActions(evt) {
  console.log(evt.code);
  if (evt.code === 'Escape') {
    btnModalClose();
  } else if (evt.code === 'ArrowRight') {
    onArrowRight();
  } else if (evt.code === 'ArrowLeft') {
    onArrowLeft();
  }
}

const bigImg = refs.img.src

let index = 0;

setActiveImage(index);

function onArrowRight() {
  console.log(bigImg.length);
  if (index + 1 >= bigImg.length) {
    return;
  }

  console.log((index += 1));
  setActiveImage(index);
}

function onArrowLeft() {
  if (index - 1 < 0) {
    return;
  }

  console.log((index -= 1));
  setActiveImage(index);
}

function setActiveImage(indexCurrent) {
  const activeImage = bigImg[indexCurrent];
  //refs.img.src = activeImage;
}
