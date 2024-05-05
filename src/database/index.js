import Sequelize from "sequelize";
import mongoose from "mongoose";

import configDataBase from '../config/database'

import User from "../app/models/User";
import Product from "../app/models/Product";
import Category from "../app/models/Category";

const models = [User, Product, Category]

class Database {
    constructor(){
        this.init()
        this.mongo()
    }

    //PostgreSQL conection
    init(){
        this.connection = new Sequelize(configDataBase)

        models.map( model => model.init(this.connection))
        .map(model => model.associate && model.associate(this.connection.models))
    }

    //MongoDB conection
    mongo(){
        this.mongoConnection = mongoose.connect(
            'mongodb://localhost:27017/nome_do_E-commerce'
        )
    }
}

export default new Database()