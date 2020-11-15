import "./css/common.css";
// import "./js/io.js"
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
  imgApiService.fetchImg().then(renderImgCard).catch(console.log(error({
        text: "Please enter a more specific query!"
        
  }) ))
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
const spinerEl = document.querySelector('.spinner')

function onLoadMore() {
  imgApiService.fetchImg().then(renderImgCard);  
}

const callback = entries => {
    entries.forEach(entry => {
       
      if (entry.isIntersecting && imgApiService.query) {
        spinerEl.classList.add('is-hidden')
        setTimeout(() => {
          onLoadMore()
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
  // console.log(evt.target.nodeName);
  refs.galeryList.addEventListener('keydown', selectButtonActions);
  if (evt.target.nodeName !== 'IMG') {
    return;
  }

  refs.backdrop.classList.add('is-open');
  // console.dir(evt.target);
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
    // console.log('это клик в бекдроп');
    // console.log(evt.target);
    // console.log(evt.currentTarget);
  }
}

function selectButtonActions(evt) {
  // console.log(evt.code);
  if (evt.code === 'Escape') {
    btnModalClose();
  }
  
  // else if (evt.code === 'ArrowRight') {
  //   onArrowRight();
  // } else if (evt.code === 'ArrowLeft') {
  //   onArrowLeft();
  // }
}

// const bigImg = refs.img.src

// let index = 0;

// setActiveImage(index);

// function onArrowRight() {
//   console.log(bigImg.length);
//   if (index + 1 >= bigImg.length) {
//     return;
//   }

//   console.log((index += 1));
//   setActiveImage(index);
// }

// function onArrowLeft() {
//   if (index - 1 < 0) {
//     return;
//   }

//   console.log((index -= 1));
//   setActiveImage(index);
// }

// function setActiveImage(indexCurrent) {
//   const activeImage = bigImg[indexCurrent];
//   refs.img.src = activeImage;
// }
