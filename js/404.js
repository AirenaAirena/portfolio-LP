document.addEventListener('DOMContentLoaded', () => {
  const content = document.querySelector('.error__content')
  if (content) {
    setTimeout(() => content.classList.add('is-visible'), 100)
  }

  // "Go Back"
  const backBtn = document.querySelector('.btn-back')
  if (backBtn) {
    backBtn.addEventListener('click', () => history.back())
  }
})
