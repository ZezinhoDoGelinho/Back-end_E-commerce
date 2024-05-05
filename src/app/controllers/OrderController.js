// Responsavel pelo Cadastro do usuario

import * as Yup from 'yup' 
import Product from '../models/Product'
import Order from '../schemas/Order'
import User from '../models/User'

class OrderController {
    async store(request,response){
        const schema = Yup.object().shape({
            products: Yup.array()
            .required()
            .of(
                Yup.object().shape({
                    id: Yup.number().required(),
                    size: Yup.string().required(),
                    color: Yup.string().required(),
                    quantity: Yup.number().required(),
                })
            ), 
        })
 
        try{
            await schema.validateSync(request.body, { abortEarly:false }) 
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }

        const productsId = request.body.products.map( product => product.id)

        const updatedProducts = await Product.findAll({
            where:{
                id: productsId,
            },
        })

        const editedProduct = updatedProducts.map( product =>{
            //get the product index
            const productIndex = request.body.products.findIndex( 
                requestProduct => requestProduct.id === product.id
            )

            //formatting product
            const newProduct ={
                id: product.id,
                name: product.name,
                price: product.price,
                size: request.body.products[productIndex].size,
                color: request.body.products[productIndex].color,
                imagesUrls: product.imagesUrls[0],
                quantity: request.body.products[productIndex].quantity,
            }

            return newProduct
        })
        
        //final product format
        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            products: editedProduct,
            status: 'Pedido realizado',
        }

        const orderResponse = await Order.create(order)

        return response.status(201).json(orderResponse)
    }

    async index(request, response){
        const orders = await Order.find()

        return response.json(orders)
    }

    async update(request, response){
        const schema = Yup.object().shape({
            status: Yup.string().required()
        })

        try{
            await schema.validateSync(request.body, { abortEarly:false })
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }

        const { admin: isAdmin} = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json()
        }

        const { id } = request.params 
        const { status } = request.body 

        try {
            await Order.updateOne({ _id: id }, { status }) 
        }catch(error){
            return response.status(400).json({ error: error.message })
        }

        return response.json({ message: 'Status atualizado com sucesso!'})
    }
}

export default new OrderController()