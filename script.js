let itemsDisponibles = [];
let carrito = [];
let total = 0;

async function cargarItemsDisponibles() {
    try {
        const response = await fetch('items.json');
        if (!response.ok) {
            throw new Error('Error al cargar los items disponibles');
        }
        const data = await response.json();
        itemsDisponibles = data;
    } catch (error) {
        console.error(error);
    }
}

function agregarItemAlCarrito(itemID) {
    const itemEncontrado = itemsDisponibles.find(item => item.id === itemID);
    if (itemEncontrado) {
        carrito.push(itemEncontrado);
        total += itemEncontrado.precio;
        actualizarCarrito();
    }
}

function actualizarCarrito() {
    mostrarCarritoEnHTML();
    guardarCarritoEnLocalStorage();
}

function mostrarCarritoEnHTML() {
    const itemsList = document.getElementById("items-list");
    itemsList.innerHTML = "";
    carrito.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.nombre} - $${item.precio.toFixed(3)}`;
        itemsList.appendChild(li);
    });
    document.getElementById("total-price").innerText = `$${total.toFixed(3)}`;
}

function realizarCompra() {
    carrito = [];
    total = 0;
    actualizarCarrito();
    mostrarMensajeCompraExitosa();
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("total", JSON.stringify(total));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem("carrito");
    const totalGuardado = localStorage.getItem("total");
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }
    if (totalGuardado) {
        total = JSON.parse(totalGuardado);
    }
    actualizarCarrito();
}

document.addEventListener("DOMContentLoaded", async () => {
    await cargarItemsDisponibles();
    cargarCarritoDesdeLocalStorage();

    const buttons = document.querySelectorAll(".btn-add-to-cart");
    buttons.forEach(button => {
        button.addEventListener("click", (event) => {
            const itemID = parseInt(event.target.dataset.itemId);
            agregarItemAlCarrito(itemID);
        });
    });

    const btnCheckout = document.getElementById("btn-checkout");
    btnCheckout.addEventListener("click", (event) => {
        event.preventDefault();
        realizarCompra();
    });
});

function mostrarMensajeCompraExitosa() {
    Swal.fire({
        title: 'Listo!',
        text: 'Tu compra fue hecha!',
        icon: 'success',
        confirmButtonText: 'Cool'
    });
}




