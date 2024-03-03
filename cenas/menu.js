// Importando e exportando a classe do Phaser como um módulo padrão
export default class Menu extends Phaser.Scene {
    // Construtor da classe Menu, que estende Phaser.Scene
    constructor() {
        // Chamando o construtor da classe pai e definindo a chave da cena
        super({
            key: 'menu'
        });
    }

    // Função de pré-carregamento, onde são carregados os recursos necessários
    preload() {
        // Carregando imagens para o menu
        this.load.image('menu', './assets/menu.png');
        this.load.image('botao', './assets/Play.png');
        this.load.image('teclas', './assets/teclas.png');
    }

    // Função de criação, onde os elementos do menu são inicializados
    create() {
        // Adicionando imagens de fundo do menu e teclas
        this.add.image(0, 0, 'menu').setOrigin(0);
        this.add.image(700, 140, 'teclas').setScale(0.5);

        // Criando um array de palavras para exibir
        const palavras = ['Desenvolvido', 'por', 'Marco', 'Ruas'];

        // Criando e exibindo texto com base no array de palavras
        for (let i = 0; i < palavras.length; i++) {
            const nomeText = this.add.text(50, 100 + i * 30, palavras[i], { fontFamily: 'Roboto', fontSize: '15px', fill: '#000000' });
        }

        // Adicionando informações de controles e título do jogo
        this.add.text(630, 200, 'A movimentação do personagem \né feita pelas setas do teclado.',
            { fontFamily: 'Roboto', fontSize: '15px', fill: '#000000' });

        this.add.text(440, 100, 'Foge Pink',
            { fontFamily: 'Roboto', fontSize: '30px', fill: '#000000' });

        // Criando o botão Play e configurando interatividade
        this.botaoPlay = this.add.image(500, 200, 'botao').setScale(1.4 * 2);
        this.botaoPlay.setInteractive();

        // Configurando eventos de interação do botão Play
        this.botaoPlay.on('pointerover', () => {
            this.botaoPlay.setScale(3);
        });

        this.botaoPlay.on('pointerout', () => {
            this.botaoPlay.setScale(1.4 * 2);
        });

        // Iniciando a cena do jogo quando o botão Play é pressionado
        this.botaoPlay.on('pointerup', () => this.scene.start('game'));
    }
}
