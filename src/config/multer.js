import multer from "multer";
import { v4 } from "uuid";
import { resolve } from 'path'

export const product = {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', 'uploads', 'product'),
        filename: ( request, file, callback) => {
            return callback(null,  v4() + '______' + file.originalname)
        },
    }),
}
export const category = {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', 'uploads', 'category'),
        filename: ( request, file, callback) => {
            return callback(null,  v4() + '______' + file.originalname)
        },
    }),
}