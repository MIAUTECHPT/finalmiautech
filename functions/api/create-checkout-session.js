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
    const { amount, description } = body;

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: "Valor inválido para pagamento." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Pedido à API do Stripe utilizando automatic_payment_methods
    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeSecretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'automatic_payment_methods[enabled]': 'true',
        'line_items[0][price_data][currency]': 'eur',
        'line_items[0][price_data][unit_amount]': Math.round(amount * 100),
        'line_items[0][price_data][product_data][name]': description || 'Reserva Miautech',
        'line_items[0][quantity]': '1',
        'mode': 'payment',
        'success_url': `${new URL(context.request.url).origin}/sucesso.html?session_id={CHECKOUT_SESSION_ID}`,
        'cancel_url': `${new URL(context.request.url).origin}/cancelado.html`,
      })
    });

    const session = await response.json();

    if (session.error) {
      return new Response(JSON.stringify({ error: session.error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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