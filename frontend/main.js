const saboresContainer = document.getElementById("sabores");
const productosContainer = document.getElementById("productos");
const nombreInput = document.getElementById("nombre");
const productoSelect = document.getElementById("producto");
const cantGustosSelect = document.getElementById("cantGustos");
const saboresRestantes = document.getElementById("saboresRestantes");
const hacerPedido = document.getElementById("hacerPedido");
let productosDisponibles;
let saboresSeleccionados = [];

function limpiarSabores() {
  saboresSeleccionados = [];
  const sabores = saboresContainer.querySelectorAll(".sabor");
  for (let i = 0; i < sabores.length; i++) {
    sabores[i].classList.remove("seleccionado");
  }
}

function actualizarMaxGustos() {
  limpiarSabores();
  saboresRestantes.innerText = cantGustosSelect.value;
}

cantGustosSelect.addEventListener("change", actualizarMaxGustos);

function actualizarCantGustos() {
  let producto;
  for (let i = 0; i < productosDisponibles.length; i++) {
    if (productosDisponibles[i].nombre === productoSelect.value) {
      producto = productosDisponibles[i];
      break;
    }
  }
  cantGustosSelect.innerHTML = "";
  for (let i = 1; i <= producto.maxGustos; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.innerText = i;
    cantGustosSelect.appendChild(option);
  }
  actualizarMaxGustos();
}

function clickSabor(e) {
  let saborDiv = e.target;
  while (
    saborDiv.dataset.sabor === undefined &&
    saborDiv.parentElement !== null
  ) {
    saborDiv = saborDiv.parentElement;
  }
  if (saborDiv.dataset.sabor === undefined) return;
  let sabor = saborDiv.dataset.sabor;
  let seleccionado = saboresSeleccionados.indexOf(sabor) !== -1;
  let restantes = parseInt(saboresRestantes.innerText);
  if (seleccionado) {
    saboresSeleccionados = saboresSeleccionados.filter((s) => s !== sabor);
    saboresRestantes.innerText = restantes + 1;
    saborDiv.classList.remove("seleccionado");
  } else if (restantes > 0) {
    saboresSeleccionados.push(sabor);
    saboresRestantes.innerText = restantes - 1;
    saborDiv.classList.add("seleccionado");
    if (restantes === 0) {
      saboresContainer.removeEventListener("click", clickSabor);
    }
  }
}

function limpiarPedido() {
  nombreInput.value = "";
  limpiarSabores();
}

function enviarPedido() {
  let producto = productoSelect.value;
  let sabores = saboresSeleccionados;
  let nombre = nombreInput.value;
  let restantes = parseInt(saboresRestantes.innerText);
  if (producto !== "" && nombre !== "" && restantes === 0) {
    postData("pedido", { producto, sabores, nombre }, (response) => {
      if (response.ok) {
        alert("Pedido enviado correctamente");
        limpiarPedido();
      } else {
        alert("Error al enviar el pedido");
      }
    });
  } else {
    alert("Complete todos los campos");
  }
}

saboresContainer.addEventListener("click", clickSabor);

productoSelect.addEventListener("change", actualizarCantGustos);

hacerPedido.addEventListener("click", enviarPedido);

fetchData("sabores", (sabores) => {
  for (let i = 0; i < sabores.length; i++) {
    let sabor = sabores[i];
    const saborDiv = document.createElement("div");
    saborDiv.classList.add("sabor");
    saborDiv.dataset.sabor = sabor;
    saborDiv.innerHTML = `<span>${sabor}</span> `;
    saboresContainer.appendChild(saborDiv);
  }
});
fetchData("productos", (productos) => {
  productosDisponibles = productos;
  for (let i = 0; i < productos.length; i++) {
    let producto = productos[i];
    const productoDiv = document.createElement("li");
    productoDiv.innerText = `${producto.nombre} $${producto.precio}p (hasta ${producto.maxGustos} gustos)`;
    productosContainer.appendChild(productoDiv);
    const productoOption = document.createElement("option");
    productoOption.value = producto.nombre;
    productoOption.innerText = producto.nombre;
    productoSelect.appendChild(productoOption);
  }
  actualizarCantGustos();
});
