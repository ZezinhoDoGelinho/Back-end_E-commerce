import { v4 } from 'uuid'
import User from '../models/User'

import * as Yup from 'yup' 

class UserController {
    async store(request,response){
        const schema = Yup.object().shape({
            name: Yup.string().required(), 
            email: Yup.string().email().required(),
            telephone: Yup.string().required(),
            cep: Yup.string().required(),
            address: Yup.string().required(),
            password: Yup.string().required().min(6),
        })

        try{
            await schema.validateSync(request.body, { abortEarly:false }) 
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }
        
        const { name, email, telephone, cep, address, password } = request.body

        const userExist = await User.findOne({
            where: { email },
        })
        
        if(userExist){
            return response.status(409).json({ error: 'User already exists' })
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            telephone,
            cep,
            address,
            password
        })
        
        return response.status(201).json({id: user.id, name, email})
    }
}

export default new UserController()