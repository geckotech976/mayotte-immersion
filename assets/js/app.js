document.addEventListener('DOMContentLoaded', () => {

    // Élément DOM
    const overlay = document.getElementById('overlay');
    
    // --- Gestion du Panier & Modale ---
    const cartBtn = document.getElementById('open-cart-btn');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartCount = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    const reserveBtns = document.querySelectorAll('.reserve-btn');
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const bookingForm = document.getElementById('booking-form');
    const bookingTitle = document.getElementById('modal-title');
    const bookingIdInput = document.getElementById('booking-id');
    const bookingPriceInput = document.getElementById('booking-price');

    let cart = [];

    // Fonctions d'ouverture/fermeture
    const openCart = () => {
        cartDrawer.classList.add('active');
        overlay.classList.add('active');
    };

    const closeCart = () => {
        cartDrawer.classList.remove('active');
        closeOverlay();
    };

    const openBookingModal = (id, title, price) => {
        bookingTitle.innerText = `Réserver : ${title}`;
        bookingIdInput.value = id;
        bookingPriceInput.value = price;
        // Fixons la date min à aujourd'hui
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('booking-date').setAttribute('min', today);
        bookingForm.reset();

        bookingModal.classList.add('active');
        overlay.classList.add('active');
    };

    const closeBookingModal = () => {
        bookingModal.classList.remove('active');
        closeOverlay();
    };

    const closeOverlay = () => {
        overlay.classList.remove('active');
        cartDrawer.classList.remove('active');
        bookingModal.classList.remove('active');
    };

    // Events Listeners - UI
    cartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    closeModalBtn.addEventListener('click', closeBookingModal);
    overlay.addEventListener('click', closeOverlay);

    reserveBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const title = e.target.getAttribute('data-title');
            const price = e.target.getAttribute('data-price');
            openBookingModal(id, title, price);
        });
    });

    // Gestion de l'ajout au panier
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('booking-date').value;
        const id = bookingIdInput.value;
        const title = bookingTitle.innerText.replace('Réserver : ', '');
        const price = parseFloat(bookingPriceInput.value);

        if(!date) return;

        // Créer un item unique (utilisation du timestamp pour avoir un ID unique au panier)
        const cartItem = {
            cartId: Date.now(),
            id: id,
            title: title,
            date: new Date(date).toLocaleDateString('fr-FR'),
            price: price
        };

        cart.push(cartItem);
        updateCartUI();
        
        closeBookingModal();
        setTimeout(openCart, 300); // Ouvre le panier juste après pour confirmation visuelle
    });

    // Mettre à jour l'affichage du panier
    const updateCartUI = () => {
        cartCount.innerText = cart.length;
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Votre panier est vide.</div>';
            cartTotalPrice.innerText = '0.00 €';
            checkoutBtn.disabled = true;
            return;
        }

        checkoutBtn.disabled = false;
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>Date : ${item.date}</p>
                </div>
                <div style="display:flex; align-items:center;">
                    <div class="cart-item-price">${item.price.toFixed(2)} €</div>
                    <button class="remove-item" data-cartid="${item.cartId}" title="Retirer du panier">
                        <i class="ph ph-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalPrice.innerText = `${total.toFixed(2)} €`;

        // Écouteurs pour suppression du panier
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cartId = parseInt(e.currentTarget.getAttribute('data-cartid'));
                removeFromCart(cartId);
            });
        });
    };

    const removeFromCart = (cartId) => {
        cart = cart.filter(item => item.cartId !== cartId);
        updateCartUI();
    };

    // Bouton de paiement (simulation)
    checkoutBtn.addEventListener('click', () => {
        if(cart.length > 0) {
            alert('Redirection vers la passerelle de paiement sécurisée...');
            cart = [];
            updateCartUI();
            closeCart();
        }
    });


    // --- Gestion des Avis ---
    const reviewForm = document.getElementById('review-form');
    const reviewsList = document.getElementById('reviews-list');

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('review-name').value;
        const rating = parseInt(document.getElementById('review-rating').value);
        const text = document.getElementById('review-text').value;

        // Générer les étoiles
        let starsHtml = '';
        for(let i=1; i<=5; i++) {
            if(i <= rating) {
                starsHtml += '<i class="ph-fill ph-star"></i>';
            } else {
                starsHtml += '<i class="ph ph-star"></i>';
            }
        }

        const newReview = document.createElement('div');
        newReview.className = 'review-card';
        newReview.style.animation = "fadeIn 0.5s ease"; // Optionnel
        newReview.innerHTML = `
            <div class="review-stars">${starsHtml}</div>
            <p class="review-text">"${text}"</p>
            <h4 class="review-author">${name}</h4>
        `;

        // Ajouter au début de la liste
        reviewsList.prepend(newReview);
        
        // Reset
        reviewForm.reset();
        alert('Merci pour votre avis ! Il a été publié avec succès.');
    });

});
