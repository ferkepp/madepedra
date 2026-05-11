import './style.css'
import '@phosphor-icons/web/regular/style.css'
import '@phosphor-icons/web/bold/style.css'
import '@phosphor-icons/web/fill/style.css'

// ========== CONFIGURAÇÃO CENTRAL ==========
const WHATSAPP = '5566997165092'

// ========== WHATSAPP URL BUILDER ==========
function waURL(msg) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`
}

// ========== TOAST SYSTEM ==========
function createToastContainer() {
  const container = document.createElement('div')
  container.id = 'toast-container'
  container.className = 'fixed top-24 right-6 z-[10000] flex flex-col gap-3 pointer-events-none'
  document.body.appendChild(container)
  return container
}

function showToast(message, type = 'success') {
  let container = document.getElementById('toast-container')
  if (!container) container = createToastContainer()

  const toast = document.createElement('div')
  const icon = type === 'success'
    ? '<i class="ph-fill ph-check-circle text-xl"></i>'
    : '<i class="ph-fill ph-warning-circle text-xl"></i>'
  const bgClass = type === 'success'
    ? 'bg-verde text-white'
    : 'bg-red-600 text-white'

  toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl ${bgClass} text-sm font-semibold toast-enter`
  toast.innerHTML = `${icon}<span>${message}</span>`
  container.appendChild(toast)

  requestAnimationFrame(() => toast.classList.add('toast-visible'))

  setTimeout(() => {
    toast.classList.remove('toast-visible')
    toast.classList.add('toast-exit')
    setTimeout(() => toast.remove(), 300)
  }, 3500)
}

// ========== BUTTON SPINNER / LOADING STATE ==========
function initButtonLoading() {
  document.querySelectorAll('[data-wa]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Don't block navigation, just show feedback
      const originalContent = btn.innerHTML
      const spinner = '<span class="btn-spinner"></span>'

      btn.classList.add('btn-loading')
      const textEl = btn.querySelector('span') || btn
      const origText = textEl.textContent

      // Add spinner before text
      btn.insertAdjacentHTML('afterbegin', spinner)
      btn.style.pointerEvents = 'none'

      showToast('Abrindo WhatsApp...', 'success')

      setTimeout(() => {
        btn.querySelector('.btn-spinner')?.remove()
        btn.classList.remove('btn-loading')
        btn.style.pointerEvents = ''
      }, 1500)
    })
  })
}

// ========== WHATSAPP LINKS ==========
function initWhatsappLinks() {
  const defaultMsg = 'Olá! Vim pelo site da MADEPEDRA e gostaria de um orçamento.'

  document.querySelectorAll('[data-wa]').forEach(el => {
    const msg = el.getAttribute('data-wa') || defaultMsg
    el.href = waURL(msg)
    el.target = '_blank'
    el.rel = 'noopener'
  })
}

// ========== MENU MOBILE ==========
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle')
  const nav = document.getElementById('mobile-nav')
  const overlay = document.getElementById('menu-overlay')

  if (!toggle || !nav) return

  function close() {
    toggle.classList.remove('active')
    nav.classList.remove('open')
    overlay?.classList.remove('open')
    document.body.style.overflow = ''
  }

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.contains('open')
    if (isOpen) {
      close()
    } else {
      toggle.classList.add('active')
      nav.classList.add('open')
      overlay?.classList.add('open')
      document.body.style.overflow = 'hidden'
    }
  })

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', close)
  })

  overlay?.addEventListener('click', close)
}

// ========== HEADER SCROLL EFFECT ==========
function initHeaderScroll() {
  const header = document.getElementById('header')
  if (!header) return

  let ticking = false
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 20)
        ticking = false
      })
      ticking = true
    }
  })
}

// ========== SCROLL REVEAL ANIMATIONS ==========
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal')
  if (!elements.length) return

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('visible'))
    return
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  )

  elements.forEach(el => observer.observe(el))
}

// ========== TESTIMONIALS CAROUSEL ==========
function initTestimonialCarousel() {
  const track = document.getElementById('testimonial-track')
  const dots = document.querySelectorAll('[data-dot]')
  const prevBtn = document.getElementById('testimonial-prev')
  const nextBtn = document.getElementById('testimonial-next')

  if (!track || !dots.length) return

  let currentPage = 0
  const totalPages = dots.length

  function goToPage(page) {
    currentPage = page
    const offset = page * 100
    track.style.transform = `translateX(-${offset}%)`

    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-terra', i === page)
      dot.classList.toggle('bg-terra/30', i !== page)
      dot.classList.toggle('w-8', i === page)
      dot.classList.toggle('w-3', i !== page)
    })
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToPage(parseInt(dot.getAttribute('data-dot')))
    })
  })

  prevBtn?.addEventListener('click', () => {
    goToPage(currentPage > 0 ? currentPage - 1 : totalPages - 1)
  })

  nextBtn?.addEventListener('click', () => {
    goToPage(currentPage < totalPages - 1 ? currentPage + 1 : 0)
  })

  // Auto-play
  let autoplay = setInterval(() => {
    goToPage(currentPage < totalPages - 1 ? currentPage + 1 : 0)
  }, 6000)

  // Pause on hover
  track.closest('section')?.addEventListener('mouseenter', () => clearInterval(autoplay))
  track.closest('section')?.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      goToPage(currentPage < totalPages - 1 ? currentPage + 1 : 0)
    }, 6000)
  })

  // Swipe support
  let startX = 0
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0
        ? goToPage(currentPage < totalPages - 1 ? currentPage + 1 : 0)
        : goToPage(currentPage > 0 ? currentPage - 1 : totalPages - 1)
    }
  }, { passive: true })
}

// ========== PROJECTS CAROUSEL ==========
function initProjectCarousel() {
  const track = document.getElementById('project-track')
  const dots = document.querySelectorAll('[data-project-dot]')
  const prevBtn = document.getElementById('project-prev')
  const nextBtn = document.getElementById('project-next')

  if (!track || !dots.length) return

  let currentSlide = 0
  const totalSlides = dots.length

  function goToSlide(index) {
    currentSlide = index
    track.style.transform = `translateX(-${index * 100}%)`

    dots.forEach((dot, i) => {
      dot.classList.toggle('bg-terra', i === index)
      dot.classList.toggle('bg-terra/30', i !== index)
      dot.classList.toggle('w-8', i === index)
      dot.classList.toggle('w-3', i !== index)
    })
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.getAttribute('data-project-dot')))
    })
  })

  prevBtn?.addEventListener('click', () => {
    goToSlide(currentSlide > 0 ? currentSlide - 1 : totalSlides - 1)
  })

  nextBtn?.addEventListener('click', () => {
    goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0)
  })

  // Auto-play every 5s
  let autoplay = setInterval(() => {
    goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0)
  }, 5000)

  const section = track.closest('section')
  section?.addEventListener('mouseenter', () => clearInterval(autoplay))
  section?.addEventListener('mouseleave', () => {
    autoplay = setInterval(() => {
      goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0)
    }, 5000)
  })

  // Swipe support
  let startX = 0
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive: true })
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0
        ? goToSlide(currentSlide < totalSlides - 1 ? currentSlide + 1 : 0)
        : goToSlide(currentSlide > 0 ? currentSlide - 1 : totalSlides - 1)
    }
  }, { passive: true })
}

// ========== SKELETON LOADER ==========
function initSkeletonLoader() {
  // Simulate content load — remove skeletons after DOM ready
  const skeletons = document.querySelectorAll('.skeleton-wrap')
  if (!skeletons.length) return

  setTimeout(() => {
    skeletons.forEach(sk => {
      sk.classList.add('skeleton-loaded')
      setTimeout(() => sk.remove(), 500)
    })
  }, 800)
}

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
  initWhatsappLinks()
  initButtonLoading()
  initMobileMenu()
  initHeaderScroll()
  initScrollReveal()
  initTestimonialCarousel()
  initProjectCarousel()
  initSkeletonLoader()
})
