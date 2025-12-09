import { getCurrentUser, signOut } from './lib/auth.js';
import { supabase } from './lib/supabase.js';

let currentUser = null;
let editingProductId = null;

async function init() {
    try {
        currentUser = await getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        document.getElementById('userEmail').textContent = currentUser.email;
        loadProducts();
        setupEventListeners();
    } catch (error) {
        console.error('Init error:', error);
        window.location.href = 'login.html';
    }
}

function setupEventListeners() {
    document.getElementById('logoutButton').addEventListener('click', handleLogout);
    document.getElementById('addProductButton').addEventListener('click', () => openModal());
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('cancelButton').addEventListener('click', closeModal);
    document.getElementById('productForm').addEventListener('submit', handleFormSubmit);
    document.getElementById('addVariantButton').addEventListener('click', addVariant);

    document.getElementById('productModal').addEventListener('click', (e) => {
        if (e.target.id === 'productModal') {
            closeModal();
        }
    });
}

async function handleLogout() {
    try {
        await signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout error:', error);
    }
}

async function loadProducts() {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '<div class="loading">Loading products...</div>';

    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (data.length === 0) {
            grid.innerHTML = '<div class="loading">No products yet. Add your first product!</div>';
            return;
        }

        grid.innerHTML = data.map(product => createProductCard(product)).join('');
        attachProductEventListeners();
    } catch (error) {
        console.error('Load products error:', error);
        grid.innerHTML = '<div class="loading">Error loading products. Please refresh.</div>';
    }
}

function createProductCard(product) {
    const categoryMap = {
        'ready-to-cook': 'Ready to Cook',
        'ready-to-eat-podis': 'Ready to Eat Podis',
        'ready-to-use': 'Ready to Use'
    };

    return `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.showcase_image || 'https://via.placeholder.com/400x300?text=No+Image'}"
                 alt="${product.product_name}"
                 class="product-image"
                 onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
            <div class="product-info">
                <span class="product-category">${categoryMap[product.product_category] || product.product_category}</span>
                <h3 class="product-name">${product.product_name}</h3>
                ${product.product_tagline ? `<p class="product-tagline">${product.product_tagline}</p>` : ''}

                <div class="product-details">
                    <div class="product-detail">
                        <span class="product-detail-label">MRP</span>
                        <span class="product-detail-value">₹${product.mrp}</span>
                    </div>
                    ${product.net_weight ? `
                    <div class="product-detail">
                        <span class="product-detail-label">Weight</span>
                        <span class="product-detail-value">${product.net_weight}</span>
                    </div>
                    ` : ''}
                    <div class="product-detail">
                        <span class="product-detail-label">Stock</span>
                        <span class="product-detail-value">${product.total_stock}</span>
                    </div>
                </div>

                <span class="product-status ${product.is_active ? 'active' : 'inactive'}">
                    ${product.is_active ? '● Active' : '● Inactive'}
                </span>

                <div class="product-actions">
                    <button class="edit-button" data-id="${product.id}">Edit</button>
                    <button class="delete-button" data-id="${product.id}">Delete</button>
                </div>
            </div>
        </div>
    `;
}

function attachProductEventListeners() {
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            editProduct(id);
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            deleteProduct(id);
        });
    });
}

function openModal(product = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const modalTitle = document.getElementById('modalTitle');

    form.reset();
    document.getElementById('variantsContainer').innerHTML = '';
    editingProductId = product?.id || null;

    if (product) {
        modalTitle.textContent = 'Edit Product';
        document.getElementById('productName').value = product.product_name || '';
        document.getElementById('productCategory').value = product.product_category || '';
        document.getElementById('productTagline').value = product.product_tagline || '';
        document.getElementById('productDescription').value = product.product_description || '';
        document.getElementById('showcaseImage').value = product.showcase_image || '';
        document.getElementById('infoImage').value = product.info_image || '';
        document.getElementById('mrp').value = product.mrp || 0;
        document.getElementById('netWeight').value = product.net_weight || '';
        document.getElementById('totalStock').value = product.total_stock || 0;
        document.getElementById('isActive').checked = product.is_active ?? true;

        if (product.quantity_variants && Array.isArray(product.quantity_variants)) {
            product.quantity_variants.forEach(variant => {
                addVariant(variant);
            });
        }
    } else {
        modalTitle.textContent = 'Add Product';
        document.getElementById('isActive').checked = true;
    }

    modal.classList.add('show');
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.classList.remove('show');
    editingProductId = null;
    document.getElementById('formError').classList.remove('show');
}

function addVariant(variant = null) {
    const container = document.getElementById('variantsContainer');
    const variantId = Date.now();

    const variantHtml = `
        <div class="variant-item" data-variant-id="${variantId}">
            <input type="text" placeholder="Quantity (e.g., 500g)" value="${variant?.quantity || ''}" data-field="quantity">
            <input type="number" placeholder="Price" step="0.01" value="${variant?.price || ''}" data-field="price">
            <input type="number" placeholder="Stock" value="${variant?.stock || ''}" data-field="stock">
            <button type="button" class="remove-variant-button" data-variant-id="${variantId}">✕</button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', variantHtml);

    container.querySelector(`[data-variant-id="${variantId}"] .remove-variant-button`).addEventListener('click', (e) => {
        e.target.closest('.variant-item').remove();
    });
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const submitButton = document.getElementById('submitButton');
    const submitText = document.getElementById('submitText');
    const submitLoader = document.getElementById('submitLoader');
    const errorMessage = document.getElementById('formError');

    submitButton.disabled = true;
    submitText.style.display = 'none';
    submitLoader.style.display = 'inline-block';
    errorMessage.classList.remove('show');

    try {
        const variants = [];
        document.querySelectorAll('.variant-item').forEach(item => {
            const quantity = item.querySelector('[data-field="quantity"]').value;
            const price = item.querySelector('[data-field="price"]').value;
            const stock = item.querySelector('[data-field="stock"]').value;

            if (quantity || price || stock) {
                variants.push({
                    quantity: quantity || '',
                    price: parseFloat(price) || 0,
                    stock: parseInt(stock) || 0
                });
            }
        });

        const productData = {
            product_name: document.getElementById('productName').value,
            product_category: document.getElementById('productCategory').value,
            product_tagline: document.getElementById('productTagline').value,
            product_description: document.getElementById('productDescription').value,
            showcase_image: document.getElementById('showcaseImage').value,
            info_image: document.getElementById('infoImage').value,
            mrp: parseFloat(document.getElementById('mrp').value) || 0,
            net_weight: document.getElementById('netWeight').value,
            total_stock: parseInt(document.getElementById('totalStock').value) || 0,
            quantity_variants: variants,
            is_active: document.getElementById('isActive').checked,
            updated_at: new Date().toISOString()
        };

        let result;
        if (editingProductId) {
            result = await supabase
                .from('products')
                .update(productData)
                .eq('id', editingProductId);
        } else {
            result = await supabase
                .from('products')
                .insert([productData]);
        }

        if (result.error) throw result.error;

        closeModal();
        loadProducts();
    } catch (error) {
        console.error('Save product error:', error);
        errorMessage.textContent = 'Failed to save product. Please try again.';
        errorMessage.classList.add('show');
    } finally {
        submitButton.disabled = false;
        submitText.style.display = 'inline';
        submitLoader.style.display = 'none';
    }
}

async function editProduct(id) {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        if (!data) {
            alert('Product not found');
            return;
        }

        openModal(data);
    } catch (error) {
        console.error('Edit product error:', error);
        alert('Failed to load product');
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;

        loadProducts();
    } catch (error) {
        console.error('Delete product error:', error);
        alert('Failed to delete product');
    }
}

init();
