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
  
    // Back button functionality
    const backButton = document.getElementById("back-button")
    backButton.addEventListener("click", () => {
      window.location.href = "index.html"
    })
  
    // Get country code from URL
    const urlParams = new URLSearchParams(window.location.search)
    const countryCode = urlParams.get("code")
  
    if (!countryCode) {
      window.location.href = "index.html"
      return
    }
  
    const countryDetail = document.getElementById("country-detail")
    const loading = document.getElementById("loading")
  
    // Fetch country data
    async function fetchCountryData() {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`)
        const data = await response.json()
        const country = data[0]
  
        renderCountryDetail(country)
  
        if (country.borders && country.borders.length > 0) {
          await fetchBorderCountries(country.borders)
        } else {
          loading.classList.add("hidden")
        }
      } catch (error) {
        console.error("Error fetching country data:", error)
        loading.classList.add("hidden")
      }
    }
  
    // Fetch border countries
    async function fetchBorderCountries(borders) {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borders.join(",")}&fields=name,cca3`)
        const borderData = await response.json()
  
        renderBorderCountries(borderData)
        loading.classList.add("hidden")
      } catch (error) {
        console.error("Error fetching border countries:", error)
        loading.classList.add("hidden")
      }
    }
  
    // Render country detail
    function renderCountryDetail(country) {
      const nativeName = getNativeName(country)
      const currencies = getCurrencies(country)
      const languages = getLanguages(country)
  
      countryDetail.innerHTML = `
        <div class="flag-section">
          <img src="${country.flags.png}" alt="${country.flags.alt || `Flag of ${country.name.common}`}" class="flag-large">
        </div>
        <div class="detail-content">
          <h2>${country.name.common}</h2>
          <div class="detail-grid">
            <div class="detail-column">
              <p class="detail-item"><span>Native Name:</span> ${nativeName}</p>
              <p class="detail-item"><span>Population:</span> ${formatPopulation(country.population)}</p>
              <p class="detail-item"><span>Region:</span> ${country.region}</p>
              <p class="detail-item"><span>Sub Region:</span> ${country.subregion || "N/A"}</p>
              <p class="detail-item"><span>Capital:</span> ${country.capital?.[0] || "N/A"}</p>
            </div>
            <div class="detail-column">
              <p class="detail-item"><span>Top Level Domain:</span> ${country.tld?.[0] || "N/A"}</p>
              <p class="detail-item"><span>Currencies:</span> ${currencies}</p>
              <p class="detail-item"><span>Languages:</span> ${languages}</p>
            </div>
          </div>
          <div class="border-countries">
            <p class="border-title">Border Countries:</p>
            <div class="border-buttons" id="border-buttons">
              <div class="loading-data"></div>
            </div>
          </div>
        </div>
      `
    }
  
    // Render border countries
    function renderBorderCountries(borderCountries) {
      const borderButtons = document.getElementById("border-buttons")
  
      if (!borderCountries || borderCountries.length === 0) {
        borderButtons.innerHTML = "<p>No border countries</p>"
        return
      }
  
      borderButtons.innerHTML = ""
  
      borderCountries.forEach((country) => {
        const button = document.createElement("button")
        button.className = "border-button"
        button.textContent = country.name.common
        button.addEventListener("click", () => {
          window.location.href = `country.html?code=${country.cca3}`
        })
  
        borderButtons.appendChild(button)
      })
    }
  
    // Helper functions
    function getNativeName(country) {
      if (!country.name.nativeName) return country.name.common
      const nativeNames = Object.values(country.name.nativeName)
      return nativeNames[0]?.common || country.name.common
    }
  
    function getCurrencies(country) {
      if (!country.currencies) return "N/A"
      return Object.values(country.currencies)
        .map((currency) => currency.name)
        .join(", ")
    }
  
    function getLanguages(country) {
      if (!country.languages) return "N/A"
      return Object.values(country.languages).join(", ")
    }
  
    function formatPopulation(population) {
      return population.toLocaleString()
    }
  
    // Initialize
    fetchCountryData()
  })
  