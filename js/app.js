$(document).ready(function() {
    cardapio.events.init();
})

let cardapio = {};

let MEU_CARRINHO = [];
let MEU_ENDERECO = null;

let VALOR_CARRINHO = 0;
let VALOR_ENTREGA = 5;


cardapio.events = {

    init: () => {
        cardapio.metodos.obterItensCardapio();
    }

}

cardapio.metodos = {


    // obtem a lista de itens do cardapio
    obterItensCardapio: (categoria = 'burgers', vermais = false) => {
        
        let filtro = MENU[categoria];
        console.log(filtro);

        if(!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass("hidden");
        }


        $.each(filtro, (i, e) => {

            // console.log(e.name)
            // replace = substitui uma string por outra sem mudar a original
            // replace(valorPadrão, substituicao)
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            // toFixed(20) Fixa o número de casas descimais que desejar
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${id}/g, e.id)

            // Botão ver mais foi clicado (12 itens)
            if(vermais && i >= 8 && i < 12) {
                $("#itensCardapio").append(temp);
            }

            // Paginação incial (8 itens)
            if(!vermais && i < 8) {
                $("#itensCardapio").append(temp);
            }


        })


        // remove o ativo
        $(".container-menu a").removeClass('active');

        // seta o menu para ativo
        $("#menu-" + categoria).addClass('active');
    },

    // Clique no botão de ver mais
    verMais: () => {

        var ativo = $(".container-menu a.active").attr("id").split("menu-")[1];
        console.log(ativo)

        cardapio.metodos.obterItensCardapio(ativo, true);

        $("#btnVerMais").addClass("hidden");
    },

    // Diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text())
        
        if(qntdAtual > 0) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },
    // Aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {
        let qntdAtual = parseInt($("#qntd-" + id).text())
        $("#qntd-" + id).text(qntdAtual + 1)
    },

    // Adicionar ao carrinho o item do cardapio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 0) {

            // obter a categoria ativa
            var categoria = $(".container-menu a.active").attr('id').split('menu-')[1];

            // obtem a lista de itens
            let filtro = MENU[categoria];

            // obtem o item
            let item = $.grep(filtro, (e, i) => { return e.id == id });

            if (item.length > 0) {

                // validar se já existe esse item no carrinho
                let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.id == id });

                // caso já exista o item no carrinho, só altera a quantidade
                if (existe.length > 0) {
                    let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));
                    MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                }
                // caso ainda não exista o item no carrinho, adiciona ele 
                else {
                    item[0].qntd = qntdAtual;
                    MEU_CARRINHO.push(item[0])
                }      
                
                cardapio.metodos.mensagem('Item adicionado ao carrinho', "green")
                $("#qntd-" + id).text(0);

                cardapio.metodos.atualizarBadgeTotal();
            }

        }
    },
    // Atualiza o bodge totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {
        
        let total = 0;

        // Verifica a quantidade que está no carrinho
        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd;
        })
        
        // Só vai mostrar as quantidades e os botões, quando o carrinho for > 0
        if(total > 0) {
            $(".botao-carrinho").removeClass("hidden");
            $(".container-total-carrinho").removeClass("hidden");
        }else {
            $(".botao-carrinho").addClass("hidden");
            $(".container-total-carrinho").addClass("hidden");
        }
        //enserindo dentro do meu html do meu badge o valord do meu carrinho
        $(".badge-total-carrinho").html(total)
    },
    // Abrir o modal do carrinho
    abrirCarrinho: (abrir) => {
        if(abrir) {
            $("#modalCarrinho").removeClass("hidden");
            cardapio.metodos.carregarCarrinho();
        }else{
            $("#modalCarrinho").addClass("hidden");
        }
        // cardapio.metodos.carregarEtapa();
    },
    // Altera os texto e exibe osbotões das etapas
    carregarEtapa: (etapa) => {
        if(etapa == 1) {
            $("#lblTituloEtap").text(" Seu carrinho: ");
            $("#itensCarrinho").removeClass("hidden");
            $("#localEntrega").addClass("hidden");
            $("#resumoCarrinho").addClass("hidden");

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");

            $("#btnEtapaPedido").removeClass("hidden");
            $("#btnEtapaEndereco").addClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnEtapaVoltar").addClass("hidden");
        }

        if(etapa == 2) {
            $("#lblTituloEtap").text(" Endereço de entrega: ");
            $("#itensCarrinho").addClass("hidden");
            $("#localEntrega").removeClass("hidden");
            $("#resumoCarrinho").addClass("hidden");

            $(".etapa").removeClass("active");
            $(".etapa1").addClass("active");
            $(".etapa2").addClass("active");

            $("#btnEtapaPedido").addClass("hidden");
            $("#btnEtapaEndereco").removeClass("hidden");
            $("#btnEtapaResumo").addClass("hidden");
            $("#btnEtapaVoltar").removeClass("hidden");
        }

        if(etapa == 3) {
            $("#lblTituloEtapa").text('Resumo do pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');
            cardapio.metodos.buscarCep()
        }
    },
    // Botão de voltar etapa
    voltarEtapa: () => {
        let etapa = $(".etapa.active").length;
        console.log(etapa)
        cardapio.metodos.carregarEtapa(etapa - 1)
    },
    // Carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);
        if(MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html("")


            $.each(MEU_CARRINHO, (i, e) => {

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${name}/g, e.name)
                .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${qntd}/g, e.qntd)

                $("#itensCarrinho").append(temp);


                // último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }                            

            })


        }else {
            $("#itensCarrinho").html(
                '<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i>Seu carrinho está vazio.</p>'
                )
                cardapio.metodos.carregarValores();
        }

    },
    // Diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text())

        if(qntdAtual > 1) {
            $("#qntd-carrinho-" + id).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(id, qntdAtual - 1);
        }else {
            cardapio.metodos.removerItemCarrinho(id);
        }

    
        
    },
    // Aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (id) => {
        
        let qntdAtual = parseInt($("#qntd-carrinho-" + id).text())
        $("#qntd-carrinho-" + id).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(id, qntdAtual + 1);

    },
    // botão remover item do carrinho
    removerItemCarrinho: (id) => {
        
        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return e.id != id})
        cardapio.metodos.carregarCarrinho();
        // Atualizar o badge atual
        cardapio.metodos.atualizarBadgeTotal();

    },

    atualizarCarrinho: (id, qntd) => {

        // index do elemento que vamos diminuir
        let objIndex = MEU_CARRINHO.findIndex((obj => obj.id == id));

        // Pega a quantidade anterior e coloca a quantidade atual que eu quero
        MEU_CARRINHO[objIndex].qntd = qntd;

        //atualiza o botão carrinho
        cardapio.metodos.atualizarBadgeTotal();
        //atualiza os valores em reais totais do carrinho
        cardapio.metodos.carregarValores();

    },
    // Carrega os valores de subTotal, entrega, total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        
        $("#lblSubTotal").text("R$ 0,00");
        $("#lblValorEntrega").text("+ R$ 2,00");
        $("#lblValorTotal").text("R$ 0,00");
        
        // console.log($("#lblSubTotal").text());

        $.each(MEU_CARRINHO, (i, e ) => {
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);


            if(i + 1 == MEU_CARRINHO.length) {
                $("#lblSubTotal").text(`R$ ${VALOR_CARRINHO.toFixed(2).replace(".", ",")}`);
                $("#lblValorEntrega").text(`+ R$ ${VALOR_ENTREGA.toFixed(2).replace(".", ",")}`);
                $("#lblValorTotal").text(`R$ ${(VALOR_CARRINHO + VALOR_ENTREGA).toFixed(2).replace(".", ",")}`);
            } 
        })


    },
    // Carregar a etapa endereços
    carregarEndereco: () => {

        if(MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem("Seu carrinho está vazio.");
            return;
        }

        cardapio.metodos.carregarEtapa(2)
    },
    // API via cep
    buscarCep: () => {

        // .val() Pega os valores de um input
        // .trim() tira os espaços em branco
        // .replace(/\D/g, '') Tira os caracteres diferentes dos números
        var cep = $("#txtCEP").val().trim().replace(/\D/g, '');

        // verifica se o CEP possui valor informado
        if (cep != "") {

            // Expressão regular para validar o CEP
            var validacep = /^[0-9]{8}$/;

            if (validacep.test(cep)) {

                $.getJSON(`https://viacep.com.br/ws/${cep}/json/?callback=?`, (dados) => {
                    

                    if(!("erro" in dados)) {

                        // Atualizar os campos com os valores retornados
                        $("#txtEndereco").val(dados.logradouro);
                        $("#txtBairro").val(dados.bairro);
                        $("#txtCidade").val(dados.localidade);
                        $("#ddlUf").val(dados.uf);
                        $("#txtNumero").focus();
                        // console.log(dados.uf); 
                        
                    }else {

                        cardapio.metodos.mensagem("CEP não encontrato. Preencha as informações manualmente.");
                        $("#txtEndereco").focus();
                    }

                });

            }else {
                cardapio.metodos.mensagem("Formato do CEP inválido");
                $("#txtCEP").focus();
            }

        }else {
            cardapio.metodos.mensagem("Informe o CEP, por favor.");
            $("#txtCEP").focus();
        }

    },
    // Validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        // .val() Pega o valor.
        // .trim() Tira os espaços.
        let cep = $("#txtCEP").val().trim();
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();
        let cidade = $("#txtCidade").val().trim();
        let uf = $("#ddlUf").val();
        console.log(uf);
        let numero = $("#txtNumero").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        if (cep.length <= 0) {
            cardapio.metodos.mensagem('Informe o CEP, por favor.');
            $("#txtCEP").focus();
            return;
        }

        if (endereco.length <= 0) {
            cardapio.metodos.mensagem('Informe o Endereço, por favor.');
            $("#txtEndereco").focus();
            return;
        }

        if (bairro.length <= 0) {
            cardapio.metodos.mensagem('Informe o Bairro, por favor.');
            $("#txtBairro").focus();
            return;
        }

        if (cidade.length <= 0) {
            cardapio.metodos.mensagem('Informe a Cidade, por favor.');
            $("#txtCidade").focus();
            return;
        }

        if (uf == "-1") {
            cardapio.metodos.mensagem('Informe a UF, por favor.');
            $("#ddlUf").focus();
            return;
        }

        if (numero.length <= 0) {
            cardapio.metodos.mensagem('Informe o Número, por favor.');
            $("#txtNumero").focus();
            return;
        }

        MEU_ENDERECO = {
            cep: cep,
            endereco: endereco,
            bairro: bairro,
            cidade: cidade,
            uf: uf,
            numero: numero,
            complemento: complemento
        }

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();
        
    },

    carregarResumo: () => {

        $("#listaItensResumo").html("");

        $.each(MEU_CARRINHO, (i, e) => {
            
            let temp = cardapio.templates.itemResumo
            .replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))
            .replace(/\${qntd}/g, e.qntd)

            $("#listaItensResumo").append(temp);

        })

        $("#resumoEndereco").html(`${MEU_ENDERECO.endereco}, ${MEU_ENDERECO.numero}, ${MEU_ENDERECO.bairro} `)
        $("#cidadeEndereco").html(`${MEU_ENDERECO.cidade}-${MEU_ENDERECO.uf}/${MEU_ENDERECO.cep} ${MEU_ENDERECO.complemento}`)

    },
    // Envia o pedido pelo whatsapp
    finalizarPedido: () => {

    },

    // Mensagens
    mensagem: (texto, cor = "red", tempo = 3500) => {

        // Cria um número aleatorio para cada mensagem
        let id = Math.floor(Date.now() * Math.random()).toString()

        let msg = `<div id="msg-${id}" class="animated fadeInDown tost ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg)

        // Remove o elemeto html com o id específico
        setTimeout(() => {
            $("#msg-" + id).removeClass("FadeInDown");
            $("#msg-" + id).addClass("fadeOutUp");
            //Vai dar o tempo para a animação acontecer 
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    }

}

cardapio.templates = {
    item: `
        <div class="col-3">
            <div class="card card-item mb-5" id="\${id}">
                <div class="img-produto">
                    <img src="\${img}" alt="">
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${name}</b>
                </p>
                <p class="price-produto text-center">
                    <b>R$ \${price}</b>
                </p>
                <div class="add-carrinho">
                    <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens" id="qntd-\${id}">0</span>
                    <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `,
    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}">
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${name}</b></p>
                <p class="price-produto"><b> \${price}</p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${id}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${id}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${id}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove" onclick="cardapio.metodos.removerItemCarrinho('\${id}')"><i class="fa fa-times"></i></span> 
            </div>
        </div>
    `,
    itemResumo: `
        <div class="col-12 item-carrinho resumo">

            <div class="img-produto-resumo">
                <img src="\${img}">
            </div>

            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${name}</b>
                </p>
                <p class="price-produto-resumo">
                    <b> \${price}</b>
                </p>
            </div>

            <p class="quantidade-produto-resumo" id="qntd-resumo-\${id}">
                x <b>\${qntd}</b>
            </p>

        </div>
    `
}