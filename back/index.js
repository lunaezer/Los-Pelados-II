import { subscribePOSTEvent, subscribeGETEvent, startServer } from "soquetic"
import fs from "fs"

let productos = JSON.parse(fs.readFileSync("../data/productos.json", "utf-8"))
let sabores = JSON.parse(fs.readFileSync("../data/sabores.json", "utf-8"))

function getProductos() {
  return productos
}
function getSabores() {
  return sabores
}

function postPedido(pedido) {
  let pedidos = JSON.parse(fs.readFileSync("../data/pedidos.json", "utf-8"))
  pedidos.push(pedido)
  fs.writeFileSync("../data/pedidos.json", JSON.stringify(pedidos, null, 2))
  return {ok: true}
}

subscribeGETEvent("productos", getProductos)
subscribeGETEvent("sabores", getSabores)
subscribePOSTEvent("pedido", postPedido)

startServer()