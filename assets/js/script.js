// ======================================
// MIAUTECHPT V4 - JavaScript Principal
// ======================================
'use strict';

/**
 * Captura os dados do formulário de contactos/reserva
 * e redireciona para a conversa do WhatsApp com mensagem formatada.
 */
function enviarWhatsApp() {
    // Captura os valores de forma segura (fallback para string vazia)
    const nome = document.getElementById("nome")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const telefone = document.getElementById("telefone")?.value.trim() || "";
    const dataEntrega = document.getElementById("dataEntrega")?.value || document.getElementById("data")?.value || "";
    const dataDevolucao = document.getElementById("dataDevolucao")?.value || "";
    const periodo = document.getElementById("periodo")?.value || "";
    const localidade = document.getElementById("localidade")?.value.trim() || "";
    const mensagem = document.getElementById("mensagem")?.value.trim() || "";
    const numReserva = document.getElementById("numReservaInput")?.value || "";
    const valorTotal = document.getElementById("valorTotalInput")?.value || "";

    // Validação básica dos campos obrigatórios
    if (!nome || !telefone) {
        alert("Por favor, preencha pelo menos o seu Nome e Telemóvel antes de enviar por WhatsApp.");
        return;
    }

    // Construção das datas para o texto
    let infoDatas = `📅 Data pretendida: ${dataEntrega}`;
    if (dataDevolucao) {
        infoDatas = `📅 Período: ${dataEntrega} até ${dataDevolucao}`;
    } else if (periodo) {
        infoDatas += `\n⏳ Duração: ${periodo}`;
    }

    // Formatação da mensagem
    const texto = 
`Olá MiautechPT! 🐱

Gostaria de solicitar a reserva do Pack PETKIT.

${numReserva ? `🔖 Ref. Reserva: ${numReserva}\n` : ''}👤 Nome: ${nome}
📧 Email: ${email || "Não informado"}
📞 Telemóvel: ${telefone}
${infoDatas}
📍 Localidade: ${localidade || "Não informada"}
${valorTotal ? `💰 Valor Estimado: ${valorTotal}\n` : ''}
📝 Observações:
${mensagem || "Nenhuma"}`;

    // Abertura do link do WhatsApp numa nova página
    const url = `https://wa.me/351918642824?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
}

/**
 * Animação de entrada (Fade In / Scroll Reveal)
 * Executa quando os elementos com .fade-up entram no viewport.
 */
document.addEventListener("DOMContentLoaded", () => {
    // Verifica se o browser suporta IntersectionObserver
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                    observer.unobserve(entry.target); // Deixa de observar após animar
                }
            });
        }, {
            threshold: 0.1 // Ativa a animação quando 10% do elemento estiver visível
        });

        // Observa todos os elementos com a classe .fade-up
        document.querySelectorAll(".fade-up").forEach((el) => {
            observer.observe(el);
        });
    }
});

/**
 * Função para partilhar o site através do dispositivo
 */
async function partilharSite() {
    const shareData = {
        title: 'MiautechPT - Aluguer de Tecnologia para Gatos',
        text: 'Vá de férias descansado! Alugue o Pack PETKIT e monitorize o seu gato.',
        url: window.location.href
    };

    if (navigator.share) {
        try {
            await navigator.share(shareData);
            console.log('Partilhado com sucesso!');
        } catch (error) {
            // Ignora o erro caso o utilizador tenha cancelado a partilha
            if (error.name !== 'AbortError') {
                console.error('Erro ao partilhar:', error);
            }
        }
    } else {
        // Fallback: Copia o link para a área de transferência
        try {
            await navigator.clipboard.writeText(window.location.href);
            alert('Link do site copiado para a área de transferência!');
        } catch (err) {
            console.error('Erro ao copiar link:', err);
        }
    }
}

/**
 * Atualiza os elementos visuais do resumo de preço e equipamento no ecran
 */
function atualizarEcra(valorFinal, numDias, valorBase, temDesconto, texto) {
    const valorTotalSpan = document.getElementById('valorTotal');
    const valorOriginalSpan = document.getElementById('valorOriginal');
    const detalhesCalculo = document.getElementById('detalhesCalculo');
    const soCaixaElem = document.getElementById('soCaixa');
    const valorTotalInput = document.getElementById('valorTotalInput');

    const itemCaixa = document.getElementById('itemCaixa');
    const itemComedouro = document.getElementById('itemComedouro');
    const itemFonte = document.getElementById('itemFonte');
    const tituloEquipamento = document.getElementById('tituloEquipamento');

    const soCaixaVal = soCaixaElem ? soCaixaElem.value : 'Nao';

    // Atualiza a lista de itens com base na escolha (Apenas Caixa vs Kit Completo)
    if (soCaixaVal === 'Sim') {
        if (tituloEquipamento) tituloEquipamento.innerText = 'Apenas Caixa de Areia PETKIT';

        if (itemCaixa) {
            itemCaixa.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Purobot Max Pro 2';
            itemCaixa.className = 'text-dark fw-medium';
        }
        if (itemComedouro) {
            itemComedouro.innerHTML = '<i class="fa-solid fa-xmark text-danger me-2"></i> <del class="text-muted">Comedouro Automático com Câmara</del>';
            itemComedouro.className = 'text-muted';
        }
        if (itemFonte) {
            itemFonte.innerHTML = '<i class="fa-solid fa-xmark text-danger me-2"></i> <del class="text-muted">Fonte de Água Inteligente</del>';
            itemFonte.className = 'text-muted';
        }
    } else {
        if (tituloEquipamento) tituloEquipamento.innerText = 'Kit PETKIT Completo';

        if (itemCaixa) {
            itemCaixa.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Purobot Max Pro 2';
            itemCaixa.className = 'text-dark';
        }
        if (itemComedouro) {
            itemComedouro.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Comedouro Automático com Câmara';
            itemComedouro.className = 'text-dark';
        }
        if (itemFonte) {
            itemFonte.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Fonte de Água Inteligente';
            itemFonte.className = 'text-dark';
        }
    }

    // Atualização dos valores e descontos
    const valorFormatado = valorFinal.toFixed(2).replace('.', ',') + ' €';
    
    if (valorTotalSpan) valorTotalSpan.innerText = valorFormatado;
    if (detalhesCalculo) detalhesCalculo.innerText = texto + (temDesconto ? ' [Desc. 10%]' : '');

    if (temDesconto && valorOriginalSpan) {
        valorOriginalSpan.innerText = valorBase.toFixed(2).replace('.', ',') + ' €';
        valorOriginalSpan.classList.remove('d-none');
    } else if (valorOriginalSpan) {
        valorOriginalSpan.classList.add('d-none');
    }

    // Atualiza o campo oculto do formulário
    if (valorTotalInput) {
        valorTotalInput.value = `${valorFormatado} (${numDias} dias)`;
    }
}
/**
 * Envia os dados para o Cloudflare Worker para criar uma sessão de pagamento no Stripe
 */
async function pagarComStripe(event) {
    if (event) event.preventDefault();

    const nome = document.getElementById("nome")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const telefone = document.getElementById("telefone")?.value.trim() || "";
    const dataEntrega = document.getElementById("dataEntrega")?.value || document.getElementById("data")?.value || "";
    const dataDevolucao = document.getElementById("dataDevolucao")?.value || "";
    const periodo = document.getElementById("periodo")?.value || "";
    const localidade = document.getElementById("localidade")?.value.trim() || "";
    const mensagem = document.getElementById("mensagem")?.value.trim() || "";
    const reservaNum = document.getElementById("numReservaInput")?.value || "REF-" + Math.floor(1000 + Math.random() * 9000);
    const tipoEquipamento = document.getElementById("tituloEquipamento")?.innerText || "Kit PETKIT Completo";
    
    // Obter o valor total em cêntimos (exemplo: extrair do span ou input)
    const valorTotalSpan = document.getElementById('valorTotal')?.innerText || "0";
    const valorNumerico = parseFloat(valorTotalSpan.replace(' €', '').replace(',', '.')) || 0;
    const valorCentimos = Math.round(valorNumerico * 100);

    if (!nome || !email || !telefone) {
        alert("Por favor, preencha o Nome, E-mail e Telemóvel para prosseguir com o pagamento.");
        return;
    }

    if (valorCentimos <= 0) {
        alert("O valor da reserva não é válido.");
        return;
    }

    const dadosReserva = {
        valorCentimos: valorCentimos,
        reservaNum: reservaNum,
        nomeCliente: nome,
        emailCliente: email,
        telefoneCliente: telefone,
        dias: dataDevolucao ? `${dataEntrega} até ${dataDevolucao}` : (periodo || dataEntrega),
        localidade: localidade,
        mensagem: mensagem,
        tipoEquipamento: tipoEquipamento
    };

    try {
        const resposta = await fetch('https://blue-bread-52b1.miautechpt.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosReserva)
        });

        const resultado = await resposta.json();

        if (resultado.url) {
            window.location.href = resultado.url; // Redireciona para o Checkout do Stripe
        } else {
            throw new Error(resultado.error || 'Erro ao iniciar o pagamento.');
        }
    } catch (erro) {
        console.error('Erro:', erro);
        alert('Ocorreu um erro ao ligar ao sistema de pagamento. Tente novamente.');
    }
}