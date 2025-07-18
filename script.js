// Menu items with image URLs
const menuItems = [
    {
        name: "Cappuccino",
        price:149,
        image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Classic espresso with steamed milk and foam"
    },
    {
        name: "Burger",
        price: 249,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2IkrAWF74Kkx8RwvkOFg7sCyph7rQUXdFxbMnEfuFN8VkUeYUaCRf7eMARY_eBk3hq40&usqp=CAU",
        description: "Testay Burger "
    },
    {
        name: "Pizza",
        price: 399,
        image: "https://static.wixstatic.com/media/597497_39dfa709d3d845eeaf43eb692e93b31b~mv2.jpg/v1/fill/w_6240,h_4160,al_c,q_90/Pepperoni%20Pizza_1_compressed.jpg",
        description: "Pizza which include Panier and bens"
    },
    {
        name: "Cold drink",
        price: 199,
        image: "https://agronfoodprocessing.com/wp-content/uploads/2023/08/drinks.jpg",
        description: "European Special Beverage"
    },
    {
        name: "Ice-cream",
        price: 99,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJzsBJnUQrbK_Uj2ySpavaiPNWK7_AOAteQ&s",
        description: "Stobery Flavour ice-cream"
    },
    {
        name: "Sandwich",
        price: 149,
        image: "https://images.unsplash.com/photo-1559847844-5315695dadae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Fresh bread with your choice of fillings"
    },
    {
        name: "Salad",
        price: 249,
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Fresh garden salad with dressing"
    },
    {
        name: "Cake",
        price: 499,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        description: "Delicious homemade cake slice"
    }
];

// Mock database for orders
let orders = JSON.parse(localStorage.getItem('cafeOrders')) || [];
let selectedItems = [];

// DOM Elements
const orderForm = document.getElementById('orderForm');
const customerName = document.getElementById('customerName');
const itemCardsContainer = document.getElementById('itemCards');
const selectedItemsContainer = document.getElementById('selectedItemsContainer');
const selectedItemsList = document.getElementById('selectedItemsList');
const orderTotal = document.getElementById('orderTotal');
const quantity = document.getElementById('quantity');
const specialInstructions = document.getElementById('specialInstructions');
const submitBtn = document.getElementById('submitBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const orderId = document.getElementById('orderId');
const ordersContainer = document.getElementById('ordersContainer');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');

// Initialize the menu items
function initializeMenuItems() {
    itemCardsContainer.innerHTML = '';
    
    menuItems.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        itemCard.dataset.itemName = item.name;
        itemCard.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <div class="price">₹${item.price}</div>
        `;
        
        itemCard.addEventListener('click', function() {
            addItemToOrder(item);
        });
        
        itemCardsContainer.appendChild(itemCard);
    });
}

// Add item to order
function addItemToOrder(item) {
    const existingItem = selectedItems.find(i => i.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        selectedItems.push({
            id: Date.now().toString(),
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
            specialInstructions: ''
        });
    }
    
    updateSelectedItemsList();
}

// Update selected items list
function updateSelectedItemsList() {
    selectedItemsContainer.innerHTML = '';
    
    if (selectedItems.length === 0) {
        selectedItemsList.classList.remove('active');
        return;
    }
    
    selectedItemsList.classList.add('active');
    
    selectedItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'selected-item';
        itemElement.innerHTML = `
            <div class="selected-item-info">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h4>${item.name}</h4>
                    <div class="selected-item-quantity">
                        <button class="decrease-qty" data-id="${item.id}">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                </div>
            </div>
            <div class="selected-item-price">
                ₹${(item.price * item.quantity).toFixed(2)}
            </div>
            <div class="remove-item" data-id="${item.id}">
                <i class="fas fa-times"></i>
            </div>
        `;
        
        selectedItemsContainer.appendChild(itemElement);
    });
    
    // Add event listeners
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            updateItemQuantity(this.getAttribute('data-id'), -1);
        });
    });
    
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            updateItemQuantity(this.getAttribute('data-id'), 1);
        });
    });
    
    document.querySelectorAll('.selected-item-quantity input').forEach(input => {
        input.addEventListener('change', function() {
            const newQuantity = parseInt(this.value);
            if (newQuantity > 0) {
                const item = selectedItems.find(i => i.id === this.getAttribute('data-id'));
                if (item) {
                    item.quantity = newQuantity;
                    updateSelectedItemsList();
                }
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            removeItemFromOrder(this.getAttribute('data-id'));
        });
    });
    
    // Update total
    updateOrderTotal();
}

// Update item quantity
function updateItemQuantity(itemId, change) {
    const item = selectedItems.find(i => i.id === itemId);
    if (item) {
        const newQuantity = item.quantity + change;
        if (newQuantity > 0) {
            item.quantity = newQuantity;
            updateSelectedItemsList();
        }
    }
}

// Remove item from order
function removeItemFromOrder(itemId) {
    selectedItems = selectedItems.filter(item => item.id !== itemId);
    updateSelectedItemsList();
}

// Calculate order total
function updateOrderTotal() {
    const total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    orderTotal.textContent = `₹${total.toFixed(2)}`;
}

// Form submit handler
orderForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (selectedItems.length === 0) {
        alert('Please select at least one item');
        return;
    }
    
    if (!customerName.value) {
        alert('Please enter your name');
        return;
    }
    
    if (orderId.value === '') {
        // Create new order
        const newOrder = {
            id: Date.now().toString(),
            customerName: customerName.value,
            items: [...selectedItems],
            status: 'pending',
            date: new Date().toISOString(),
            total: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            specialInstructions: specialInstructions.value
        };
        
        orders.push(newOrder);
        saveOrders();
        displayOrders();
        resetForm();
    } else {
        // Update existing order
        const index = orders.findIndex(order => order.id === orderId.value);
        if (index !== -1) {
            orders[index] = {
                ...orders[index],
                customerName: customerName.value,
                items: [...selectedItems],
                total: selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                specialInstructions: specialInstructions.value
            };
            
            saveOrders();
            displayOrders();
            resetForm();
        }
    }
});

// Update button click handler
updateBtn.addEventListener('click', function() {
    orderForm.dispatchEvent(new Event('submit'));
});

// Cancel button click handler
cancelBtn.addEventListener('click', resetForm);

// Search and filter handlers
searchInput.addEventListener('input', displayOrders);
filterStatus.addEventListener('change', displayOrders);

// Display all orders
function displayOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusFilter = filterStatus.value;
    
    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchTerm) || 
                             order.items.some(item => item.name.toLowerCase().includes(searchTerm));
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    
    if (filteredOrders.length === 0) {
        ordersContainer.innerHTML = '<p class="no-orders">No orders found. Place your first order above!</p>';
        return;
    }
    
    ordersContainer.innerHTML = '';
    
    filteredOrders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-card';
        
        let itemsHtml = '';
        order.items.forEach(item => {
            itemsHtml += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}" width="40">
                    <div>
                        <p>${item.name} (x${item.quantity})</p>
                        <p>₹${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                </div>
            `;
        });
        
        orderElement.innerHTML = `
            <div class="order-header">
                <h3>Order #${order.id.slice(-6)} - ${order.customerName}</h3>
                <span class="order-status status-${order.status}">${order.status}</span>
            </div>
            <div class="order-details">
                <div class="order-items">
                    ${itemsHtml}
                </div>
                ${order.specialInstructions ? `<p><strong>Instructions:</strong> ${order.specialInstructions}</p>` : ''}
                <div class="order-summary">
                    <p><strong>Total:</strong> ₹${order.total.toFixed(2)}</p>
                    <p><small>Ordered on: ${new Date(order.date).toLocaleString()}</small></p>
                </div>
            </div>
            <div class="order-actions">
                <button class="edit-btn" data-id="${order.id}"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete-btn" data-id="${order.id}"><i class="fas fa-trash"></i> Delete</button>
                ${order.status !== 'completed' ? `<button class="status-btn" data-id="${order.id}"><i class="fas fa-check"></i> Mark as ${getNextStatus(order.status)}</button>` : ''}
            </div>
        `;
        
        ordersContainer.appendChild(orderElement);
    });
    
    // Add event listeners to edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            editOrder(this.getAttribute('data-id'));
        });
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this order?')) {
                deleteOrder(this.getAttribute('data-id'));
            }
        });
    });
    
    // Add event listeners to status buttons
    document.querySelectorAll('.status-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            updateOrderStatus(this.getAttribute('data-id'));
        });
    });
}

// Get next status for status button
function getNextStatus(currentStatus) {
    const statusFlow = ['pending', 'preparing', 'ready', 'completed'];
    const currentIndex = statusFlow.indexOf(currentStatus);
    return currentIndex < statusFlow.length - 1 ? statusFlow[currentIndex + 1] : 'completed';
}

// Edit order
function editOrder(id) {
    const order = orders.find(order => order.id === id);
    if (order) {
        customerName.value = order.customerName;
        specialInstructions.value = order.specialInstructions;
        orderId.value = order.id;
        
        // Set selected items
        selectedItems = [...order.items];
        updateSelectedItemsList();
        
        submitBtn.style.display = 'none';
        updateBtn.style.display = 'inline-block';
        cancelBtn.style.display = 'inline-block';
    }
}

// Delete order
function deleteOrder(id) {
    orders = orders.filter(order => order.id !== id);
    saveOrders();
    displayOrders();
}

// Update order status
function updateOrderStatus(id) {
    const order = orders.find(order => order.id === id);
    if (order) {
        const nextStatus = getNextStatus(order.status);
        order.status = nextStatus;
        saveOrders();
        displayOrders();
    }
}

// Reset form
function resetForm() {
    orderForm.reset();
    orderId.value = '';
    selectedItems = [];
    selectedItemsList.classList.remove('active');
    selectedItemsContainer.innerHTML = '';
    orderTotal.textContent = '₹0';
    
    submitBtn.style.display = 'inline-block';
    updateBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
}

// Save orders to localStorage
function saveOrders() {
    localStorage.setItem('cafeOrders', JSON.stringify(orders));
}

// Initialize the app
initializeMenuItems();
displayOrders();