
let allPlant = []
let currentActiveBtn = null

// Load categories
const loadCategori = () => {
    fetch('https://openapi.programming-hero.com/api/categories')
        .then(res => res.json())
        .then(data => {
            displayCategori(data.categories)
        })
}

const manageSpinner = (status) =>{
    if (status === true) {
        document.getElementById('spinner').classList.remove('hidden')
        document.getElementById('categori-container').classList.add('hidden')
    }
    else{
        document.getElementById('categori-container').classList.remove('hidden')
        document.getElementById('spinner').classList.add('hidden')
    }
}
// Load all plants
const loadPlant = () => {
    manageSpinner(true)
    fetch('https://openapi.programming-hero.com/api/plants')
        .then(res => res.json())
        .then(json => {
            allPlant = json.plants
            displayPlant(allPlant)
            manageSpinner(false)
        })

}

// Display plants
const displayPlant = (plants) => {
    const plantCard = document.getElementById('plant-card')
    plantCard.innerHTML = ''

    for (const plant of plants) {
        const card = document.createElement('div')
        card.innerHTML = `
            <div class="bg-white p-4 space-y-3 rounded-md">
                <img src="${plant.image}" alt="${plant.name}" class="w-full h-40 object-cover rounded-md" />
                <h4 class="category-name font-semibold text-[14px] text-[#1F2937]">
                    ${plant.name}
                </h4>
                <p class="font-regular text-[12px] text-[#1F2937] line-clamp-2">
                    ${plant.description}
                </p>
                <div class="flex justify-between">
                    <p class="category-name bg-[#DCFCE7] py-1 px-3 rounded-3xl font-medium text-[14px] text-[#15803D] cursor-pointer">
                        ${plant.category}
                    </p>
                    <p class="font-semibold text-[14px] text-[#1F2937]">
                        ৳${plant.price}
                    </p>
                </div>
                <button class="add-to-cart-btn bg-[#15803D] w-[100%] py-2 rounded-3xl font-medium text-[16px] text-white">
                    Add To Cart
                </button>
            </div>
        `
        
        plantCard.append(card)

        // Add to Cart click event
        const addBtn = card.querySelector('.add-to-cart-btn')
        addBtn.addEventListener('click', () => {
            alert(`${plant.category} has been added to cart`)
            addToCart(plant)
        })

        // Category name click -> open modal
        const categoryEl = card.querySelector('.category-name')
        categoryEl.addEventListener('click', () => {
            document.getElementById('modal-name').innerText = plant.name
            document.getElementById('modal-image').src = plant.image
            document.getElementById('modal-title').innerText = `Categori: ${plant.category}`
            document.getElementById('modal-price').innerText = `Price: ৳${plant.price}`
            document.getElementById('modal-desc').innerText = plant.description
            my_modal_5.showModal()
        })
    }
}

// Cart
const cartContainer = document.getElementById('card-container')

// Total price element
let totalPrice = 0
const totalEl = document.createElement('div')
totalEl.classList.add('font-semibold', 'text-[16px]', 'mt-2')
totalEl.innerText = `Total: ৳${totalPrice}`
cartContainer.parentElement.appendChild(totalEl)

// Add plant to cart
const addToCart = (plant) => {
    const cartItem = document.createElement('div')
    cartItem.innerHTML = `
        <div class="flex justify-between items-center mb-2 bg-gray-100 p-2 rounded-md">
            <div>
                <p class="font-bold">${plant.name}</p>
                <p>৳${plant.price}</p>
            </div>
            <button class="text-red-500 font-bold remove-btn">&times;</button>
        </div>
    `

    // Update total
    totalPrice += plant.price
    updateTotal()

    // Remove button click
    cartItem.querySelector('.remove-btn').addEventListener('click', () => {
        totalPrice -= plant.price
        updateTotal()
        cartItem.remove()
    })

    cartContainer.append(cartItem)
}

// Update total price display
const updateTotal = () => {
    totalEl.innerText = `Total: ৳${totalPrice}`
}

// Display categories with active toggle
const displayCategori = (categories) => {
    const categorieContainer = document.getElementById('categori-container')
    categorieContainer.innerHTML = ''

    categories.forEach(categorie => {
        const categoriBtn = document.createElement('div')
        categoriBtn.innerHTML = `
            <button id="CategoriBtn-${categorie.id}" class="hover:bg-[#15803D] w-[100%] py-2 rounded-md font-medium text-[16px] hover:text-white text-black flex p-4">
                ${categorie.category_name}
            </button>
        `
        const btn = categoriBtn.querySelector('button')

        btn.addEventListener('click', () => {
            // Filter plants
            filterByCategory(categorie.category_name)

            // Active toggle
            if (currentActiveBtn) {
                currentActiveBtn.classList.remove('bg-[#15803D]', 'text-white')
                currentActiveBtn.classList.add('text-black')
            }
            btn.classList.add('bg-[#15803D]', 'text-white')
            currentActiveBtn = btn
        })

        categorieContainer.append(categoriBtn)
    })
}

// Filter plants by category
const filterByCategory = (categoryName) => {
    const filtered = allPlant.filter(plant => plant.category === categoryName)
    displayPlant(filtered)
}

loadCategori()
loadPlant()