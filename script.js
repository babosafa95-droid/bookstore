// BOOK DATABASE
const books = [
    {
        id: 1,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Development",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500"
    },
    {
        id: 2,
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Business",
        price: 10.99,
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500"
    },
    {
        id: 3,
        title: "The Psychology of Money",
        author: "Morgan Housel",
        category: "Business",
        price: 14.99,
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500"
    },
    {
        id: 4,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        category: "Fiction",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=500"
    },
    {
        id: 5,
        title: "Clean Code",
        author: "Robert C. Martin",
        category: "Technology",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500"
    },
    {
        id: 6,
        title: "Think and Grow Rich",
        author: "Napoleon Hill",
        category: "Business",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500"
    },
    {
        id: 7,
        title: "A Brief History of Time",
        author: "Stephen Hawking",
        category: "History",
        price: 13.99,
        image: "https://images.unsplash.com/photo-1511108690759-009324a90311?w=500"
    },
    {
        id: 8,
        title: "The 7 Habits",
        author: "Stephen Covey",
        category: "Self-Development",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500"
    }
];

// CART DATA
let cart = [];

try {
    cart = JSON.parse(localStorage.getItem("bookverseCart")) || [];
} catch {
    cart = [];
}

// DISPLAY BOOKS
function displayBooks(bookList) {
    const grid = document.getElementById("book-grid");

    if (bookList.length === 0) {
        grid.innerHTML = `
            <p class="no-results">No books found. Try another search.</p>
        `;
        return;
    }

    grid.innerHTML = bookList.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}"
                 onerror="this.src='https://placehold.co/400x500?text=Book'">

            <div class="book-info">
                <span class="book-category">${book.category}</span>

                <h3>${book.title}</h3>

                <p class="book-author">By ${book.author}</p>

                <div class="book-bottom">
                    <span class="price">$${book.price.toFixed(2)}</span>

                    <button class="add-btn"
                        onclick="addToCart(${book.id})">
                        + Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

// FILTER BOOKS
function filterBooks(category, button) {
    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    const filteredBooks = category === "All"
        ? books
        : books.filter(book => book.category === category);

    displayBooks(filteredBooks);
}

// SEARCH BOOKS
function searchBooks() {
    const searchValue = document
        .getElementById("search-input")
        .value.toLowerCase()
        .trim();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue) ||
        book.category.toLowerCase().includes(searchValue)
    );

    document.querySelectorAll(".category-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    displayBooks(filteredBooks);
}

// LIVE SEARCH
document.getElementById("search-input")
    .addEventListener("input", searchBooks);

// SAVE CART
function saveCart() {
    localStorage.setItem("bookverseCart", JSON.stringify(cart));
}

// ADD TO CART
function addToCart(bookId) {
    const book = books.find(item => item.id === bookId);

    if (!book) return;

    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...book,
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    alert(book.title + " added to your cart!");
}

// UPDATE CART
function updateCart() {
    const cartItems = document.getElementById("cart-items");
    const cartCount = document.getElementById("cart-count");
    const cartTotal = document.getElementById("cart-total");

    const totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    cartCount.textContent = totalQuantity;
    cartTotal.textContent = totalPrice.toFixed(2);

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">Your cart is empty.</p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">

            <img src="${item.image}" alt="${item.title}"
                 onerror="this.src='https://placehold.co/100x120?text=Book'">

            <div class="cart-item-info">

                <h4>${item.title}</h4>

                <p>$${(item.price * item.quantity).toFixed(2)}</p>

                <div class="cart-controls">

                    <button onclick="changeQuantity(${item.id}, -1)">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQuantity(${item.id}, 1)">+</button>

                    <button class="remove-btn"
                        onclick="removeFromCart(${item.id})">
                        ✕
                    </button>

                </div>
            </div>
        </div>
    `).join("");
}

// CHANGE QUANTITY
function changeQuantity(bookId, amount) {
    const item = cart.find(book => book.id === bookId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(book => book.id !== bookId);
    }

    saveCart();
    updateCart();
}

// REMOVE FROM CART
function removeFromCart(bookId) {
    cart = cart.filter(book => book.id !== bookId);

    saveCart();
    updateCart();
}

// OPEN AND CLOSE CART
function toggleCart() {
    document.getElementById("cart-panel")
        .classList.toggle("open");

    document.getElementById("overlay")
        .classList.toggle("show");
}

// OPEN CHECKOUT
function openCheckout() {
    if (cart.length === 0) {
        alert("Your shopping cart is empty!");
        return;
    }

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("checkout-total").textContent =
        total.toFixed(2);

    document.getElementById("checkout-modal")
        .classList.add("show");
}

// CLOSE CHECKOUT
function closeCheckout() {
    document.getElementById("checkout-modal")
        .classList.remove("show");
}

// PLACE ORDER (DEMO ONLY)
function placeOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty!");
        closeCheckout();
        return;
    }

    const name = document.getElementById("customer-name").value;
    const email = document.getElementById("customer-email").value;

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    alert(
        "Thank you, " + name + "!\n\n" +
        "Your demo order has been received.\n" +
        "Email: " + email + "\n" +
        "Total: $" + total.toFixed(2) +
        "\n\nNo payment was processed."
    );

    cart = [];

    saveCart();
    updateCart();
    closeCheckout();

    document.getElementById("checkout-form").reset();
    toggleCart();
}

// NEWSLETTER
function subscribe(event) {
    event.preventDefault();

    const email = document.getElementById("email-input").value;

    alert("Thank you for subscribing: " + email);

    event.target.reset();
}

// INITIALIZE WEBSITE
displayBooks(books);
updateCart();