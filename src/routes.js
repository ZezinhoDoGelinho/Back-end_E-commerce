import { Router } from "express"
import multer from 'multer'
import {product, category} from './config/multer'

import UserController from "./app/controllers/UserController"
import SessionController from "./app/controllers/SessionController"
import ProductController from './app/controllers/ProductController'
import CategoryController from './app/controllers/CategoryController'
import PedidoController from "./app/controllers/PedidoController"
import Pagamento from "./app/controllers/Pagamento"

import authMiddleware from './app/middlewares/auth'
import AdminController from "./app/controllers/AdminController"


const produto = multer(product)
const categoria = multer(category)

const routes = new Router()

//Cadastro
routes.post('/users', UserController.store)
//Login
routes.post('/sessions', SessionController.store)
//Recuperar senha
routes.post('/recover-password', SessionController.recoverPassword)
routes.post('/redefine-password', SessionController.redefinePassword)

routes.use(authMiddleware)
//Admin
routes.post('/admin', AdminController.register)
routes.delete('/admin', AdminController.delete)

//Produto
routes.post('/products', produto.array('images'), ProductController.store) 
routes.get('/products', ProductController.index) 
routes.put('/products/:id', produto.array('images'), ProductController.update) 
routes.delete('/products/:id',  ProductController.delete) 

//Categorias
routes.post('/categories',categoria.single('images'), CategoryController.store)
routes.get('/categories', CategoryController.index)
routes.put('/categories/:id', categoria.single('images'), CategoryController.update)
routes.delete('/categories/:id', CategoryController.delete)

//Pedidos
routes.post('/orders', PedidoController.criarPedido)
routes.get('/orders', PedidoController.todosOsPedidos)
routes.put('/orders/:id', PedidoController.update)

//Pagamento
routes.post('/pagamento', Pagamento.GerarPagamento)


export default routes