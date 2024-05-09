
import Admin from '../models/Admin'
import User from '../models/User'

import * as Yup from 'yup'
import Admin from '../models/Admin'

class AdminController {
    async register(request,response){
        const schema = Yup.object().shape({
            id: Yup.string().required(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly:false }) 
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }
        const permission = await Admin.findByPk(request.userId)
        if(!permission){ return response.status(401).json({error: "You are not authorized to perform this operation!"})}
        
        const { id } = request.body

        const adminExist = await Admin.findByPk(id)
        if(adminExist){
            return response.status(409).json({ error: 'Admin is already registered!' })
        }

        const user = await User.findByPk(id)
        if(!user){ return response.status(400).json({message: "User not found!"})}
        
        const newAdmin = await Admin.create({
            id: user.id,
            name: user.name,
            email: user.email,
        })
        
        return response.status(201).json( {message: {id: newAdmin.id, name: newAdmin.name, email: newAdmin.email }})
    }
    async delete(request,response){
        const schema = Yup.object().shape({
            id: Yup.string().required(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly:false }) 
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }
        const permission = await Admin.findByPk(request.userId)
        if(!permission){ return response.status(401).json({error: "You are not authorized to perform this operation!"})}
        
        const { id } = request.body

        const adminExist = await Admin.findByPk(id)
        if(!adminExist){
            return response.status(401).json({ error: 'Admin not found!' })
        }

        await adminExist.destroy()
        return response.status(201).json( {message:'Admin removed!'})
    }
}

export default new AdminController()