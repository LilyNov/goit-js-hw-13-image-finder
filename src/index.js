import "./css/common.css";
import ImgApiService from './js/apiService.js'
import refs from './js/refs.js'
import templateCards from './template/template.hbs'

const imgApiService = new ImgApiService();


refs.form.addEventListener('submit', onSearch)
refs.loadMoreBth.addEventListener('click', onLoadMore)



function onSearch(evt) {
    evt.preventDefault()
    
  imgApiService.query = evt.currentTarget.elements.query.value;
  console.log(imgApiService.query);
  imgApiService.resetPage();
  imgApiService.fetchImg().then(renderImgCard);
}

function onLoadMore() {
  imgApiService.fetchImg().then(renderImgCard);  
}

function renderImgCard(hits) {
  const markupImgCard = templateCards(hits)
  console.log(hits);
    refs.galeryList.insertAdjacentHTML('beforeend', markupImgCard)
}