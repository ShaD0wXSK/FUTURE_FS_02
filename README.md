# FUTURE_FS_02: Mini E-Commerce Website 🚀

This project is a modern, fully responsive mini e-commerce website developed as **Task 2** for the **Future Interns Web Development Internship**. It showcases a range of features expected from an online store, built using fundamental web technologies: HTML, CSS, and vanilla JavaScript.

**Live Demo:** [click here](https://shad0wxsk.github.io/E-shop/)

---

## ✨ Key Features

### 🛍️ Core Shopping Experience
* **Dynamic Product Catalog:** Products are dynamically loaded from a JavaScript data source (`data.js`), making the catalog easy to manage and scale.
* **Comprehensive Filtering & Sorting:** On the products page, users can:
    * **Filter** by category (Electronics, Fashion, Home, etc.).
    * **Filter** by a dynamic price range slider.
    * **Sort** products by price (low to high, high to low) and by customer rating.
* **Advanced Search:** A functional search bar allows users to find products by name across the entire catalog.
* **Pagination:** The product list is paginated to ensure a smooth and organized browsing experience, even with a large number of items.

### 🛒 Cart & Wishlist Management
* **Persistent Shopping Cart:** Users can add, remove, and update the quantity of items in their cart. The cart state is saved to `localStorage`, so it persists across browser sessions.
* **Persistent Wishlist:** Users can add or remove products from their personal wishlist. Like the cart, the wishlist is also saved using `localStorage`.
* **Instant UI Updates:** The cart and wishlist item counts in the header are updated in real-time.

### 💳 User-Friendly Checkout
* **Simplified Checkout Process:** A clean and straightforward checkout page captures necessary shipping information.
* **Order Summary:** A detailed order summary is displayed during checkout, showing all items and the final total.

### 🎨 UI/UX & Design
* **Modern & Professional Design:** The website features a clean, modern aesthetic with a focus on user experience, using a professional color palette, Google Fonts, and smooth animations.
* **Fully Responsive:** The layout is built to be fully responsive, providing an optimal viewing experience on all devices, from mobile phones to desktops.
* **Intuitive Navigation:** A sticky header, clear navigation links, and a "scroll to top" button make the site easy to navigate.
* **Interactive Elements:** Engaging hover effects, button feedback, and seamless transitions enhance the user experience.

---

## 📂 Project Structure

The project is organized into clear and logical files, separating structure (HTML), styling (CSS), and logic (JavaScript).


FUTURE_FS_02/
├── 📂 images/              # Contains all product and banner images
│   ├── product1.jpg
│   ├── banner1.jpg
│   └── ...
├── 📄 index.html           # Homepage
├── 📄 products.html        # Product listing and filtering page
├── 📄 product-detail.html  # (Structure for single product view)
├── 📄 cart.html            # Shopping cart page
├── 📄 wishlist.html        # Wishlist page
├── 📄 checkout.html        # Checkout page
├── 📄 about.html           # About Us page
├── 📄 contact.html         # Contact Us page
├── 📄 style.css            # Main stylesheet for all pages
├── 📄 script.js            # Global JavaScript for all dynamic functionality
└── 📄 data.js              # Mock database containing product information


---

## 🚀 Getting Started

To run this project locally, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```

3.  **Open `index.html` in your browser.**
    * For the best experience and to avoid any potential browser restrictions, it's recommended to use a live server. If you are using Visual Studio Code, you can use the **Live Server** extension.

---

## 🛠️ Technical Implementation Details

### Data Handling (`data.js`)
* The project uses a local JavaScript file, `data.js`, to simulate a product database. It contains an array of product objects, each with properties like `id`, `name`, `price`, `category`, `rating`, and `image`.

### Core Logic (`script.js`)
* **DOM Manipulation:** The script dynamically generates HTML for product cards, cart items, and wishlist items, rendering them into the DOM. This makes the site's content data-driven.
* **Event-Driven:** All user interactions, such as button clicks, filter changes, and input events, are handled through DOM event listeners.
* **State Management with `localStorage`:** The shopping cart and wishlist states are stored as JSON strings in the browser's `localStorage`. This ensures that the user's selections are not lost when they refresh the page or close the browser.
* **URL-based Filtering:** The search and category filters utilize URL query parameters (`?search=...` or `?category=...`) to pass state between pages, allowing for shareable links to filtered views.

### Styling (`style.css`)
* **CSS Variables:** The stylesheet makes extensive use of CSS variables (`:root`) for a consistent and easily maintainable theme (colors, fonts, shadows).
* **Responsive Design:** Media queries are used to adapt the layout, font sizes, and element visibility for different screen sizes, ensuring a seamless experience on all devices.
* **Modern CSS Layouts:** The project leverages **Flexbox** and **CSS Grid** to create complex, responsive, and robust layouts.

---

## 👤 Author

* **Name:** [Suman Kirtania]
* **Internship:** Future Interns - Web Development

---

## 🙏 Acknowledgements

* **Fonts:** [Google Fonts](https://fonts.google.com/) (Montserrat & Poppins)
* **Icons:** [Font Awesome](https://fontawesome.com/)
