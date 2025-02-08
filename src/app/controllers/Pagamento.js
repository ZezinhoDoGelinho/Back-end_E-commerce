import { MercadoPagoConfig, Preference } from 'mercadopago';
import Order from '../schemas/Order';
import { token_do_mercado_pago } from "../../dados.json"

class PagamentoController {
    async GerarPagamento(request, response) {
        try {
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

            // Criando a lista de itens para o MercadoPago
            const items = ultimoPedido.products.map(product => ({
                title: product.name,
                quantity: product.quantity,
                unit_price: product.price,
                currency_id: "BRL"
            }));

            // Criando a preferência de pagamento
            const preferenceResponse = await preference.create({ body: { items } });

            return response.status(201).json({
                preferenceId: preferenceResponse,
                items
            });

        } catch (error) {
            console.error('Erro ao gerar pagamento:', error);
            return response.status(500).json({ error: 'Erro ao processar pagamento' });
        }
    }
}

export default new PagamentoController();
