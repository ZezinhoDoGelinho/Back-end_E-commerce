import * as Yup from 'yup'
import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'

import fs from 'fs'

const DeleteOldImages = async (ImgName) => {
    const caminhoDoArquivo = __dirname +'../../../uploads/product'+ `/${ImgName}`
    const callback = (err) => {
        if (err) {
            console.error('Erro ao excluir o arquivo:', err);
        } else {
            console.log('Arquivo excluído com sucesso.');
        }
    };
    await fs.unlink(caminhoDoArquivo, callback);
}

class ProductController {
    async store(request, response) {
        const schema = Yup.object().shape({
          name: Yup.string().required(),
          description: Yup.string().required(),
          price: Yup.number().required(),
          offer: Yup.boolean(),
          size: Yup.array().of(Yup.string().required()).required(),
          color: Yup.array().of(Yup.string().required()).required(),
          categories: Yup.array().of(Yup.number().required()).required(),
        });
      
        try {
          await schema.validate(request.body, { abortEarly: false });
        } catch (err) {
          return response.status(400).json({ error: err.errors });
        }
      
        const { admin: isAdmin } = await User.findByPk(request.userId);
      
        if (!isAdmin) {
          return response.status(401).json();
        }
      
        if (!request.files || request.files.length === 0) {
          return response.status(400).json({ error: 'Nenhuma imagem enviada.' });
        }

        const filenames = request.files.map(file => file.filename);
      
        const { name, size, color, description, price, categories, offer } = request.body;
      
        try {
          const product = await Product.create({
            name,
            size,
            color,
            description,
            price,
            images: [...filenames],
            offer,
          });
      
          await product.addCategories(categories);
      
          return response.json(product);
        } catch (err) {
          return response.status(500).json({ error: 'Erro ao criar o produto.' });
        }
    }
      
    async index(request, response){
        const products = await Product.findAll({
            include: [
                {
                    model: Category,
                    as: 'categories',
                    through: { attributes: []}
                }
            ]
        })
        return response.json(products)
    }

    async update(request, response){
        const schema = Yup.object().shape({
            name: Yup.string(),
            description: Yup.string(),
            price: Yup.number(),
            offer: Yup.boolean(),
            size: Yup.array().of(Yup.string()),
            color: Yup.array().of(Yup.string()),
            categories: Yup.array().of(Yup.string()),
        })

        try{
            await schema.validateSync(request.body, { abortEarly: false })
        }catch(err){
            return response.status(400).json({ error: err.errors })
        }

        const { admin: isAdmin } = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json()
        }

        const { id } = request.params

        const product = await Product.findByPk(id, {
            include: [{
                model: Category, as: 'categories'
            }]
        })

        if(!product){
            return response.status(401).json({ error: "Verifique se o ID do seu produto está correto"})
        }
        
        let filenames
        if (request.files.length > 0) {
            filenames = request.files.map(file => file.filename);
            product.images.map(img => DeleteOldImages(img))
        }else{
            filenames = product.images.map(name => name)
        }

        const { name, size, color, description, price, categories, offer } = request.body;

        await Product.update(
            { name, size, color, description, price, images: [...filenames], offer,}, { where: { id }}
        )

        if(categories.length > 0){
            await product.removeCategories(product.categories);
            await product.addCategories(categories);
        }

        return response.status(200).json()
    }

    async delete(request, response){
        const { id } = request.params
        const product = await Product.findByPk(id)

        const { admin: isAdmin } = await User.findByPk(request.userId)

        if(!isAdmin){
            return response.status(401).json()
        }
        
        if (product) {
            const {images: oldImages} = product 
            oldImages.map(img => DeleteOldImages(img))
            
            await product.destroy();
            return response.status(204).json({ message: 'Produto deletado com sucesso!'});
        } else {
            return response.status(404).json({ message: 'Produto não encontrado.'});
        }
    }
}

export default new ProductController()