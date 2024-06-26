import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../models/User'
import crypto from 'crypto'
import mailer from '../../modules/mailer'
class SessionController {
    async store(request,response){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly: false})
        }catch(err){
            return response.status(400).json({error: err.errors})
        }

        if(!(schema.isValid(request.body))) { return response.status(400).json({ message:'Make sure your password or email are correct' }) }

        const { email, password } = request.body

        const user = await User.findOne({
            where: {email},
        })

        if(!user){ return response.status(400).json({ message:'Make sure your password or email are correct' }) }

        if(!(await user.checkPassword(password))){ return response.status(400).json({ message:'Make sure your password or email are correct' }) }

        try{
            return response.json({
                id: user.id,
                email,
                name: user.name,
                token: jwt.sign(
                    {id: user.id, name: user.name }, 
                    authConfig.secret, { expiresIn: authConfig.expiresIn,}
                )
            })
        }catch(err){
            return response.status(404).json()
        }
    }

    async recoverPassword(request,response){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly:false }) 
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }

        const { email } = request.body

        const user = await User.findOne({
            where: { email },
        })
        
        if(!user){
            return response.status(409).json({ error: 'User not found' })
        }

        //Gerar token
        const token = crypto.randomBytes(20).toString('hex')
        //criando expiração do token
        const now = new Date()

        now.setHours(now.getHours() + 1)

        await user.update(
            { 
                password_reset_token: token,
                password_reset_expires: now,
            }
        )
        
        mailer.sendMail({
            to: email,
            from: 'API@teste.com',
            template: 'auth/forgot_password',
            context: { token },
        }, (err)=> {
            if (err) {
                return response.status(400).json({error: 'Error sending email:', err});
            }
        })

        return response.status(200).json({ message: 'We will send the recovery code to your email!'})
    }
    async redefinePassword(request,response){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            token: Yup.string().required(),
            password: Yup.string().required(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly:false }) 
        } catch (err) {
            return response.status(400).json({ error: err.errors}) 
        }

        const { email, token, password } = request.body

        try{
            const user = await User.findOne({
                where: { email },
            })

            if(!user){
                return response.status(409).json({ error: 'User not found' })
            }

            if(token !== user.password_reset_token){
                return response.status(400).json({ error: 'Invalid token!'})
            }

            const now = new Date()
            if(now > user.password_reset_expires){
                return response.status(400).json({ error: 'Token expired, request a new one!'})
            }

            user.password = password
            user.password_reset_expires = null
            user.password_reset_token = null
            await user.save()
            return response.status(200).json({message: 'Password updated successfully!'})

        }catch(err){
            return response.status(400).json({error: err.error})
        }
    }
}

export default new SessionController()