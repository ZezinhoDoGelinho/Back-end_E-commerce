import * as Yup from 'yup'
import Category from '../models/Category'
import Admin from '../models/Admin'

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

class CategoryController{
    async store(request, response){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly: false })
        }catch(err){
            return response.status(400).json({ error: err.errors })
        }

        const permission = await Admin.findByPk(request.userId)
        if(!permission){ return response.status(401).json({error: "Você não tem autorização para fazer essa operação!"})}

        const { name } = request.body
        const { filename: path } = request.file

        const categoryExists = await Category.findOne({
            where: { name },
        })

        if(categoryExists){
            return response.status(400).json({ error: 'Categoria já existe!'})
        }

        const { id } = await Category.create({ name, path })

        return response.json({ name, id })
    }

    async index(request, response){
        const categories = await Category.findAll()
        return response.json(categories)
    }

    async update(request, response){
        const schema = Yup.object().shape({
            name: Yup.string(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly: false })
        }catch(err){
            return response.status(400).json({ error: err.errors })
        }

        const permission = await Admin.findByPk(request.userId)
        if(!permission){ return response.status(401).json({error: "Você não tem autorização para fazer essa operação!"})}

        const { name } = request.body
        const { id } = request.params

        const category = await Category.findByPk(id)

        if(!category){ return response.status(401).json({ error: "Categoria não encontrada!"})}

        let path
        if(request.file){
            path = request.file.filename

            const {path: foto} = category
            DeleteOldImages(foto)
        }
        
        await Category.update({ name, path }, {where: {id}})

        return response.status(200).json()
    }

    async delete(request, response){
        const { id } = request.params
        const category = await Category.findByPk(id)

        const permission = await Admin.findByPk(request.userId)
        if(!permission){ return response.status(401).json({error: "Você não tem autorização para fazer essa operação!"})}
        
        if (category) {
            const {path: foto} = category
            DeleteOldImages(foto)
            
            await category.destroy();
            return response.status(204).json({ message: 'Categoria deletada com sucesso!'});
        } else {
            return response.status(404).json({ message: 'Categoria não encontrada!'});
        }
    }
}

export default new CategoryController()