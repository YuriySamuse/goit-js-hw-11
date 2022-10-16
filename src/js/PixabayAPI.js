const API_KEY = '4214875-78e3ff66b8a1fc23d203f30eb';
const BASE_URL = 'https://pixabay.com/api/';

export class PixabayAPI {
  #page = 1;
  #searchQuery = '';

  getPhotos() {
    return fetch(
      `${BASE_URL}?key=${API_KEY}&q=${
        this.#searchQuery
      }&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${
        this.#page
      }`
    ).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }
  set searchQuery(newQuery) {
    this.#searchQuery = newQuery;
  }

  get searchQuery() {
    return this.#searchQuery;
  }

  incrementPage() {
    this.#page += 1;
  }
}
