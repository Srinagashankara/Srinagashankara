// Search functionality
function handleSearch() {
  const searchInput = document.querySelector(".search-box input")
  const searchTerm = searchInput.value.toLowerCase()

  if (searchTerm) {
    // In a real application, this would filter products
    console.log("Searching for:", searchTerm)
    alert(`Searching for: ${searchTerm}`)
  }
}

// Product data for sorting and filtering
const productData = [
  {
    name: "HP Pavilion Gaming Desktop",
    brand: "HP",
    price: 85999,
    category: "desktop",
    rating: 4.5,
    element: null,
  },
  {
    name: "Dell OptiPlex 7090",
    brand: "Dell",
    price: 62499,
    category: "desktop",
    rating: 4.0,
    element: null,
  },
  {
    name: "Apple iMac 24-inch",
    brand: "Apple",
    price: 129900,
    category: "desktop",
    rating: 4.9,
    element: null,
  },
  {
    name: "ASUS ROG Strix G15",
    brand: "ASUS",
    price: 142990,
    category: "gaming",
    rating: 4.8,
    element: null,
  },
  {
    name: "MSI Katana GF66",
    brand: "MSI",
    price: 94990,
    category: "gaming",
    rating: 4.6,
    element: null,
  },
  {
    name: "Acer Predator Helios 300",
    brand: "Acer",
    price: 99990,
    category: "gaming",
    rating: 4.2,
    element: null,
  },
  {
    name: "Lenovo ThinkPad X1 Carbon",
    brand: "Lenovo",
    price: 124990,
    category: "business",
    rating: 4.9,
    element: null,
  },
  {
    name: "Dell Latitude 7420",
    brand: "Dell",
    price: 89990,
    category: "business",
    rating: 4.0,
    element: null,
  },
  {
    name: "HP EliteBook 840 G8",
    brand: "HP",
    price: 104990,
    category: "business",
    rating: 4.5,
    element: null,
  },
  {
    name: "Acer Aspire 5",
    brand: "Acer",
    price: 49990,
    category: "budget",
    rating: 4.0,
    element: null,
  },
  {
    name: "HP 15s",
    brand: "HP",
    price: 38990,
    category: "budget",
    rating: 3.5,
    element: null,
  },
  {
    name: "Lenovo IdeaPad Slim 3",
    brand: "Lenovo",
    price: 52990,
    category: "budget",
    rating: 4.0,
    element: null,
  },
  {
    name: "HP Pavilion 24 All-in-One",
    brand: "HP",
    price: 72990,
    category: "aio",
    rating: 4.0,
    element: null,
  },
  {
    name: "Lenovo IdeaCentre AIO 3",
    brand: "Lenovo",
    price: 68990,
    category: "aio",
    rating: 4.0,
    element: null,
  },
  {
    name: "Dell Inspiron 27 7000",
    brand: "Dell",
    price: 119990,
    category: "aio",
    rating: 4.5,
    element: null,
  },
]

// Horizontal scrolling functionality
const scrollPositions = {
  desktop: 0,
  gaming: 0,
  business: 0,
  budget: 0,
  aio: 0,
}

function initializeScrolling() {
  const scrollButtons = document.querySelectorAll(".scroll-btn")

  scrollButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const section = this.dataset.section
      const direction = this.classList.contains("scroll-left") ? "left" : "right"
      scrollSection(section, direction)
    })
  })
}

function scrollSection(section, direction) {
  const container = document.getElementById(`${section}-scroll`)
  if (!container) return

  const grid = container.querySelector(".product-grid-horizontal")
  const cardWidth = 324 // 300px card + 24px gap
  const visibleCards = Math.floor(container.offsetWidth / cardWidth)
  const maxScroll = Math.max(0, (grid.children.length - visibleCards) * cardWidth)

  if (direction === "left") {
    scrollPositions[section] = Math.max(0, scrollPositions[section] - cardWidth * 2)
  } else {
    scrollPositions[section] = Math.min(maxScroll, scrollPositions[section] + cardWidth * 2)
  }

  grid.style.transform = `translateX(-${scrollPositions[section]}px)`

  // Update button states
  updateScrollButtons(section, maxScroll)
}

function updateScrollButtons(section, maxScroll) {
  const leftBtn = document.querySelector(`.scroll-left[data-section="${section}"]`)
  const rightBtn = document.querySelector(`.scroll-right[data-section="${section}"]`)

  if (leftBtn) {
    leftBtn.disabled = scrollPositions[section] <= 0
  }

  if (rightBtn) {
    rightBtn.disabled = scrollPositions[section] >= maxScroll
  }
}

// Initialize product elements mapping
function initializeProductData() {
  const productCards = document.querySelectorAll(".product-card")
  productCards.forEach((card, index) => {
    if (productData[index]) {
      productData[index].element = card
    }
  })
}

// Sort products function
function sortProducts(sortBy) {
  const productGrids = document.querySelectorAll(".product-grid")

  productGrids.forEach((grid) => {
    const cards = Array.from(grid.querySelectorAll(".product-card"))

    // Create a mapping of cards to product data
    const cardData = cards.map((card) => {
      const productName = card.querySelector("h3").textContent
      const priceText = card.querySelector(".price").textContent
      const price = Number.parseInt(priceText.replace(/[₹,]/g, ""))
      const ratingElement = card.querySelector(".rating span")
      const rating = ratingElement ? Number.parseFloat(ratingElement.textContent.replace(/[()]/g, "")) : 0

      return {
        element: card,
        name: productName,
        price: price,
        rating: rating,
      }
    })

    // Sort the card data
    let sortedData
    switch (sortBy) {
      case "price-low":
        sortedData = cardData.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        sortedData = cardData.sort((a, b) => b.price - a.price)
        break
      case "newest":
        // For demo purposes, reverse the current order
        sortedData = cardData.reverse()
        break
      case "rating":
        sortedData = cardData.sort((a, b) => b.rating - a.rating)
        break
      default: // featured
        // Keep original order
        sortedData = cardData
    }

    // Clear the grid and re-append sorted cards
    grid.innerHTML = ""
    sortedData.forEach((item) => {
      grid.appendChild(item.element)
    })
  })
}

// Filter products by brand
function filterByBrand(brand) {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const productName = card.querySelector("h3").textContent.toLowerCase()

    if (brand === "all" || productName.includes(brand.toLowerCase())) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}

// Filter products by price range
function filterByPrice(priceRange) {
  const productCards = document.querySelectorAll(".product-card")

  productCards.forEach((card) => {
    const priceText = card.querySelector(".price").textContent
    const price = Number.parseInt(priceText.replace(/[₹,]/g, ""))
    let showCard = true

    switch (priceRange) {
      case "under-30000":
        showCard = price < 30000
        break
      case "30000-50000":
        showCard = price >= 30000 && price <= 50000
        break
      case "50000-80000":
        showCard = price >= 50000 && price <= 80000
        break
      case "above-80000":
        showCard = price > 80000
        break
      default: // all prices
        showCard = true
    }

    card.style.display = showCard ? "block" : "none"
  })
}

// Initialize event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Search on Enter key
  const searchInput = document.querySelector(".search-box input")
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
  }

  // Search icon click
  const searchIcon = document.querySelector(".search-box i")
  if (searchIcon) {
    searchIcon.addEventListener("click", handleSearch)
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Product card hover effects
  const productCards = document.querySelectorAll(".product-card")
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-4px)"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Initialize filter functionality for computers page
  if (window.location.pathname.includes("computers.html") || document.querySelector(".filter-section")) {
    initializeFilters()
    initializeScrolling()

    // Initialize scroll button states
    setTimeout(() => {
      Object.keys(scrollPositions).forEach((section) => {
        const container = document.getElementById(`${section}-scroll`)
        if (container) {
          const grid = container.querySelector(".product-grid-horizontal")
          const cardWidth = 324
          const visibleCards = Math.floor(container.offsetWidth / cardWidth)
          const maxScroll = Math.max(0, (grid.children.length - visibleCards) * cardWidth)
          updateScrollButtons(section, maxScroll)
        }
      })
    }, 100)
  }

  // Visit Store Button - Redirect to store page
  const visitStoreBtn = document.getElementById("visitStoreBtn")
  if (visitStoreBtn) {
    visitStoreBtn.addEventListener("click", () => {
      window.location.href = "store.html"
    })
  }
})

// Initialize filter functionality
function initializeFilters() {
  // Sort by dropdown
  const sortSelect = document.querySelector(".filter-select")
  if (
    sortSelect &&
    sortSelect.previousElementSibling &&
    sortSelect.previousElementSibling.textContent.includes("Sort By")
  ) {
    sortSelect.addEventListener("change", (e) => {
      const sortValue = e.target.value
      let sortBy = "featured"

      switch (sortValue) {
        case "Price: Low to High":
          sortBy = "price-low"
          break
        case "Price: High to Low":
          sortBy = "price-high"
          break
        case "Newest First":
          sortBy = "newest"
          break
        case "Highest Rated":
          sortBy = "rating"
          break
        default:
          sortBy = "featured"
      }

      sortProducts(sortBy)

      // Show feedback to user
      showFilterFeedback(`Sorted by: ${sortValue}`)
    })
  }

  // Brand filter dropdown
  const brandSelects = document.querySelectorAll(".filter-select")
  brandSelects.forEach((select) => {
    if (select.previousElementSibling && select.previousElementSibling.textContent.includes("Brand")) {
      select.addEventListener("change", (e) => {
        const brandValue = e.target.value
        let brand = "all"

        if (brandValue !== "All Brands") {
          brand = brandValue
        }

        filterByBrand(brand)
        showFilterFeedback(`Filtered by brand: ${brandValue}`)
      })
    }
  })

  // Price range filter dropdown
  brandSelects.forEach((select) => {
    if (select.previousElementSibling && select.previousElementSibling.textContent.includes("Price Range")) {
      select.addEventListener("change", (e) => {
        const priceValue = e.target.value
        let priceRange = "all"

        switch (priceValue) {
          case "Under ₹30,000":
            priceRange = "under-30000"
            break
          case "₹30,000 - ₹50,000":
            priceRange = "30000-50000"
            break
          case "₹50,000 - ₹80,000":
            priceRange = "50000-80000"
            break
          case "Above ₹80,000":
            priceRange = "above-80000"
            break
          default:
            priceRange = "all"
        }

        filterByPrice(priceRange)
        showFilterFeedback(`Filtered by price: ${priceValue}`)
      })
    }
  })
}

// Show filter feedback to user
function showFilterFeedback(message) {
  // Remove existing feedback
  const existingFeedback = document.querySelector(".filter-feedback")
  if (existingFeedback) {
    existingFeedback.remove()
  }

  // Create new feedback element
  const feedback = document.createElement("div")
  feedback.className = "filter-feedback"
  feedback.textContent = message
  feedback.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #2563eb;
    color: white;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    font-size: 14px;
    font-weight: 500;
  `

  document.body.appendChild(feedback)

  // Remove feedback after 3 seconds
  setTimeout(() => {
    if (feedback.parentNode) {
      feedback.remove()
    }
  }, 3000)
}

// Newsletter subscription (placeholder)
function subscribeNewsletter(email) {
  console.log("Newsletter subscription:", email)
  alert("Thank you for subscribing to our newsletter!")
}

// Contact form submission (placeholder)
function submitContactForm(formData) {
  console.log("Contact form submitted:", formData)
  alert("Thank you for your message. We will get back to you soon!")
}

// Handle window resize for scroll buttons
window.addEventListener("resize", () => {
  if (document.querySelector(".product-scroll-container")) {
    setTimeout(() => {
      Object.keys(scrollPositions).forEach((section) => {
        const container = document.getElementById(`${section}-scroll`)
        if (container) {
          const grid = container.querySelector(".product-grid-horizontal")
          const cardWidth = 324
          const visibleCards = Math.floor(container.offsetWidth / cardWidth)
          const maxScroll = Math.max(0, (grid.children.length - visibleCards) * cardWidth)

          // Reset scroll position if it's beyond the new max
          if (scrollPositions[section] > maxScroll) {
            scrollPositions[section] = maxScroll
            grid.style.transform = `translateX(-${scrollPositions[section]}px)`
          }

          updateScrollButtons(section, maxScroll)
        }
      })
    }, 100)
  }
})
