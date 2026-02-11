document.querySelectorAll('.menu__item--dropdown').forEach((item) => {
  const menuLinkProp = item.querySelector('.menu__link-prop')
  const dropdownMenu = item.querySelector('.dropdown-menu')
  const arrowIcon = item.querySelector('.arrow-icon')

  menuLinkProp.addEventListener('click', (e) => {
    e.preventDefault() // чтобы ссылка не прыгала
    dropdownMenu.classList.toggle('active')
    arrowIcon.classList.toggle('rotate') // стрелка вверх/вниз
  })
})

document.addEventListener('click', (e) => {
  document.querySelectorAll('.menu__item--dropdown').forEach((item) => {
    if (!item.contains(e.target)) {
      item.querySelector('.dropdown-menu').classList.remove('active')
      item.querySelector('.arrow-icon').classList.remove('rotate')
    }
  })
})

document.addEventListener('click', (e) => {
  if (
    !e.target.closest('.search-form') &&
    !e.target.closest('.search-toggle')
  ) {
    // searchForm.classList.remove('.active')
  }
})

// ================= MODALS BASE =================
const overlay = document.querySelector('.modal-overlay')
const closeButtons = document.querySelectorAll('.close-modal, .modal-close')

function openModal(modal) {
  modal.classList.add('active')
  overlay.classList.add('active')
  document.body.classList.add('modal-open')
}

function closeModal(modal) {
  modal.classList.remove('active')
  if (modal.classList.contains('modal-find')) {
    const form = modal.querySelector('form')
    const results = modal.querySelector('.search-results')

    if (form) form.reset()
    if (results) results.innerHTML = ''
  }

  if (!document.querySelector('.modal.active')) {
    overlay.classList.remove('active')
    document.body.classList.remove('modal-open')
  }

  if (sliderInterval) clearInterval(sliderInterval)
}
document.querySelectorAll('[data-modal]').forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.preventDefault()
    const modal = document.querySelector(`.${btn.dataset.modal}`)
    if (modal) openModal(modal)
  })
})

overlay.addEventListener('click', () => {
  document
    .querySelectorAll('.modal.active')
    .forEach((modal) => closeModal(modal))
})

document.addEventListener('click', (e) => {
  if (e.target.closest('.close-modal, .modal-close')) {
    const modal = e.target.closest('.modal')
    if (modal) closeModal(modal)
  }
})

// cart / find
document
  .querySelector('.btn-cart')
  .addEventListener('click', () =>
    openModal(document.querySelector('.modal-cart')),
  )

document
  .querySelector('.btn-find')
  .addEventListener('click', () =>
    openModal(document.querySelector('.modal-find')),
  )

// ================= APARTMENT MODAL =================
const apartmentModal = document.querySelector('#apartment-modal')

const modalTitle = apartmentModal.querySelector('.modal-title')
const modalPrice = apartmentModal.querySelector('.modal-price')
const modalLocation = apartmentModal.querySelector('.modal-location')
const modalStats = apartmentModal.querySelector('.modal-stats')
const modalDescription = apartmentModal.querySelector('.modal-description')
const modalGallery = apartmentModal.querySelector('.modal-gallery')
const track = apartmentModal.querySelector('.modal-gallery__track')

let sliderIndex = 0
let sliderInterval = null

document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('click', () => {
    openModal(apartmentModal)

    clearInterval(sliderInterval)
    sliderIndex = 0
    track.innerHTML = ''

    modalTitle.textContent = card.querySelector('.card__title').textContent

    modalPrice.textContent = card.querySelector('.card__price').textContent

    modalLocation.innerHTML = card.querySelector('.card__location').innerHTML

    modalStats.innerHTML = card.querySelector('.card__stats').innerHTML

    modalDescription.textContent =
      card.dataset.description || 'Nice cozy apartment for living.'

    const images = card.dataset.images
      ? card.dataset.images.split(',')
      : [card.querySelector('img').src]

    const sliderImages = [...images, ...images]

    sliderImages.forEach((src) => {
      const img = document.createElement('img')
      img.src = src.trim()
      track.appendChild(img)
    })

    const slideWidth = modalGallery.offsetWidth

    sliderInterval = setInterval(() => {
      sliderIndex++
      track.style.transform = `translateX(-${slideWidth * sliderIndex}px)`

      if (sliderIndex === images.length) {
        setTimeout(() => {
          track.style.transition = 'none'
          sliderIndex = 0
          track.style.transform = 'translateX(0)'
          track.offsetHeight
          track.style.transition = 'transform 0.5s ease'
        }, 500)
      }
    }, 2000)
  })
})

// ================= FIND PROPERTY MODAL SEARCH =================
const findModal = document.querySelector('.modal-find')
const findForm = findModal.querySelector('form')
const findResults = findModal.querySelector('.search-results')
// let findResults = findModal.querySelector('.search-results')

// если контейнера для результатов нет — создаем
// if (!findResults) {
//   findResults = document.createElement('div')
//   findResults.classList.add('find-results')
//   findModal.appendChild(findResults)
// }

findForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const city = findForm.querySelector('#city').value.toLowerCase().trim()
  const priceFrom = parseFloat(findForm.querySelector('#price').value) || 0
  const priceTo =
    parseFloat(findForm.querySelector('#priceto').value) || Infinity

  const cards = document.querySelectorAll(
    '.listings__grid .card:not(.find-result-card)',
  )
  findResults.innerHTML = '' // очищаем прошлые результаты

  let foundAny = false

  cards.forEach((card) => {
    const cardCity =
      card.querySelector('.card__location span')?.textContent.toLowerCase() ||
      ''
    const cardPriceStr = card
      .querySelector('.card__price')
      ?.textContent.replace(/[^0-9.]/g, '')
    const cardPrice = parseFloat(cardPriceStr) || 0

    if (
      cardCity.includes(city) &&
      cardPrice >= priceFrom &&
      cardPrice <= priceTo
    ) {
      // создаем мини-копию карточки для результатов
      const clone = card.cloneNode(true)
      clone.classList.add('find-result-card')
      clone.addEventListener('click', () => {
        const data = getCardData(card)
        openApartmentModalFromCart(data)
      })
      // clone.addEventListener('click', (e) => e.stopPropagation())
      findResults.appendChild(clone)
      foundAny = true
    }
  })
  if (!foundAny) {
    findResults.innerHTML = '<p>No results found.</p>'
  }
})
//burger
const burger = document.querySelector('.burger')
const menu = document.querySelector('nav.menu')

burger.addEventListener('click', () => {
  burger.classList.toggle('active') // меняем внешний вид бургера
  menu.classList.toggle('active') // показываем/скрываем меню
})

const scrollTopBtn = document.querySelector('.scroll-top')

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle(
    'is-visible',
    window.scrollY > window.innerHeight,
  )
})

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// CART
const cartItemsList = document.querySelector('.cart-items')
const CART_KEY = 'apartments_cart'
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || []
function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  saveCart()
  renderCart()
}

function showCartMessage() {
  const toast = document.querySelector('.cart-toast')
  toast.classList.add('active')
  setTimeout(() => toast.classList.remove('active'), 2000)
}

function addToCart(item) {
  if (!cart.find((i) => i.id === item.id)) {
    cart.push(item)
    saveCart()
    renderCart()
    showCartMessage()
  } else {
    alert('This apartment is already in the cart')
  }
}
function getCardData(card) {
  return {
    id: card.dataset.id || Date.now().toString(),
    title: card.querySelector('.card__title').textContent,
    price: card.querySelector('.card__price').textContent,
    image: card.querySelector('img').src,
    images: card.dataset.images
      ? card.dataset.images.split(',')
      : [card.querySelector('img').src],
    location: card.querySelector('.card__location').innerHTML,
    stats: card.querySelector('.card__stats').innerHTML,
    description: card.dataset.description || 'Nice cozy apartment for living.',
  }
}

function renderCart() {
  cartItemsList.innerHTML = ''
  cart.forEach((item) => {
    const li = document.createElement('li')
    li.classList.add('cart-item')
    li.innerHTML = `
      <img src="${item.image}" alt="${item.title}" />
      <div class="cart-info">
        <span class="cart-title">${item.title}</span>
        <span class="cart-price">${item.price}</span>
      </div>
      <button class="remove-item">Remove</button>
    `

    li.addEventListener('click', (e) => {
      if (!e.target.classList.contains('remove-item')) {
        openApartmentModalFromCart(item)
      }
    })

    // Кнопка удалить
    li.querySelector('.remove-item').addEventListener('click', (e) => {
      e.stopPropagation()
      removeFromCart(item.id)
    })

    cartItemsList.appendChild(li)
  })
}

document.querySelector('.modal-add-to-cart').addEventListener('click', () => {
  const modal = document.querySelector('#apartment-modal')
  const item = {
    id: modal.dataset.id || Date.now().toString(),
    title: modal.querySelector('.modal-title').textContent,
    price: modal.querySelector('.modal-price').textContent,
    image: modal.querySelector('.modal-gallery img').src,
    images: Array.from(modal.querySelectorAll('.modal-gallery img')).map(
      (i) => i.src,
    ),
    location: modal.querySelector('.modal-location').innerHTML,
    stats: modal.querySelector('.modal-stats').innerHTML,
    description: modal.querySelector('.modal-description').textContent,
  }
  addToCart(item)
})
function openApartmentModalFromCart(item) {
  const modal = document.querySelector('#apartment-modal')
  openModal(modal)

  // Заполняем поля
  modal.querySelector('.modal-title').textContent = item.title
  modal.querySelector('.modal-price').textContent = item.price
  modal.querySelector('.modal-location').innerHTML = item.location
  modal.querySelector('.modal-stats').innerHTML = item.stats
  modal.querySelector('.modal-description').textContent = item.description

  const track = modal.querySelector('.modal-gallery__track')
  track.innerHTML = ''
  ;(item.images || [item.image]).forEach((src) => {
    const img = document.createElement('img')
    img.src = src
    track.appendChild(img)
  })

  const addBtn = modal.querySelector('.modal-add-to-cart')
  if (addBtn) addBtn.style.display = 'none'
}
renderCart()

//findModal
//senden form
const contactForm = document
  .getElementById('contact-modal')
  ?.querySelector('form')

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault() // отменяем стандартную отправку

    const formData = new FormData(contactForm)
    const data = Object.fromEntries(formData.entries())

    console.log('Forma Contact agent:', data)
    alert(`Thank, ${data.name}! you for your message.`)

    contactForm.reset()

    const modal = contactForm.closest('.modal')
    if (modal) {
      modal.classList.remove('active')
      document.querySelector('.modal-overlay').classList.remove('active')
      document.body.classList.remove('modal-open')
    }
  })
}
