const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address-input")
const addressWarn = document.getElementById("address-error")
let cart = [];
//abrir o modal
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
    updateCartModal()
});


//fechar modal
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
});

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        
        addToCart(name, price)

    }

    
})

function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity +=1
        return;
    }
    else{
        cart.push({
        name,
        price,
        quantity: 1,
    })
    }

    
    updateCartModal()

}

function updateCartModal(){
    cartItemContainer.innerHTML = "";
    let total = 0;
    cartItemContainer.classList.add("flex", "justify-between", "mb-4", "flex-col")
    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.innerHTML = `
        <div class="flex item-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium" mt-2>R$ ${item.price.toFixed(2)}</p>
            </div>


      
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            
           
        </div>
        `

        total += item.price * item.quantity;

        cartItemContainer.appendChild(cartItemElement);
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
    
    cartCounter.innerHTML = cart.length;
}

cartItemContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]
        if (item.quantity > 1){
            item.quantity -= 1
            updateCartModal()
            return;
        }
        
        cart.splice(index, 1);
        updateCartModal();
        
    }

}

addressInput.addEventListener("input", function(event){
    
    let inpuValue = event.target.value;
    if(inpuValue != ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen()
    if(!isOpen){
        Toastify({
            text: "Ops, o restaurante está fechado no momento!!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },

          }).showToast();
        return;
    }

    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500");
        return;
    }
    
    const carItems = cart.map((item) => {return(
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price}) |` 
        )

    }).join("")
    
    const message = encodeURIComponent(carItems)
    const phone = "31983220948"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank")

    cart.length = 0
    updateCartModal()

})

function checkRestaurantOpen(){
    const data = new Date()

    const hora = data.getHours()

    return hora >= 18 && hora < 22;

}

const spantItem = document.getElementById("date-span")

const isOpen = checkRestaurantOpen()

if (isOpen){
    spantItem.classList.remove("bg-red-500")
    spantItem.classList.add("bg-green-600")
}
else{
    spantItem.classList.remove("bg-green-500")
    spantItem.classList.add("bg-red-600")
}

