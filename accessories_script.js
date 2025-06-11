// Accessories page JavaScript - Simplified without scroll functionality

document.addEventListener("DOMContentLoaded", () => {
  console.log("Accessories page loaded")

  // Initialize functionality
  initializeFilters()
  initializeNewsletter()
  initializeProductInteractions()
  initializeAnimations()
  initializeSearch()
})

// Initialize filters
function initializeFilters() {
  const sortSelect = document.getElementById("sort-select")
  const categorySelect = document.getElementById("category-select")
  const priceSelect = document.getElementById("price-select")

  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      sortProducts(e.target.value)
      showNotification(`Sorted by: ${e.target.value}`, "info")
    })
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", (e) => {
      filterByCategory(e.target.value)
      showNotification(`Filtered by: ${e.target.value}`, "info")
    })
  }

  if (priceSelect) {
    priceSelect.addEventListener("change", (e) => {
      filterByPrice(e.target.value)
      showNotification(`Price filter: ${e.target.value}`, "info")
    })
  }
}

// Sort products
function sortProducts(sortBy) {
  const sections = document.querySelectorAll(".product-grid")

  sections.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".product-card"))

    const cardData = cards.map((card) => {
      const name = card.querySelector("h3").textContent
      const priceText = card.querySelector(".price").textContent
      const price = Number.parseInt(priceText.replace(/[₹,]/g, ""))
      const ratingElement = card.querySelector(".rating span")
      const rating = ratingElement ? Number.parseFloat(ratingElement.textContent.replace(/[()]/g, "")) : 0

      return { element: card, name, price, rating }
    })

    let sortedData
    switch (sortBy) {
      case "Price: Low to High":
        sortedData = cardData.sort((a, b) => a.price - b.price)
        break
      case "Price: High to Low":
        sortedData = cardData.sort((a, b) => b.price - a.price)
        break
      case "Best Rated":
        sortedData = cardData.sort((a, b) => b.rating - a.rating)
        break
      case "Newest First":
        sortedData = cardData.reverse()
        break
      default:
        sortedData = cardData
    }

    // Clear and re-append
    grid.innerHTML = ""
    sortedData.forEach((item) => {
      grid.appendChild(item.element)
    })
  })
}

// Filter by category
function filterByCategory(category) {
  const cards = document.querySelectorAll(".product-card")
  let visibleCount = 0

  cards.forEach((card) => {
    const cardCategory = card.dataset.category
    const productName = card.querySelector("h3").textContent.toLowerCase()

    let show = true

    if (category !== "All Categories") {
      const categoryLower = category.toLowerCase()
      show = cardCategory === categoryLower || productName.includes(categoryLower)
    }

    card.style.display = show ? "block" : "none"
    if (show) visibleCount++
  })

  // Show count in notification
  if (category !== "All Categories") {
    showNotification(`Found ${visibleCount} products in ${category}`, "success")
  }
}

// Filter by price
function filterByPrice(priceRange) {
  const cards = document.querySelectorAll(".product-card")
  let visibleCount = 0

  cards.forEach((card) => {
    const price = Number.parseInt(card.dataset.price)
    let show = true

    switch (priceRange) {
      case "Under ₹1,000":
        show = price < 1000
        break
      case "₹1,000 - ₹3,000":
        show = price >= 1000 && price <= 3000
        break
      case "₹3,000 - ₹5,000":
        show = price >= 3000 && price <= 5000
        break
      case "Above ₹5,000":
        show = price > 5000
        break
      default:
        show = true
    }

    card.style.display = show ? "block" : "none"
    if (show) visibleCount++
  })

  // Show count in notification
  if (priceRange !== "All Prices") {
    showNotification(`Found ${visibleCount} products in ${priceRange}`, "success")
  }
}

// Initialize newsletter
function initializeNewsletter() {
  const subscribeBtn = document.getElementById("subscribe-btn")
  const emailInput = document.getElementById("newsletter-email")

  if (subscribeBtn && emailInput) {
    subscribeBtn.addEventListener("click", () => {
      const email = emailInput.value.trim()

      if (!email) {
        showNotification("Please enter your email address", "error")
        return
      }

      if (!isValidEmail(email)) {
        showNotification("Please enter a valid email address", "error")
        return
      }

      // Simulate subscription
      subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...'
      subscribeBtn.disabled = true

      setTimeout(() => {
        showNotification("Successfully subscribed to our newsletter!", "success")
        emailInput.value = ""
        subscribeBtn.innerHTML = "Subscribe"
        subscribeBtn.disabled = false
      }, 1500)
    })

    emailInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        subscribeBtn.click()
      }
    })
  }
}

// Initialize product interactions
function initializeProductInteractions() {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.querySelector("h3").textContent
      const price = card.querySelector(".price").textContent
      showNotification(`${name} - ${price}. Contact us for more details!`, "info")
    })
  })
}

// Initialize animations
function initializeAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        }
      })
    },
    { threshold: 0.1 },
  )

  const animatedElements = document.querySelectorAll(".product-card")
  animatedElements.forEach((el, index) => {
    el.classList.add("fade-in")
    el.style.transitionDelay = `${index * 0.05}s`
    observer.observe(el)
  })
}

// Initialize search functionality
function initializeSearch() {
  const searchInput = document.querySelector(".search-box input")
  const searchIcon = document.querySelector(".search-box i")

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase()

    if (searchTerm) {
      const cards = document.querySelectorAll(".product-card")
      let found = 0

      cards.forEach((card) => {
        const name = card.querySelector("h3").textContent.toLowerCase()
        const desc = card.querySelector("p").textContent.toLowerCase()

        if (name.includes(searchTerm) || desc.includes(searchTerm)) {
          card.style.display = "block"
          found++
        } else {
          card.style.display = "none"
        }
      })

      if (found > 0) {
        showNotification(`Found ${found} products for "${searchTerm}"`, "success")
      } else {
        showNotification(`No results found for "${searchTerm}"`, "info")
      }
    } else {
      // Show all products if search is empty
      const cards = document.querySelectorAll(".product-card")
      cards.forEach((card) => {
        card.style.display = "block"
      })
    }
  }

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
  }

  if (searchIcon) {
    searchIcon.addEventListener("click", handleSearch)
  }
}

// Utility functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function showNotification(message, type = "info") {
  // Remove existing notifications
  const existing = document.querySelectorAll(".notification")
  existing.forEach((n) => n.remove())

  const notification = document.createElement("div")
  notification.className = `notification ${type}`

  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
      <span>${message}</span>
      <button class="notification-close">&times;</button>
    </div>
  `

  document.body.appendChild(notification)

  // Close functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    notification.style.animation = "slideOutRight 0.3s ease-out"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = "slideOutRight 0.3s ease-out"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Add reset filters functionality
function resetAllFilters() {
  // Reset all select elements
  document.getElementById("sort-select").value = "Featured"
  document.getElementById("category-select").value = "All Categories"
  document.getElementById("price-select").value = "All Prices"

  // Show all products
  const cards = document.querySelectorAll(".product-card")
  cards.forEach((card) => {
    card.style.display = "block"
  })

  showNotification("All filters reset", "info")
}

// Add keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + K to focus search
  if ((e.ctrlKey || e.metaKey) && e.key === "k") {
    e.preventDefault()
    const searchInput = document.querySelector(".search-box input")
    if (searchInput) {
      searchInput.focus()
    }
  }

  // Escape to clear search
  if (e.key === "Escape") {
    const searchInput = document.querySelector(".search-box input")
    if (searchInput && searchInput.value) {
      searchInput.value = ""
      const cards = document.querySelectorAll(".product-card")
      cards.forEach((card) => {
        card.style.display = "block"
      })
      showNotification("Search cleared", "info")
    }
  }
})
