document.addEventListener("DOMContentLoaded", () => {
    // Theme toggle functionality
    const themeToggle = document.getElementById("theme-toggle")
    const themeText = document.getElementById("theme-text")
    const body = document.body
  
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      body.classList.add("dark-mode")
      themeText.textContent = "Light Mode"
    }
  
    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode")
      const isDarkMode = body.classList.contains("dark-mode")
      localStorage.setItem("theme", isDarkMode ? "dark" : "light")
      themeText.textContent = isDarkMode ? "Light Mode" : "Dark Mode"
    })
  
    // Dropdown functionality
    const dropdownToggle = document.querySelector(".dropdown-toggle")
    const dropdownMenu = document.querySelector(".dropdown-menu")
    const selectedRegion = document.getElementById("selected-region")
  
    dropdownToggle.addEventListener("click", () => {
      dropdownMenu.classList.toggle("show")
    })
  
    // Close dropdown when clicking outside
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".dropdown")) {
        dropdownMenu.classList.remove("show")
      }
    })
  
    // Countries data
    let allCountries = []
    let filteredCountries = []
    const countriesContainer = document.getElementById("countries-container")
    const noResults = document.getElementById("no-results")
    const loading = document.getElementById("loading")
    const searchInput = document.getElementById("search-input")
  
    // Fetch countries data
    async function fetchCountries() {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,population,region,capital,flags,cca3",
        )
        const data = await response.json()
        allCountries = data
        filteredCountries = data
        renderCountries(filteredCountries)
        loading.classList.add("hidden")
      } catch (error) {
        console.error("Error fetching countries:", error)
        loading.classList.add("hidden")
      }
    }
  
    // Render countries
    function renderCountries(countries) {
      countriesContainer.innerHTML = ""
  
      if (countries.length === 0) {
        noResults.classList.remove("hidden")
      } else {
        noResults.classList.add("hidden")
  
        countries.forEach((country) => {
          const countryCard = document.createElement("div")
          countryCard.className = "country-card"
          countryCard.setAttribute("data-country-code", country.cca3)
  
          countryCard.innerHTML = `
            <div class="flag-container">
              <img src="${country.flags.png}" alt="${country.flags.alt || `Flag of ${country.name.common}`}">
            </div>
            <div class="country-info">
              <h2 class="country-name">${country.name.common}</h2>
              <p class="country-data"><span>Population:</span> ${formatPopulation(country.population)}</p>
              <p class="country-data"><span>Region:</span> ${country.region}</p>
              <p class="country-data"><span>Capital:</span> ${country.capital?.[0] || "N/A"}</p>
            </div>
          `
  
          countryCard.addEventListener("click", () => {
            window.location.href = `country.html?code=${country.cca3}`
          })
  
          countriesContainer.appendChild(countryCard)
        })
      }
    }
  
    // Format population number
    function formatPopulation(population) {
      return population.toLocaleString()
    }
  
    // Filter countries by search term and region
    function filterCountries() {
      const searchTerm = searchInput.value.toLowerCase()
      const region = selectedRegion.textContent
  
      filteredCountries = allCountries.filter((country) => {
        const matchesSearch = country.name.common.toLowerCase().includes(searchTerm)
        const matchesRegion = region === "Filter by Region" || region === "All" || country.region === region
        return matchesSearch && matchesRegion
      })
  
      renderCountries(filteredCountries)
    }
  
    // Event listeners for search and filter
    searchInput.addEventListener("input", filterCountries)
  
    document.querySelectorAll(".dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        const value = item.getAttribute("data-value")
        selectedRegion.textContent = value === "all" ? "All" : value
        dropdownMenu.classList.remove("show")
        filterCountries()
      })
    })
  
    // Initialize
    fetchCountries()
  })
  