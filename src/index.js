import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import Notiflix from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import debounce from 'lodash.debounce';

const refs = {
  searchBox: document.getElementById('search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;

refs.searchBox.addEventListener(
  'input',
  debounce(onInputCountry, DEBOUNCE_DELAY)
);

function onInputCountry(e) {
  const countryName = e.target.value.trim();

  if (countryName === '') {
    refs.countryInfo.innerHTML = '';
    refs.countryList.innerHTML = '';
    return;
  }

  fetchCountries(countryName)
    .then(countries => {
      if (countries.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        refs.countryInfo.innerHTML = '';
        refs.countryList.innerHTML = '';
        return;
      }

      if (countries.length <= 10) {
        const listMarkup = countries.map(country => countryListMurkup(country));
        refs.countryList.innerHTML = listMarkup.join('');
        refs.countryInfo.innerHTML = '';
      }

      if (countries.length === 1) {
        const markup = countries.map(country => countryInfoMurkup(country));
        refs.countryInfo.innerHTML = markup.join('');
        refs.countryList.innerHTML = '';
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      return error;
    });
}

function countryListMurkup({ flags, name }) {
  return `
    <li class="country-list__item"><img class="country-list__flags" src="${flags.svg}" alt="${name.official}"/>
    <span> ${name.official}<span>
    </li>
  `;
}

function countryInfoMurkup({ flags, name, capital, population, languages }) {
  return `
    <div>
      <div class="country-info__box">
        <img class="country-info__flag" src="${flags.svg}" alt="${
    name.official
  }"/>
        <h2 class="country-info__name">${name.official}</h2>
      </div>
      <ul class="country-info__list">
        <li><span style="font-weight:700;">Capital:</span> ${capital}</li>
        <li><span style="font-weight:700;">Population:</span> ${population}</li>
        <li><span style="font-weight:700;">Languages:</span> ${Object.values(
          languages
        ).join(', ')}</li>
      </ul>
    </div>

  `;
}
