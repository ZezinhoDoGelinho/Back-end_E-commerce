import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../models/User'

class SessionController {
    async store(request,response){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        const useEmailOrPasswordIncorrect = () => {
            return response.status(400).json({ message:'Make sure your password or email are correct' })
        }

        try{
            await schema.validateSync(request.body, { abortEarly: false})
        }catch(err){
            return response.status(400).json({error: err.errors})
        }

        if(!(schema.isValid(request.body))) { useEmailOrPasswordIncorrect() }

        const { email, password } = request.body

        const user = await User.findOne({
            where: {email},
        })

        if(!user){ useEmailOrPasswordIncorrect() }

        if(!(await user.checkPassword(password))){ useEmailOrPasswordIncorrect() }

        try{
            return response.json({
                id: user.id,
                email,
                name: user.name,
                admin: user.admin,
                token: jwt.sign(
                    {id: user.id, name: user.name }, 
                    authConfig.secret, { expiresIn: authConfig.expiresIn,}
                )
            })
        }catch(err){
            return response.status(404).json()
        }
    }
}

export default new SessionController()