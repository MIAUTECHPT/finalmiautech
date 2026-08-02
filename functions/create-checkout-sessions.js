async function iniciarPagamento() {
  const resposta = await fetch('/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ item: 'Reserva Miautech' })
  });

  const dados = await resposta.json();
  console.log(dados);
}