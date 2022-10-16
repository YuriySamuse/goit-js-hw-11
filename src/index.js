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
      'Вибачте, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз.'
    );
    return;
  }
  pixabay.searchQuery = searchingQuery;
  clearPage();

  pixabay
    .getPhotos()
    .then(({ hits, total }) => {
      if (hits.length === 0) {
        Notify.info(
          `За вашим запитом "${searchingQuery}" зображень не знайдено`
        );
        return;
      }

      const markup = createGallery(hits);
      refs.markupGalleryRef.insertAdjacentHTML('beforeend', markup);

      pixabay.calculateTotalPages(total);
      Notify.success(
        `За вашим запитом "${searchingQuery}" знайдено ${total} зображень`
      );
      if (pixabay.isShowLoadMore) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => {
      Notify.failure(error.message, 'Щось пішло не так!');
      clearPage();
    });
};

const onLadMore = () => {
  pixabay.incrementPage();

  if (!pixabay.isShowLoadMore) {
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  pixabay
    .getPhotos()
    .then(({ hits }) => {
      const markup = createGallery(hits);
      // console.log(markup);
      refs.markupGalleryRef.insertAdjacentHTML('beforeend', markup);
    })
    .catch(error => {
      Notify.failure(error.message, 'Щось пішло не так!');
      clearPage();
    });
};

refs.inputRef.addEventListener('submit', hendleSubmit);
refs.loadMoreBtn.addEventListener('click', onLadMore);

function clearPage() {
  pixabay.resetPage();
  refs.markupGalleryRef.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');
}
