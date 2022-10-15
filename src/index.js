import './css/styles.css';
import { fetchImg } from './js/fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  inputRef: document.querySelector('#search-form'),
  serchBtnRef: document.querySelector('.country-list'),
  markupGalleryRef: document.querySelector('.gallery'),
};

let importValue = '';

fetchImg(importValue).then(data => {
  console.log(data);
});
