// Responsavel pelo Cadastro do usuario

import * as Yup from 'yup' 
import Product from '../models/Product'
import Order from '../schemas/Order'
import Admin from '../models/Admin'

class OrderController {
    async criarPedido(request,response){
        const schema = Yup.object().shape({
            payment: Yup.string().required(),
            products: Yup.array()
            .required().min(1)
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
            //obter o índice do produto
            const productIndex = request.body.products.findIndex( 
                requestProduct => requestProduct.id === product.id
            )

            //formatação de produto
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
        
        //formato final do produto
        const order = {
            user: {
                id: request.userId,
                name: request.userName,
            },
            payment: request.body.payment,
            products: editedProduct,
            status: 'Aguardando pagamento',
        }

        const orderResponse = await Order.create(order)

        return response.status(201).json(orderResponse)
    }

    async todosOsPedidos(request, response){
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

        const permission = await Admin.findByPk(request.userId)
        if(!permission){ return response.status(401).json({error: "Você não está autorizado a realizar esta operação!"})}

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