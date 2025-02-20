import * as Yup from 'yup' 
import User from '../models/User'
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import Order from '../schemas/Order';
import { token_do_mercado_pago } from "../../dados.json"

class PagamentoController {
    async gerarPagamento(request, response) {
        try {

            //const {formaDePagamento} = request.body
            
            // Token de acesso do MercadoPago
            const client = new MercadoPagoConfig({ accessToken: token_do_mercado_pago });
            const preference = new Preference(client);

            // Pegando o ID do cliente
            const clienteID = request.userId;

            // Buscando pedidos do cliente
            const pedidosDoCliente = await Order.find({ "user.id": clienteID });

            if (!pedidosDoCliente.length) {
                return response.status(404).json({ error: 'Nenhum pedido encontrado para este usuário.' });
            }

            // Pegando o último pedido
            const ultimoPedido = pedidosDoCliente[pedidosDoCliente.length - 1];

            // Verificando se há produtos no pedido
            if (!ultimoPedido.products.length) {
                return response.status(400).json({ error: 'O pedido não contém produtos.' });
            }

            const formaDePagamento = ultimoPedido.payment

            // Calcula o total multiplicando price * quantity e somando tudo
            const precoTotal = ultimoPedido.products.length > 0
            ? ultimoPedido.products.map(product => product.price * product.quantity)
                            .reduce((acc, total) => acc + total, 0)
            : 0;

            if(formaDePagamento == 'cartao'){
                // Criando a preferência de pagamento
                const preferenceResponse = await preference.create({ body: { 
                    items: [
                        {
                          title: 'Total',
                          quantity: 1,
                          unit_price: precoTotal
                        }
                      ],
                    } 
                });

                return response.status(201).json({
                    link: preferenceResponse.init_point
                });
            }
            if(formaDePagamento == 'pix'){

                const payment = new Payment(client);
                const cliente = await User.findOne({id: clienteID })

                const preferenceResponse = await payment.create({ body: {
                        transaction_amount: precoTotal,
                        description: '',
                        payment_method_id: 'pix',
                        payer: {
                            email: cliente.email
                        }
                    } 
                })

                return response.status(201).json({link: preferenceResponse.point_of_interaction.transaction_data.ticket_url});
            }else{
                return response.status(400).json({ error: 'Forma de pagamento não reconhecida' });
            }
        } catch (error) {
            console.error('Erro ao gerar pagamento:', error);
            return response.status(500).json({ error: 'Erro ao processar pagamento' });
        }
    }
}

export default new PagamentoController();
