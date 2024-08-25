// Variables
const carrito = document.querySelector("#carrito");
const listaCursos = document.querySelector("#lista-cursos");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const cantidadCard= document.querySelector("#cantidadCard");
let articulosCarrito = [];
const totalCompra = document.querySelector("#totalCompra");

// Listeners
cargarEventListeners();

function cargarEventListeners() {
  //cuando agregas un curso presionando "Agregar al Carrito"

  listaCursos.addEventListener("click", agregarCurso);

  //Eliminar curso del carrito
  carrito.addEventListener("click", eliminarCurso);

  carrito.addEventListener("click", cardPlus);

  carrito.addEventListener("click", cardMinus);

  vaciarCarritoBtn.addEventListener("click", LimpiarCarrito);
}

// Función que añade el curso al carrito
function agregarCurso(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const curso = e.target.parentElement.parentElement;

    leerDatosCurso(curso);
  }
}

// Lee los datos del curso
function leerDatosCurso(curso) {
  const infoCurso = {
    imagen: curso.querySelector("img").src,
    titulo: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
    totalProducto: parseFloat(
      curso.querySelector(".precio span").textContent.replace("$", "")
    ),
  };

  // Revisa si un elemento ya existe en el carrito
  const existe = articulosCarrito.some((curso) => curso.id === infoCurso.id);

  if (existe) {
    const cursos = articulosCarrito.map((curso) => {
      const preci = parseFloat(curso.precio.replace("$", ""));

      if (curso.id === infoCurso.id) {
        curso.cantidad++;
        curso.totalProducto = preci * curso.cantidad;
        return curso;
      } else {
        return curso;
      }
    });
    articulosCarrito = [...cursos];
  } else {
    articulosCarrito = [...articulosCarrito, infoCurso];
  }

  totalCliente();
  carritoHTML();
  dataTotalCard()

  // console.log(articulosCarrito)
}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e) {
  // e.target.parentElement.parentElement.remove();
  // Eliminar del arreglo del carrito
  if (e.target.classList.contains("borrar-curso")) {
    const cursoId = e.target.getAttribute("data-id");

    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);

    carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
    totalCliente();
    dataTotalCard()
  }
}

// Muestra el curso seleccionado en el Carrito
function carritoHTML() {
  // NUEVO:

  vaciarCarrito();

  articulosCarrito.forEach((curso) => {
    const row = document.createElement("tr");
    row.innerHTML = `
       <td>
          <img src="${curso.imagen}" width=100>
       </td>
       <td>${curso.titulo}</td>
       <td>${curso.precio}</td>
       <td>${curso.cantidad}</td>
       <td>$${curso.totalProducto}</td>
       <td>
          <a href="#" class="btn-minus" data-id="${curso.id}"> - </a>
          <a href="#" class="btn-plus" data-id="${curso.id}"> + </a>
       <td>
       
       <td>
         
          <a href="#" class="borrar-curso" data-id="${curso.id}"> X </a>
       </td>
     `;
    contenedorCarrito.appendChild(row);
  });
  sincronizarStorage();
}

function LimpiarCarrito() {
  // Limpiar el HTML
  vaciarCarrito();
  // Vaciar el carrito
  articulosCarrito = [];

  sincronizarStorage();
  totalCliente();
  dataTotalCard()
}

// NUEVO:
function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

document.addEventListener("DOMContentLoaded", () => {
  articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoHTML();
  totalCliente();
  dataTotalCard()
});

// Elimina los cursos del carrito en el DOM
function vaciarCarrito() {
  // forma rapida (recomendada)
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

function cardPlus(e) {
  if (e.target.classList.contains("btn-plus")) {
    const cursoId = e.target.getAttribute("data-id");
    const existe = articulosCarrito.some((curso) => curso.id === cursoId);

    if (existe) {
      const cursos = articulosCarrito.map((curso) => {
        const preci = parseFloat(curso.precio.replace("$", ""));

        if (curso.id === cursoId) {
          curso.cantidad++;
          curso.totalProducto = preci * curso.cantidad;
          return curso;
        } else {
          return curso;
        }
      });
      articulosCarrito = [...cursos];
      carritoHTML();
      totalCliente();
    }
  }
}

function cardMinus(e) {
  if (e.target.classList.contains("btn-minus")) {
    const cursoId = e.target.getAttribute("data-id");
    const existe = articulosCarrito.some((curso) => curso.id === cursoId);

    if (existe) {
      const cursos = articulosCarrito.map((curso) => {

        if (curso.id === cursoId) {
          if (curso.cantidad > 1) {
            const preci = parseFloat(curso.precio.replace("$", ""));
            curso.cantidad--;
            curso.totalProducto = preci * curso.cantidad;
            return curso;
          }else{
               return curso;
          }
        } else {
          return curso;
        }
      });
      articulosCarrito = [...cursos];
      carritoHTML();
      totalCliente();
    }
  }
}

function totalCliente() {
  // total
  let total = 0;

  articulosCarrito.forEach((curso) => {
    const { totalProducto } = curso;

    total += totalProducto;
  });

  totalCompra.textContent = `Total : $${total}`;
}

function  dataTotalCard(){
     cantidadCard.textContent = articulosCarrito.length;
     localStorage.setItem("cantidadCard", JSON.stringify(articulosCarrito.length));
}

function leerDataLocal(){
     cantidadCard.textContent = JSON.parse(localStorage.getItem("cantidadCard"));
     
}