import { Router } from "express"
import multer from 'multer'
import {product, category} from './config/multer'

import UserController from "./app/controllers/UserController"
import SessionController from "./app/controllers/SessionController"
import ProductController from './app/controllers/ProductController'
import CategoryController from './app/controllers/CategoryController'
import OrderController from "./app/controllers/OrderController"

import authMiddleware from './app/middlewares/auth'


const produto = multer(product)
const categoria = multer(category)

const routes = new Router()

//Cadastro
routes.post('/users', UserController.store)
//Login
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

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
routes.post('/orders', OrderController.store)
routes.get('/orders', OrderController.index)
routes.put('/orders/:id', OrderController.update)

export default routes