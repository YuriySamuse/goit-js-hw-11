import './css/styles.css';
import { PixabayAPI } from './js/PixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createGallery } from './js/createGallery';
import { refs } from './js/refs';

const pixabay = new PixabayAPI();
// console.log(pixabay);

const hendleSubmit = event => {
  event.preventDefault();
  const {
    elements: { searchQuery },
  } = event.currentTarget;
  const searchingQuery = searchQuery.value.trim().toLowerCase();
  if (!searchingQuery) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  pixabay.searchQuery = searchingQuery;

  pixabay.getPhotos().then(({ hits }) => {
    const markup = createGallery(hits);
    // console.log(markup);
    refs.markupGalleryRef.insertAdjacentHTML('beforeend', markup);
  });
};

const onLadMore = () => {
  pixabay.incrementPage();
  pixabay.getPhotos().then(({ hits }) => {
    const markup = createGallery(hits);
    // console.log(markup);
    refs.markupGalleryRef.insertAdjacentHTML('beforeend', markup);
  });
};

refs.inputRef.addEventListener('submit', hendleSubmit);
refs.ladMoreBtn.addEventListener('click', onLadMore);
