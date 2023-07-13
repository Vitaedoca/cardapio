$(document).ready(function() {
    cardapio.events.init();
})

let cardapio = {};


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

        $("#itensCardapio").html('');


        $.each(filtro, (i, e) => {

            event.preventDefault();

            // console.log(e.name)
            // replace = substitui uma string por outra sem mudar a original
            // replace(valorPadrão, substituicao)
            let temp = cardapio.templates.item.replace(/\${img}/g, e.img)
            .replace(/\${name}/g, e.name)
            // toFixed(20) Fixa o número de casas descimais que desejar
            .replace(/\${price}/g, e.price.toFixed(2).replace('.', ','))

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
}

cardapio.templates = {
    item: `
        <div class="col-3">
            <div class="card card-item mb-5">
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
                    <span class="btn-menos"><i class="fas fa-minus"></i></span>
                    <span class="add-numero-itens">0</span>
                    <span class="btn-mais"><i class="fas fa-plus"></i></span>
                    <span class="btn btn-add"><i class="fa fa-shopping-bag"></i></span>
                </div>
            </div>
        </div>
    `
}