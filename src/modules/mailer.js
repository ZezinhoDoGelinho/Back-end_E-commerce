import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import { host, port, user, pass } from "../config/mail.json"

const transport = nodemailer.createTransport({
    host, 
    port, 
    auth: { user, pass }
});

transport.use('compile', hbs({
    viewEngine: {
        extname: '.handlebars',
        layoutsDir: path.resolve('src/resources/mail/layouts/'),
        defaultLayout: 'main',
        partialsDir: path.resolve('src/resources/mail/partials/'), // se necessário
    },
    viewPath: path.resolve('src/resources/mail/'), // diretório dos templates de e-mail
    extName: '.html',
}));


export default transport