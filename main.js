// ============================================================================
// Datos del sello (editar acá para actualizar contenido)
// ============================================================================

const RELEASES = [
  {
    titulo: 'Pa Wacha Ka',
    artista: 'Paprika Spicy',
    año: 2025,
    link: 'https://open.spotify.com/intl-es/album/7nXaxBtaLy3MzLILxFxyoN',
    cover: 'assets/images/paprika-pawachaka.png'
  }
]

const BANDS = [
  {
    nombre: 'Paprika Spicy',
    imagen: 'assets/images/paprika.JPG',
    tags: ['alternativo', 'grunge', 'punk', 'shoegaze'],
    bio: 'Banda creada por amigos a mediados de septiembre de 2023, y formalizando con el primer concierto en diciembre de ese año. Paprika busca traer un sonido distinto, sin estructura y variado; haciendo desde el Punk-Rock más simple hasta Shoegaze. El 29 de diciembre de 2025 sacaron "Pa Wacha Ka", su primer sencillo y adelanto del próximo álbum. Paprika, de Bahía para todo el mundo.',
    redes: {
      spotify: 'https://open.spotify.com/intl-es/artist/63oydwT8lSZtuA7K41zBeI',
      instagram: 'https://www.instagram.com/_p4prik4/',
      youtube: 'https://www.youtube.com/@PAPRIKASPICYOFFICIA'
    }
  }
]

// ============================================================================
// Navegación por pestañas
// ============================================================================

const initNavigation = () => {
  const navLinks = document.querySelectorAll('.nav__link, .nav__link-action')
  const sections = document.querySelectorAll('.section')
  const slider = document.querySelector('.slider')
  const main = document.querySelector('.main')

  const activateSection = (targetId) => {
    const sectionId = `section-${targetId}`
    const isHome = targetId === 'home'

    sections.forEach(section => {
      const isTarget = section.id === sectionId
      section.classList.toggle('is-active', isTarget)
      section.hidden = !isTarget
    })

    navLinks.forEach(link => {
      const linkTarget = link.getAttribute('href').slice(1)
      const isActive = linkTarget === targetId
      link.classList.toggle('is-active', isActive)
      link.setAttribute('aria-selected', isActive)
    })

    // Mostrar slider solo en home
    if (slider && main) {
      if (isHome) {
        slider.style.display = ''
        main.style.gridTemplateColumns = ''
      } else {
        slider.style.display = 'none'
        main.style.gridTemplateColumns = '1fr'
      }
    }
  }

  const handleNavClick = (e) => {
    e.preventDefault()
    const targetId = e.currentTarget.getAttribute('href').slice(1)
    activateSection(targetId)
    history.pushState(null, '', `#${targetId}`)
  }

  navLinks.forEach(link => {
    link.addEventListener('click', handleNavClick)
  })

  // Hash inicial
  const initialHash = window.location.hash.slice(1) || 'home'
  activateSection(initialHash)

  // Manejar navegación con botones del navegador
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1) || 'home'
    activateSection(hash)
  })
}

// ============================================================================
// Slider de imágenes
// ============================================================================

const initSlider = () => {
  const images = document.querySelectorAll('.slider__img')
  if (images.length === 0) return

  let currentIndex = 0
  const interval = 4000

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const nextSlide = () => {
    images[currentIndex].classList.remove('is-active')
    currentIndex = (currentIndex + 1) % images.length
    images[currentIndex].classList.add('is-active')
  }

  if (!prefersReducedMotion) {
    setInterval(nextSlide, interval)
  }
}

// ============================================================================
// Render de contenido dinámico
// ============================================================================

const renderReleases = () => {
  const container = document.getElementById('releases-grid')
  if (!container) return

  const fragment = document.createDocumentFragment()

  RELEASES.forEach(release => {
    const article = document.createElement('a')
    article.href = release.link
    article.target = '_blank'
    article.rel = 'noopener'
    article.className = 'release'

    article.innerHTML = `
      <div class="release__cover">
        ${release.cover ? `<img src="${release.cover}" alt="${release.titulo}">` : ''}
      </div>
      <div class="release__info">
        <span class="release__title">${release.titulo}</span>
        <span class="release__artist">${release.artista}</span>
        <span class="release__year">${release.año}</span>
      </div>
    `

    fragment.appendChild(article)
  })

  container.appendChild(fragment)
}

const renderBands = () => {
  const container = document.getElementById('bands-list')
  if (!container) return

  const fragment = document.createDocumentFragment()

  BANDS.forEach((band, index) => {
    const article = document.createElement('article')
    article.className = 'band-card'
    article.onclick = () => openModal(index)

    const tagsHtml = band.tags.map(tag => `<span class="band__tag">${tag}</span>`).join('')

    const socialHtml = Object.entries(band.redes).map(([platform, url]) => `
      <a href="${url}" target="_blank" rel="noopener" class="band-social__link" aria-label="${platform}" onclick="event.stopPropagation()">
        <i class="fa-brands fa-${platform}"></i>
      </a>
    `).join('')

    article.innerHTML = `
      <div class="band-card__image">
        <img src="${band.imagen}" alt="${band.nombre}">
      </div>
      <div class="band-card__content">
        <h3 class="band-card__name">${band.nombre}</h3>
        <div class="band__tags">${tagsHtml}</div>
        <div class="band-card__social">
          ${socialHtml}
        </div>
      </div>
    `

    fragment.appendChild(article)
  })

  container.innerHTML = ''
  container.appendChild(fragment)
}

// ============================================================================
// Modal de Bandas (Bio)
// ============================================================================

const openModal = (index) => {
  const band = BANDS[index]
  const modal = document.getElementById('band-modal')
  const content = document.getElementById('modal-body')

  if (!modal || !content) return

  content.innerHTML = `
    <div class="modal__container">
      <div class="modal__image">
        <img src="${band.imagen}" alt="${band.nombre}">
      </div>
      <div class="modal__info">
        <h2 class="modal__title">${band.nombre}</h2>
        <div class="modal__bio">${band.bio}</div>
        <div class="modal__footer">
          <div class="band-card__social">
            ${Object.entries(band.redes).map(([platform, url]) => `
              <a href="${url}" target="_blank" rel="noopener" class="band-social__link" aria-label="${platform}">
                <i class="fa-brands fa-${platform}"></i>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `

  modal.classList.add('is-active')
  modal.setAttribute('aria-hidden', 'false')
  document.body.style.overflow = 'hidden'

  // Foco inicial en el botón de cerrar para accesibilidad
  const closeBtn = modal.querySelector('.modal__close')
  if (closeBtn) closeBtn.focus()
}

const closeModal = () => {
  const modal = document.getElementById('band-modal')
  if (modal) {
    modal.classList.remove('is-active')
    modal.setAttribute('aria-hidden', 'true')
    document.body.style.overflow = ''
  }
}

// ============================================================================
// Init
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initNavigation()
  initSlider()
  renderReleases()
  renderBands()

  // Cerrar modal
  const modal = document.getElementById('band-modal')
  const closeBtn = document.querySelector('.modal__close')

  if (closeBtn) closeBtn.onclick = closeModal
  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal()
    }
  }
})
