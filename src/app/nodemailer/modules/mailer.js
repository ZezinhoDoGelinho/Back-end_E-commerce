import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import { host, port, user, pass, service } from "../config/mail.json"

const transport = nodemailer.createTransport({
    service,
    host, 
    port, 
    auth: { user, pass }
});

transport.use('compile', hbs({
    viewEngine: {
        extname: '.handlebars',
        layoutsDir: path.resolve('src/app/nodemailer/resources/mail/layouts/'),
        defaultLayout: 'main',
        partialsDir: path.resolve('src/app/nodemailer/resources/mail/partials/'), // se necessário
    },
    viewPath: path.resolve('src/app/nodemailer/resources/mail/'), // diretório dos templates de e-mail
    extName: '.html',
}));

export default transport