async function reservarPorMbway() {
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const entrega = document.getElementById('dataEntrega').value;
            const devolucao = document.getElementById('dataDevolucao').value;
            const localidade = document.getElementById('localidade').value;
            const tipoEquipamento = document.getElementById('tituloEquipamento').innerText;
            const valorTexto = document.getElementById('valorTotal').innerText;
            const observacoes = document.getElementById('mensagem').value;

            if (!nome || !email || !telefone || !entrega || !devolucao || !localidade) {
                alert('Por favor, preencha o Nome, Email, Telemóvel, Localidade e Datas antes de prosseguir.');
                return;
            }

            if (!valorTexto || valorTexto.includes('--')) {
                alert('Por favor, selecione datas válidas para calcular o total.');
                return;
            }

            const btnMbway = document.getElementById('btnMbway');
            btnMbway.disabled = true;
            btnMbway.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> A registar reserva...';

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: 'f0c8056b-8868-4d22-a0c8-16fe7182a7e1',
                        subject: `Confirmação de Reserva - ${numeroReservaGlobal} (MiauTech)`,
                        // Define o email do cliente como destinatário de resposta/cópia suportado pelo Web3Forms
                        replyto: email,
                        email: email, // Garante que o Web3Forms reconhece o email introduzido pelo cliente
                        'Número de Reserva': numeroReservaGlobal,
                        'Nome do Cliente': nome,
                        'Email': email,
                        'Telemóvel': telefone,
                        'Data de Entrega': entrega,
                        'Data de Devolução': devolucao,
                        'Localidade': localidade,
                        'Equipamento': tipoEquipamento,
                        'Valor Total': valorTexto,
                        'Observações': observacoes || 'Nenhuma',
                        'Mensagem para o Cliente': `Olá ${nome},\n\nA sua reserva (${numeroReservaGlobal}) foi registada com sucesso! Iremos entrar em contacto consigo muito em breve para proceder aos detalhes do pagamento por MB WAY e agendamento da entrega.\n\nObrigado por escolher a MiauTech!`
                    })
                });

                const result = await response.json();

                if (result.success) {
                    alert('Reserva registada com sucesso! Enviámos os detalhes para o seu email e entraremos em contacto em breve.');
                    window.location.href = 'sucesso.html?reserva=' + encodeURIComponent(numeroReservaGlobal);
                } else {
                    throw new Error(result.message || 'Erro ao enviar formulário.');
                }

            } catch (error) {
                console.error("Erro no MB WAY:", error);
                alert("Ocorreu um erro ao registar a reserva. Tente novamente.");
                btnMbway.disabled = false;
                btnMbway.innerHTML = '<i class="fa-solid fa-check-circle me-2"></i> Concluir Reserva <br /> Após pagamento efetuado por MB WAY';
            }
        }