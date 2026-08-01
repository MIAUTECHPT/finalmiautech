// ======================================
// MIAUTECHPT V4 - JavaScript Principal
// ======================================

/**
 * Função para capturar os dados do formulário de contactos
 * e redirecionar para a conversa do WhatsApp formatada.
 */
function enviarWhatsApp() {
    // Captura os valores de forma segura (fallback para string vazia)
    const nome = document.getElementById("nome")?.value.trim() || "";
    const email = document.getElementById("email")?.value.trim() || "";
    const telefone = document.getElementById("telefone")?.value.trim() || "";
    const data = document.getElementById("data")?.value || "";
    const periodo = document.getElementById("periodo")?.value || "";
    const localidade = document.getElementById("localidade")?.value.trim() || "";
    const mensagem = document.getElementById("mensagem")?.value.trim() || "";

    // Validação básica dos campos obrigatórios
    if (!nome || !telefone) {
        alert("Por favor, preencha pelo menos o seu Nome e Telemóvel antes de enviar por WhatsApp.");
        return;
    }

    // Formatação da mensagem
    const texto = 
`Olá MiautechPT! 🐱

Gostaria de reservar o Pack PETKIT.

👤 Nome: ${nome}
📧 Email: ${email}
📞 Telemóvel: ${telefone}
📅 Data pretendida: ${data}
⏳ Período: ${periodo}
📍 Localidade: ${localidade}

📝 Observações:
${mensagem || "Nenhuma"}`;

    // Abertura do link do WhatsApp numa nova página
    const url = `https://wa.me/351918642824?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
}

/**
 * Animação de entrada (Fade In / Scroll Reveal)
 * Garante que só executa quando o HTML estiver totalmente carregado.
 */
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.1 // Ativa a animação quando 10% do elemento estiver visível
    });

    // Observa todos os elementos com a classe .fade-up
    document.querySelectorAll(".fade-up").forEach((el) => {
        observer.observe(el);
    });
});
function partilharSite() {
    if (navigator.share) {
        navigator.share({
            title: 'MiautechPT - Aluguer de Tecnologia para Gatos',
            text: 'Vá de férias descansado! Alugue o Pack PETKIT e monitorize o seu gato.',
            url: window.location.href
        })
        .then(() => console.log('Partilhado com sucesso!'))
        .catch((error) => console.log('Erro ao partilhar:', error));
    } else {
        // Caso esteja num computador sem suporte nativo a partilha, copia o link para a área de transferência
        navigator.clipboard.writeText(window.location.href);
        alert('Link do site copiado para a área de transferência!');
    }
}
function atualizarEcra(valorFinal, numDias, valorBase, temDesconto, texto) {
    const valorTotalSpan = document.getElementById('valorTotal');
    const valorOriginalSpan = document.getElementById('valorOriginal');
    const detalhesCalculo = document.getElementById('detalhesCalculo');
    const soCaixaVal = document.getElementById('soCaixa').value;

    const itemCaixa = document.getElementById('itemCaixa');
    const itemComedouro = document.getElementById('itemComedouro');
    const itemFonte = document.getElementById('itemFonte');
    const tituloEquipamento = document.getElementById('tituloEquipamento');

    // Se selecionou "Sim" (Apenas Caixa de Areia)
    if (soCaixaVal === 'Sim') {
        tituloEquipamento.innerText = 'Apenas Caixa de Areia PETKIT';

        // Caixa de Areia (Incluído)
        itemCaixa.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Purobot Max Pro 2';
        itemCaixa.className = 'text-dark fw-medium';

        // Comedouro (Não Incluído - tira o certo verde)
        itemComedouro.innerHTML = '<i class="fa-solid fa-xmark text-danger me-2"></i> <del class="text-muted">Comedouro Automático com Câmara</del>';
        itemComedouro.className = 'text-muted';

        // Fonte (Não Incluído - tira o certo verde)
        itemFonte.innerHTML = '<i class="fa-solid fa-xmark text-danger me-2"></i> <del class="text-muted">Fonte de Água Inteligente</del>';
        itemFonte.className = 'text-muted';

    } else {
        // Se selecionou "Não" (Kit Completo)
        tituloEquipamento.innerText = 'Kit PETKIT Completo';

        itemCaixa.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Purobot Max Pro 2';
        itemCaixa.className = 'text-dark';

        itemComedouro.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Comedouro Automático com Câmara';
        itemComedouro.className = 'text-dark';

        itemFonte.innerHTML = '<i class="fa-solid fa-check text-success me-2"></i> Fonte de Água Inteligente';
        itemFonte.className = 'text-dark';
    }

    // Atualização de preços
    valorTotalSpan.innerText = valorFinal.toFixed(2).replace('.', ',') + ' €';
    detalhesCalculo.innerText = texto + (temDesconto ? ' [Desc. 10%]' : '');

    if (temDesconto) {
        valorOriginalSpan.innerText = valorBase.toFixed(2).replace('.', ',') + ' €';
        valorOriginalSpan.classList.remove('d-none');
    } else {
        valorOriginalSpan.classList.add('d-none');
    }

    document.getElementById('valorTotalInput').value = valorFinal.toFixed(2).replace('.', ',') + ' € (' + numDias + ' dias)';
}