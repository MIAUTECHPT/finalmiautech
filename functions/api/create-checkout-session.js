export async function onRequestPost(context) {
  try {
    const stripeSecretKey = context.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      return new Response(JSON.stringify({ error: "Chave secreta do Stripe não configurada." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const body = await context.request.json();
    const { amount, description, clientEmail, clientName } = body;

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Valor inválido para pagamento." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const params = new URLSearchParams();
    params.append('payment_method_types[0]', 'card');
    params.append('line_items[0][price_data][currency]', 'eur');
    params.append('line_items[0][price_data][unit_amount]', Math.round(amount * 100));
    params.append('line_items[0][price_data][product_data][name]', description || 'Reserva Miautech');
    params.append('line_items[0][quantity]', '1');
    params.append('mode', 'payment');
    params.append('success_url', `${new URL(context.request.url).origin}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`);
    params.append('cancel_url', `${new URL(context.request.url).origin}/cancelado.html`);

    if (clientEmail) {
      params.append('customer_email', clientEmail);
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params
    });

    const session = await response.json();

    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Podes adicionar aqui a chamada a uma API de email (ex: Resend) para te notificar
    // Exemplo: await fetch('https://api.resend.com/emails', { ... });

    return new Response(JSON.stringify({ id: session.id, url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}