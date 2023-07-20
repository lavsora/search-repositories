const searchInput = document.querySelector('.search-input');
const searchList = document.querySelector('.search-list');
const repositoryList = document.querySelector('.repository-list');

const fragment = document.createDocumentFragment();

const url = new URL('https://api.github.com/search/repositories')

const onAdditionRepository = (response) => {
    return function(event) {
        const currentID = event.target.dataset.id;

        repositoryList.insertAdjacentHTML(
            'afterbegin',
            `<li class="repository-list__item">
                    <ul>
                      <li>Name: ${response.items[currentID].name}</li>
                      <li>Owner: ${response.items[currentID].owner.login}</li>
                      <li>Stars: ${response.items[currentID].stargazers_count}</li>
                    </ul>
                      <div class="repository-list__close-btn" data-cross>X</div>
                   </li>`
        )

        searchInput.value = '';
        searchList.innerHTML = '';
    }
}

const onChangeInput = (event) => {
    url.searchParams.set('q', event.target.value);

    if (searchInput.value.trim().length !== 0) {
        fetch(url)
            .then((response) => response.json())
            .then((response) => autoCompleter(response))
            .catch((err) => console.log(err))
    } else {
        searchList.innerHTML = ''
    }
}

const autoCompleter = (response) => {
    searchList.innerHTML = '';

    for (let i = 0; i < 5; i++) {
        const searchListItem = document.createElement('li');
        searchListItem.textContent = response.items[i].name;
        searchListItem.classList.add('search-list__item')
        searchListItem.setAttribute('data-id', `${i}`);

        fragment.appendChild(searchListItem);
    }

    searchList.appendChild(fragment);

    searchList.onclick = onAdditionRepository(response);
}

const removeItem = (event) => {
    if (event.target.dataset.cross !== undefined) event.target.closest('li').remove();
}

const debounce = (func, ms) => {
    let timeout;

    return function() {
        const fnCall = () => {
            func.apply(this, arguments);
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, ms);
    };
}

searchInput.addEventListener('keyup', debounce(onChangeInput, 300));
document.addEventListener('click', removeItem);