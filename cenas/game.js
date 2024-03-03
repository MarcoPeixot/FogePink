// Importando e exportando a classe do Phaser como um módulo padrão
export default class Game extends Phaser.Scene {
    // Construtor da classe Game, que estende Phaser.Scene
    constructor() {
        // Chamando o construtor da classe pai e definindo a chave da cena
        super({
            key: "game"
        });
    }

    // Função de pré-carregamento, onde são carregados os recursos necessários
    preload() {
        // Carregando imagens e tilemap usando a API de carregamento do Phaser
        this.load.image('background', './assets/Green.png');
        this.load.image('chao', './assets/Terrain(16x16).png');
        this.load.image('objetos', './assets/Objects.png');
        this.load.image('espinhos', './assets/Idle.png');
        this.load.tilemapTiledJSON('mapa1', './assets/map_jogo.json');

        // Carregando spritesheets para animações do personagem e morango
        this.load.spritesheet('idle', './assets/personagem/Idle (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('run', './assets/personagem/Run (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('jump', './assets/personagem/Jump (32x32).png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('fall', './assets/personagem/Fall (32x32).png', { frameWidth: 32, frameHeight: 32 });

        this.load.spritesheet('morango', './assets/Strawberry.png', { frameWidth: 32, frameHeight: 32 });
    }

    // Função de criação, onde os elementos do jogo são inicializados
    create() {
        // Adicionando um efeito de fade-in na câmera
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        // Chamando funções para criar o mapa, personagem, câmera, e morango
        this.criarMapa();
        this.criarPersonagem();
        this.configurarCamera();
        this.criarMorango();

        // Inicializando a pontuação e exibindo o texto da pontuação
        this.pontuacao = 0;
        this.pontuacaoTexto = this.add.text(160, 160, 'Pontuação: ' + this.pontuacao, { fontSize: '24px', fill: '#fff' });
    }

    // Função para criar o mapa do jogo
    criarMapa() {
        // Criando o mapa usando o tilemap carregado
        this.map = this.make.tilemap({ key: 'mapa1' });
        // Adicionando tilesets para diferentes camadas do mapa
        this.tilesetBackground = this.map.addTilesetImage('background', 'background');
        this.tilesetChao = this.map.addTilesetImage('terreno', 'chao');
        this.tilesetObject = this.map.addTilesetImage('Objects', 'objetos');
        this.tilesetTrap = this.map.addTilesetImage('espinho', 'espinhos');

        // Criando camadas do mapa com base nos tilesets
        this.background = this.map.createLayer('fundo', this.tilesetBackground, 0, 0);
        this.chao = this.map.createLayer('chao', this.tilesetChao, 0, 0);
        this.espinho = this.map.createLayer('espinho', this.tilesetTrap, 0, 0);
        this.objetos = this.map.createLayer('saida', this.tilesetObject, 0, 0);

        // Configurando colisões para camadas específicas
        this.chao.setCollisionByProperty({ collider: true });
        this.espinho.setCollisionByProperty({ collider: true });
    }

    // Função para criar o personagem controlado pelo jogador
    criarPersonagem() {
        // Configurando teclas de seta como controles do personagem
        this.cursor = this.input.keyboard.createCursorKeys();

        // Encontrando o ponto de spawn do personagem no mapa
        const spawnPoint = this.map.findObject(
            "player",
            (objects) => objects.name === "spawning point"
        );

        // Criando o sprite do personagem, definindo sua posição inicial e tamanho
        this.pink = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'idle');
        this.pink.setSize(10);

        // Configurando colisões do personagem com o chão
        this.physics.add.collider(this.pink, this.chao);
        this.pink.setCollideWorldBounds(true);

        // Criando animações para o personagem
        this.anims.create({
            key: 'parado',
            frames: this.anims.generateFrameNumbers('idle', { start: 0, end: 10 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('run', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('jump'),
            frameRate: 10,
            repeat: 0
        });

        this.anims.create({
            key: 'fall',
            frames: this.anims.generateFrameNumbers('fall'),
            frameRate: 10,
            repeat: 0
        });
    }

    // Função para criar o morango que o jogador deve coletar
    criarMorango() {
        // Encontrando o ponto de spawn do morango no mapa
        const spawnPointMorango = this.map.findObject(
            "morango",
            (objects) => objects.name === "spawning morango"
        );

        // Criando o sprite do morango e configurando colisões com o chão
        this.morango = this.physics.add.sprite(spawnPointMorango.x, spawnPointMorango.y, 'morango');
        this.physics.add.collider(this.morango, this.chao);

        // Criando animações para o morango
        this.anims.create({
            key: 'morango_idle',
            frames: this.anims.generateFrameNumbers('morango', { start: 0, end: 16 }),
            frameRate: 20,
            repeat: -1
        });

        this.morango.anims.play('morango_idle', true);
    }

    // Função para configurar a câmera do jogo
    configurarCamera() {
        // Definindo os limites da câmera com base nas dimensões do mapa
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true, true, true, true);
        // Iniciando o acompanhamento da câmera pelo personagem
        this.cameras.main.startFollow(this.pink, true, 0.05, 0.05);
        // Ajustando o zoom da câmera
        this.cameras.main.setZoom(1.5);
    }

    // Função chamada a cada quadro (frame) para atualizar o estado do jogo
    update() {
        // Resetando a velocidade horizontal do personagem
        this.pink.setVelocityX(0);
        // Atualizando a posição do texto de pontuação
        this.pontuacaoTexto.x = this.pink.body.x - 20;
        this.pontuacaoTexto.y = this.pink.body.y - 40;

        // Verificando se o personagem está no chão e ajustando a animação
        if (this.pink.body.onFloor()) {
            this.pulando = false;
            this.pink.anims.play('parado', true);
        }

        // Verificando se a tecla de seta para cima está pressionada e permitindo o pulo
        if (this.cursor.up.isDown && !this.pulando) {
            this.pink.setVelocityY(-310);
            this.pulando = true;
            this.pink.anims.play('jump', true);
        }

        // Ajustando a animação durante a queda
        if (this.pink.body.velocity.y > 0 && this.pulando) {
            this.pink.anims.play('fall', true);
        }

        // Movimentando o personagem para a direita
        if (this.cursor.right.isDown) {
            this.pink.setFlipX(false);
            this.pink.setVelocityX(100);
            if (!this.pulando) {
                this.pink.anims.play('run', true);
            }
        }

        // Movimentando o personagem para a esquerda
        if (this.cursor.left.isDown) {
            this.pink.setFlipX(true);
            this.pink.setVelocityX(-100);
            if (!this.pulando) {
                this.pink.anims.play('run', true);
            }
        }

        // Verificando se o personagem alcançou o objeto de saída no mapa
        if (this.objetos.hasTileAtWorldXY(this.pink.body.x, this.pink.body.y) && this.pontuacao === 1) {
            console.log("foi");
            this.voltarMenu();
        }

        // Verificando se houve sobreposição (overlap) entre o personagem e o morango
        if (this.physics.overlap(this.pink, this.morango)) {
            this.coletarMorango();
        }

        // Verificando colisões entre o personagem e os espinhos
        this.physics.world.collide(this.pink, this.espinho, this.colisaoEspinhas, null, this);
    }

    // Função chamada quando há colisão com os espinhos
    colisaoEspinhas() {
        alert("Você perdeu! Reinicie o jogo...");
        this.scene.restart();
    }

    // Função para retornar ao menu ao vencer o jogo
    voltarMenu() {
        alert("Você ganhou! Voltando para o menu");
        this.scene.start('menu');
    }

    // Função para coletar o morango
    coletarMorango() {
        this.morango.destroy();
        this.pontuacao += 1;
        this.pontuacaoTexto.setText('Pontuação: ' + this.pontuacao);
    }
}
