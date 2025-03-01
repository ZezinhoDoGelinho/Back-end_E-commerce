import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'
import User from '../models/User'
import crypto from 'crypto'
import mailer from '../nodemailer/modules/mailer'
class SessionController {
    async login(request,response){
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required(),
        })

        try{
            await schema.validateSync(request.body, { abortEarly: false})
        }catch(err){
            return response.status(400).json({error: err.errors})
        }

        if(!(schema.isValid(request.body))) { return response.status(400).json({ message:'Certifique-se de que sua senha ou e-mail estejam corretos' }) }

        const { email, password } = request.body

        const user = await User.findOne({
            where: {email},
        })

        if(!user){ return response.status(400).json({ message:'Usuario não encontrado' }) }

        if(!(await user.checkPassword(password))){ return response.status(400).json({ message:'Email ou senha não ' }) }

        try{
            return response.json({
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
        try{
            mailer.sendMail({
                  to: email,
                  from: user, // Esse user é o remetente
                  template: 'auth/forgot_password',
                  context: { token },
                });
            return response.status(200).json({ message: 'Enviaremos o código de recuperação para seu e-mail!'})
        }catch(err){
            return response.status(400).json({ error: 'Erro ao enviar e-mail', details: err });
        }
        
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