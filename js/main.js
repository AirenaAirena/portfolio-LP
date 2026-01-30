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

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
  document.querySelectorAll('.menu__item--dropdown').forEach((item) => {
    if (!item.contains(e.target)) {
      item.querySelector('.dropdown-menu').classList.remove('active')
      item.querySelector('.arrow-icon').classList.remove('rotate')
    }
  })
})

// Кнопка поиска в меню
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

// Модальные окна
const btnCart = document.querySelector('.btn-cart')
const btnFind = document.querySelector('.btn-find')
const modalCart = document.querySelector('.modal-cart')
const modalFind = document.querySelector('.modal-find')
const overlay = document.querySelector('.modal-overlay')
const closeButtons = document.querySelectorAll('.close-modal')

function openModal(modal) {
  modal.classList.add('active')
  overlay.classList.add('active')
}

function closeModal(modal) {
  modal.classList.remove('active')
  overlay.classList.remove('active')
}

btnCart.addEventListener('click', () => openModal(modalCart))
btnFind.addEventListener('click', () => openModal(modalFind))

// Закрытие по overlay
overlay.addEventListener('click', () => {
  closeModal(modalCart)
  closeModal(modalFind)
})

// Закрытие по кнопкам "Close"
closeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    closeModal(modalCart)
    closeModal(modalFind)
  })
})

const burger = document.querySelector('.burger')
const menu = document.querySelector('nav.menu')

burger.addEventListener('click', () => {
  burger.classList.toggle('active') // меняем внешний вид бургера
  menu.classList.toggle('active') // показываем/скрываем меню
})
