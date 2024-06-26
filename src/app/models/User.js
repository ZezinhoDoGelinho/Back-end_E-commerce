import Sequelize, { Model } from "sequelize";
import bcrypt from 'bcrypt'

class User extends Model {
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            telephone: Sequelize.STRING,
            cep: Sequelize.STRING,
            address: Sequelize.STRING,
            password: Sequelize.VIRTUAL,
            password_hash: Sequelize.STRING,
            password_reset_token: Sequelize.STRING,
            password_reset_expires: Sequelize.DATE,
            },
            {
                sequelize,
            }
        )
        this.addHook('beforeSave', async(user) => {
            if(user.password){
                user.password_hash = await bcrypt.hash(user.password, 10)
            }
        })
        return this
    }

    checkPassword(password){
        return bcrypt.compare(password, this.password_hash)
    }
}

export default User