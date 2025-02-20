import { v4 } from 'uuid'
import User from '../models/User'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

import * as Yup from 'yup' 

class UserController {
    async CreateAccount(request,response){
        const schema = Yup.object().shape({
            name: Yup.string().required(), 
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
        })

        try{
            await schema.validateSync(request.body, { abortEarly:false }) 
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }
        
        const { name, email, password } = request.body

        const userExist = await User.findOne({
            where: { email },
        })
        
        if(userExist){
            return response.status(409).json({ error: 'O usuário já existe' })
        }

        const user = await User.create({
            id: v4(),
            name,
            email,
            password
        })
        
        return response.status(201).json({
            token: jwt.sign(
            {id: user.id, name: user.name }, 
            authConfig.secret, { expiresIn: authConfig.expiresIn,}
        )})
    }
}

export default new UserController()