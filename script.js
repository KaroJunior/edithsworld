//Menu
function toggleMenu() {
    const navMenu = document.getElementById('navbar');
    const menuIcon = document.querySelector('.menu-icon');
  
    if (navMenu.classList.contains('open')) {
        // Close the menu
        navMenu.classList.remove('open');
        menuIcon.innerHTML = '&#9776;'; // Change back to hamburger icon
    } else {
        // Open the menu
        navMenu.classList.add('open');
        menuIcon.innerHTML = '✕'; // Change to close icon
    }
  }



// Cart functionality

let cart = JSON.parse(localStorage.getItem('edithscart')) || [];

function addToCart(productName, productPrice) {
  const product = { name: productName, price: productPrice, quantity: 1 };
  const existingProduct = cart.find(item => item.name === productName);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push(product);
  }
  updateCart();
}

function increaseQuantity(productName) {
  const product = cart.find(item => item.name === productName);
  if (product) {
    product.quantity += 1;
  }
  updateCart();
}

function decreaseQuantity(productName) {
  const product = cart.find(item => item.name === productName);
  if (product) {
    product.quantity -= 1;
    if (product.quantity === 0) {
      cart = cart.filter(item => item.name !== productName);
    }
  }
  updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartCountLg = document.getElementById('cart-count-lg');
    const cartCountMobile = document.getElementById('cart-count-mobile');
    cartItems.innerHTML = '';
    let total = 0;
    let itemCount = 0;
    cart.forEach(item => {
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="item-info">
                    <p>${item.name} - ₦${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity('${item.name}')">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="increaseQuantity('${item.name}')">+</button>
                </div>
            </div>
        `;
        total += item.price * item.quantity;
        itemCount += item.quantity;
    });
    cartTotal.innerHTML = `<p>Total: ₦${total.toFixed(2)}</p>`;
    cartCountLg.innerText = itemCount;
    cartCountMobile.innerText = itemCount;

    // Show or hide the cart count based on the number of items
    if (itemCount > 0) {
        cartCountLg.classList.remove('hidden');
        cartCountMobile.classList.remove('hidden');
    } else {
        cartCountLg.classList.add('hidden');
        cartCountMobile.classList.add('hidden');
    }

    // Save cart to localStorage
    localStorage.setItem('edithscart', JSON.stringify(cart));
}

function toggleCart() {
  const cartModal = document.getElementById('cartModal');
  if (cartModal.classList.contains('open')) {
    closeCart();
  } else {
    openCart();
  }
}

function openCart() {
  const cartModal = document.getElementById('cartModal');
  cartModal.style.display = "block";
  setTimeout(() => {
    cartModal.classList.add('open');
  }, 10); // Slight delay to trigger the transition
}

function closeCart() {
  const cartModal = document.getElementById('cartModal');
  cartModal.classList.remove('open');
  setTimeout(() => {
    cartModal.style.display = "none";
  }, 300); // Duration of the transition
}

function checkout() {
  alert('Proceeding to checkout!');
  cart = [];
  updateCart();
  closeCart();
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', (event) => {
  updateCart();
});

function checkout() {
  window.location.href = 'checkout.html'; // Adjust the path if necessary
}

document.addEventListener('DOMContentLoaded', (event) => {
  // Get cart data from localStorage
  const cart = JSON.parse(localStorage.getItem('edithscart')) || [];
  
  let itemCount = 0;
  let totalAmount = 0;

  // Calculate item count and total amount
  cart.forEach(item => {
      itemCount += item.quantity;
      totalAmount += item.price * item.quantity;
  });

  // Update order summary
  document.getElementById('itemCount').innerText = `Total Items: ${itemCount}`;
  document.getElementById('totalAmount').innerText = `Amount: ₦${totalAmount.toFixed(2)}`;
  
  // Handle form submission
  document.getElementById('checkoutForm').addEventListener('submit', function(event) {
      // Add cart items as hidden inputs
      cart.forEach((item, index) => {
          const inputName = document.createElement('input');
          inputName.type = 'hidden';
          inputName.name = `item${index + 1}Name`;
          inputName.value = item.name;
          this.appendChild(inputName);

          const inputQuantity = document.createElement('input');
          inputQuantity.type = 'hidden';
          inputQuantity.name = `item${index + 1}Quantity`;
          inputQuantity.value = item.quantity;
          this.appendChild(inputQuantity);
      });

      // Add order summary as hidden inputs
      const orderSummary = {
          itemCount: itemCount,
          totalAmount: totalAmount.toFixed(2),
      };

      Object.entries(orderSummary).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = value;
          this.appendChild(input);
      });

      // Form data is automatically collected and sent to the specified URL
  });
});


//Genrate OrderID
document.addEventListener('DOMContentLoaded', (event) => {
  // Generate a unique Order ID
  const generateOrderId = () => {
      const date = new Date();
      const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD
      const sequenceNumber = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); // Random 4-digit number
      return `ORD-${formattedDate}-${sequenceNumber}`;
  };

  // Set Order ID in the form
  const orderId = generateOrderId();
  document.getElementById('orderIdValue').innerText = orderId;

  // Add Order ID to the form data when submitting
  document.getElementById('checkoutForm').addEventListener('submit', function(event) {
      // Add the Order ID as a hidden input
      const orderIdInput = document.createElement('input');
      orderIdInput.type = 'hidden';
      orderIdInput.name = 'orderId';
      orderIdInput.value = orderId;
      this.appendChild(orderIdInput);

      // Existing code to append cart items and order summary...
  });
});
