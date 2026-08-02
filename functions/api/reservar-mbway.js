export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { numReserva, nome, email, telefone, entrega, devolucao, localidade, tipoEquipamento, valorTotal } = body;
    
    const resendApiKey = context.env.RESEND_API_KEY; // Chave configurada na Cloudflare
    const fornecedorEmail = context.env.FORNECEDOR_EMAIL || "geral@miautech.pt";

    if (resendApiKey) {
      // Email para o Cliente
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'MiautechPT <noreply@miautech.pt>',
          to: [email],
          subject: `Reserva ${numReserva} - Instruções MB WAY`,
          html: `<p>Olá <strong>${nome}</strong>,</p>
                 <p>A sua reserva <strong>${numReserva}</strong> para o equipamento <strong>${tipoEquipamento}</strong> foi registada com sucesso.</p>
                 <p>Para concluir, efetue o pagamento por <strong>MB WAY</strong> para o número <strong>918642824</strong> indicando a referência da reserva: <strong>${numReserva}</strong>.</p>
                 <p>Valor a pagar: <strong>${valorTotal}</strong></p>`
        })
      });

      // Email para o Fornecedor
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'MiautechPT <noreply@miautech.pt>',
          to: [fornecedorEmail],
          subject: `Nova Reserva MB WAY: ${numReserva} - ${nome}`,
          html: `<p>Foi efetuada uma nova reserva via MB WAY:</p>
                 <ul>
                   <li><strong>Ref:</strong> ${numReserva}</li>
                   <li><strong>Cliente:</strong> ${nome} (${email} / ${telefone})</li>
                   <li><strong>Equipamento:</strong> ${tipoEquipamento}</li>
                   <li><strong>Datas:</strong> ${entrega} a ${devolucao}</li>
                   <li><strong>Localidade:</strong> ${localidade}</li>
                   <li><strong>Valor:</strong> ${valorTotal}</li>
                 </ul>`
        })
      });
    }

    return new Response(JSON.stringify({ success: true }), {
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