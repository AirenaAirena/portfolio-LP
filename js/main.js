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

const searchForm = document.querySelector('.search-form')
const toggleBtn = document.querySelector('.search-toggle')

toggleBtn.addEventListener('click', (e) => {
  e.stopPropagation() // чтобы клик не "улетал" дальше
  searchForm.classList.toggle('active')
})

// Закрытие при клике вне поиска
document.addEventListener('click', (e) => {
  if (
    !e.target.closest('.search-form') &&
    !e.target.closest('.search-toggle')
  ) {
    searchForm.classList.remove('active')
  }
})

// ================= MODALS BASE =================
const overlay = document.querySelector('.modal-overlay')
const closeButtons = document.querySelectorAll('.close-modal, .modal-close')

function openModal(modal) {
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  modal.classList.remove('active')
  overlay.classList.remove('active')
  if (sliderInterval) clearInterval(sliderInterval)
}

overlay.addEventListener('click', () => {
  document
    .querySelectorAll('.modal.active')
    .forEach((modal) => closeModal(modal))
})

closeButtons.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    const modal = e.target.closest('.modal')
    if (modal) closeModal(modal)
  })
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
