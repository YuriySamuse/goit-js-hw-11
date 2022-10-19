import './css/styles.css';
import PixabayAPI from './js/PixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { createGallery } from './js/createGallery';
import { refs } from './js/refs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  captionClass: 'custom-caption',
});

const pixabay = new PixabayAPI();
// console.log(pixabay);

const hendleSubmit = event => {
  event.preventDefault();
  clearPage();
  const inputQuery = event.currentTarget.elements.searchQuery.value
    .trim()
    .toLowerCase();
  if (inputQuery === '') {
    Notify.failure(
      'Вибачте, немає зображень, які відповідають вашому пошуковому запиту. Будь ласка спробуйте ще раз.'
    );
    return;
  }
  pixabay.query = inputQuery;
  clearPage();

  pixabay
    .getPhotos()
    .then(({ hits, total }) => {
      if (hits.length === 0) {
        Notify.info(`За вашим запитом "${inputQuery}" зображень не знайдено`);
        return;
      }

      //   console.log(pixabay);

      const markup = createGallery(hits);
      refs.markupGalleryRef.insertAdjacentHTML('beforeend', markup);
      lightbox.refresh();

      pixabay.calculateTotalPages(total);
      Notify.success(
        `За вашим запитом "${inputQuery}" знайдено ${total} зображень`
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
      lightbox.refresh();
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
