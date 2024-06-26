import Sequelize, { Model } from "sequelize";

class Admin extends Model {
    static init(sequelize){
        super.init({
            name: Sequelize.STRING,
            email: Sequelize.STRING,
            },
            {
                sequelize,
            }
        )
        return this
    }
}

export default Admin