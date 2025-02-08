import path from 'path'
import nodemailer from 'nodemailer'
import hbs from 'nodemailer-express-handlebars'
import { email, senha_de_aplicativo_do_email } from "../../../dados.json"

const transport = nodemailer.createTransport({
    service: "gmail",
    host: " smtp.gmail.com", 
    port: 587, 
    auth: {
        user: email, 
        pass : senha_de_aplicativo_do_email
    }
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