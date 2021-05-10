const search_input = document.getElementById('search');
const results = document.getElementById('results');
const url = 'https://restcountries.eu/rest/v2/all?fields=flag;name;capital;region;population;alpha2Code;alpha3Code;borders;languages;timezones;currencies;latlng;area;';
const filtersUrl = 'https://restcountries.eu/rest/v2/all?fields=region;languages;timezones;currencies';
let search_term = '';
let countries;
let filters;
let activeFilters = false;

const fetchCountry = async () => {
    countries = await fetch(url)
        .then(response => response.json());
};

const fetchFilters = async () => {
    filters = await fetch(filtersUrl)
        .then(response => response.json());
};

function createElem(element) {
    return document.createElement(element);
};

function append(parent, elem) {
    return parent.appendChild(elem);
};

const showCountry = async (region = null, populationMin = null, populationMax = null, language = null, timezone = null, currency = null) => {
    if(results.innerHTML != ''){
        results.innerHTML = '';
    }

    await fetchCountry();

    const ul = createElem('ul');
    ul.classList.add('countries-list');

    if (region || language || timezone || currency || populationMin || populationMax) {
        countries
            .filter(country => {
                let languages = [];
                let currencies = [];
                country.languages.forEach(item => {
                    languages.push(item.name);
                })
                country.currencies.forEach(item => {
                    currencies.push(item.name);
                })
                return (timezone ? country.timezones.includes(timezone) : country) && (region ? country.region.includes(region) : country) && (populationMin ? country.population >= populationMin : country) &&
                    (populationMax ? country.population <= populationMax : country) && (language ? languages.includes(language) : country) &&
                    (currency ? currencies.includes(currency) : country)
            })

            .forEach(country => {
                //now we create the structure of the country card
                let li = createElem('li');
                li.setAttribute('code', `${country.alpha3Code}`);
                li.classList.add('country-item');

                let country_flag = createElem('img');
                country_flag.src = `${country.flag}`;
                country_flag.classList.add('country-flag');
                country_flag.setAttribute("id", 'country');

                let country_name = createElem('h3');
                country_name.innerText = `${country.name}`;
                country_name.classList.add('country-name');

                const country_info = createElem('div');
                country_info.classList.add('country-info');

                let country_capital = createElem('h5');
                country_capital.innerText = `${country.capital}`;
                country_capital.classList.add('country-capital');

                let country_region = createElem('p');
                country_region.innerText = `${country.region}`;
                country_region.classList.add('country-region');

                let country_population = createElem('p');
                country_population.innerText = `${country.population}`;
                country_population.classList.add('country-population');

                let country_alpha2code = createElem('p');
                country_alpha2code.innerText = `${country.alpha2Code}`;
                country_alpha2code.classList.add('country-alpha2code');
                country_alpha2code.style.display = 'none';

                let borders = `${country.borders}`;
                let country_borders = createElem('ul');
                country_borders.classList.add('country-borders');
                country_borders.style.display = "none";
                borders = borders.split(',');
                borders.forEach(border => {
                    countries.forEach(country => {
                        if (country.alpha3Code == border) {
                            let borderElement = createElem('li');
                            borderElement.setAttribute('alpha3', border);
                            borderElement.innerText = `${country.name}`;
                            country_borders.append(borderElement);
                        }
                    })
                })

                append(country_info, country_capital);
                append(country_info, country_region);
                append(country_info, country_population);
                append(country_info, country_borders);
                append(country_info, country_alpha2code);
                append(li, country_flag);
                append(li, country_name);
                append(li, country_info);
                append(ul, li);
                li.addEventListener("click", clickEvent);
            });
    } else {
        countries
            .filter(country => {
                return country.name.toLowerCase().includes(search_term.toLowerCase()) || country.capital.toLowerCase().includes(search_term.toLowerCase()) || country.alpha2Code.toLowerCase().includes(search_term.toLowerCase());
            })

            .forEach(country => {
                //now we create the structure of the country card
                let li = createElem('li');
                li.setAttribute('code', `${country.alpha3Code}`);
                li.classList.add('country-item');

                let country_flag = createElem('img');
                country_flag.src = `${country.flag}`;
                country_flag.classList.add('country-flag');
                country_flag.setAttribute("id", 'country');

                let country_name = createElem('h3');
                country_name.innerText = `${country.name}`;
                country_name.classList.add('country-name');

                const country_info = createElem('div');
                country_info.classList.add('country-info');

                let country_capital = createElem('h5');
                country_capital.innerText = `${country.capital}`;
                country_capital.classList.add('country-capital');

                let country_region = createElem('p');
                country_region.innerText = `${country.region}`;
                country_region.classList.add('country-region');

                const population_block = createElem('div');
                population_block.classList.add('population-block');

                let country_population = createElem('p');
                country_population.innerText = `${country.population}`;
                country_population.classList.add('country-population');
                let populationText = document.createTextNode("Population: ");

                let country_alpha2code = createElem('p');
                country_alpha2code.innerText = `${country.alpha2Code}`;
                country_alpha2code.classList.add('country-alpha2code');
                country_alpha2code.style.display = 'none';

                let borders = `${country.borders}`;
                let country_borders = createElem('ul');
                country_borders.classList.add('country-borders');
                country_borders.style.display = "none";
                borders = borders.split(',')
                borders.forEach(border => {
                    countries.forEach(country => {
                        if (country.alpha3Code == border) {
                            let borderElement = createElem('li');
                            borderElement.setAttribute('alpha3', border)
                            borderElement.innerText = `${country.name}`;
                            append(country_borders, borderElement);
                        }
                    })
                })

                append(country_info, country_capital);
                append(country_info, country_region);
                append(population_block, country_population);
                append(country_info, population_block);
                append(country_info, country_borders);
                append(country_info, country_alpha2code);
                append(li, country_flag);
                append(li, country_name);
                append(li, country_info);
                append(ul, li);
                li.addEventListener("click", clickEvent);
            });
    }

    append(results, ul);
    if (!results.querySelector('.countries-list').childElementCount) {
        ul.append('No matches');
    }
};

function clickEvent(evt) {
    var popup = document.getElementById('popup-country-info');
    popup.innerHTML = '';
    if (evt.target.tagName == 'LI') {
        popup.appendChild(evt.target.cloneNode(true));
    } else {
        popup.appendChild(evt.target.parentNode.cloneNode(true));
    }
    popup.querySelectorAll('.country-borders li').forEach(child => {
        child.addEventListener('click', openBorder);
    })
    popup.querySelectorAll('.country-alpha2code p').forEach(child => {
        child.addEventListener('click', openBorder);
    })
    openPopup();
}

var closeBtn = document.getElementsByClassName('closeBtn')[0];
closeBtn.addEventListener('click', openPopup);

//listen for click

function openPopup() {
    if (popup.style.display === "none" || popup.style.display == '') {
        popup.style.display = "block";
        popup.querySelector('.country-borders').style.display = "block";
        popup.querySelector('.country-alpha2code').style.display = "block";

    } else {
        popup.style.display = "none";
        popup.querySelector('.country-borders').style.display = "none";
        popup.querySelector('.country-alpha2code').style.display = "none";
    }
}

function openBorder(evt) {
    if (evt.target.tagName == 'LI') {
        if (activeFilters) {
            clearFilters();
            document.querySelector('li[code=' + evt.target.getAttribute('alpha3') + ']').click();
        } else {
            openPopup()
            document.querySelector('li[code=' + evt.target.getAttribute('alpha3') + ']').click();
        }
    }
}

const filtersBuilder = async () => {
    let regions = [];
    let timezones = [];
    let languages = [];
    let languagesFinal = [];
    let currencies = [];
    let currenciesFinal = [];

    await fetchFilters();

    filters.forEach(filter => {
        if (!regions.includes(filter.region)) {
            regions.push(filter.region);
        }

        filter.timezones.forEach(item => {
            if (!timezones.includes(item)) {
                timezones.push(item);
            }
        })

        filter.languages.forEach(language => {
            languages.push(language.name);
        })

        languagesFinal = languagesFinal.concat(languages.filter(x => !languagesFinal.includes(x)));
        languagesFinal.sort();

        filter.currencies.forEach(currency => {
            currencies.push(currency.name);
        })

        currenciesFinal = currenciesFinal.concat(currencies.filter(x => !currenciesFinal.includes(x)));
        currenciesFinal.sort();
    })

    regions.forEach(item => {
        let elem = document.createElement('option');
        elem.setAttribute('value', item);
        elem.innerHTML = item;
    })

    map(regions, document.querySelector('[name=region]'));
    map(timezones, document.querySelector('[name=timezone]'));
    map(languagesFinal, document.querySelector('[name=language]'));
    map(currenciesFinal, document.querySelector('[name=currency]'));

}

function map(array, container) {
    array.forEach(item => {
        let elem = document.createElement('option');
        elem.setAttribute('value', item);
        elem.innerHTML = item;
        container.append(elem);
    })
}

function filter() {
    let region = !document.querySelector('[name=region]').options[document.querySelector('[name=region]').selectedIndex].disabled ? document.querySelector('[name=region]').options[document.querySelector('[name=region]').selectedIndex].text : null;
    let populationMin = document.querySelector('[name=min]').value;
    let populationMax = document.querySelector('[name=max]').value;
    let timezone = !document.querySelector('[name=timezone]').options[document.querySelector('[name=timezone]').selectedIndex].disabled ? document.querySelector('[name=timezone]').options[document.querySelector('[name=timezone]').selectedIndex].text : null;
    let language = !document.querySelector('[name=language]').options[document.querySelector('[name=language]').selectedIndex].disabled ? document.querySelector('[name=language]').options[document.querySelector('[name=language]').selectedIndex].text : null;
    let currency = !document.querySelector('[name=currency]').options[document.querySelector('[name=currency]').selectedIndex].disabled ? document.querySelector('[name=currency]').options[document.querySelector('[name=currency]').selectedIndex].text : null;

    activeFilters = true;
    showCountry(region, populationMin, populationMax, language, timezone, currency);
}

document.getElementById('clear-filters').addEventListener('click', clearFilters);

function clearFilters() {
    activeFilters = false;
    document.querySelectorAll('.filter').forEach(item => {
        item.value = '';
    })
    document.getElementById('search').value = '';
    search_term = '';
    showCountry();
}

filtersBuilder();
document.querySelectorAll('.filter').forEach(item => {
    item.addEventListener('change', filter);
})
showCountry();

search_input.addEventListener('input', e => {
    activeFilters = true;
    search_term = e.target.value;
    showCountry();
});
