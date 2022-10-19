import axios from 'axios';

export default class PixabayAPI {
  constructor() {
    this.page = 1;
    this.searchQuery = '';
    this.totalPages = 0;
    this.fetchedImages = 0;
  }

  BASE_URL = 'https://pixabay.com/api/';
  RESPONSE_OK = 200;

  searchParams = {
    key: '4214875-78e3ff66b8a1fc23d203f30eb',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: 1,
    per_page: 40,
  };

  async getPhotos() {
    const { searchParams, BASE_URL, RESPONSE_OK } = this;
    searchParams.q = this.query;
    searchParams.page = this.page;
    const response = await axios.get(BASE_URL, { params: searchParams });
    if (response.status !== RESPONSE_OK) {
      throw new Error(response.status);
    }
    this.total = response.data.total;
    this.fetchedImages += response.data.hits.length;
    return response.data;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  get query() {
    return this.searchQuery;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
    this.fetchedImages = 0;
    this.total = 0;
  }

  calculateTotalPages(total) {
    this.totalPages = Math.ceil(total / this.fetchedImages);
  }

  get isShowLoadMore() {
    return this.page < this.totalPages;
  }
}
