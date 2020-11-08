import refs from './refs.js'
import templateCards from '../template/template.hbs'

export function renderImgCard(hits) {
    const markupImgCard = templateCards(hits)
    refs.galeryList.innerHTML(markupImgCard)
}
