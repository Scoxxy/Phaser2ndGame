var config = { //Налаштовуємо сцену
    type: Phaser.AUTO,
    worldWidth: 9600,
    height: 1080,
    pixelArt: true,
    physics: { //Налаштовуємо фізику
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var stars;
var player;
var platform;
var score = 0;
var scoreText;
var worldWidth = config.width * 2;

var record = 0

function preload () //Завантажуємо графіку для гри
{
    this.load.image('platform', 'assets/platform.png');
    this.load.image('ground', 'assets/moon.png');
    this.load.image('sky', 'assets/sky.png');
    this.load.image('cheese', 'assets/cheese.png');
    this.load.spritesheet('dude', 
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 32 }
    );
    this.load.spritesheet('dudeleft', 
        'assets/dudeleft.png',
        { frameWidth: 32, frameHeight: 32 }
    );
}

function create ()
{

    //Додаемо небо


    for (var x = 0; x < worldWidth; x = x + 400){
        console.log(x)
        platforms.create(x, 1000, 'sky').setOrigin(0, 0).refreshBody();
    }

    for (var x = 0; x < worldWidth; x = x + 400){
        console.log(x)
        platforms.create(x, 1000, 'ground').setOrigin(0, 0).refreshBody();
    }
    this.add.image(960, 540, 'sky').setScale(1);

    //Створюемо текст з рахунком
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    //Ініціалізуємо курсор Phaser
    cursors = this.input.keyboard.createCursorKeys();

    //Створюемо фізичну групу платформ
    platforms = this.physics.add.staticGroup();

    //Створюемо платформи
    platforms.create(955, 1000, 'ground').refreshBody().setScale(1);

    //Створюємо та налаштовуємо спрайт гравця
    player = this.physics.add.sprite(800, 0, 'dude').setScale(2);    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    //Налаштування камери
    this.cameras.main.setBounds(0, 0, worldWidth, window.innerHeight);
    this.physics.world.setBounds(0, 0, worldWidth, window.innerHeight);

    //Слідкування камери за гравцем
    this.cameras.main.startFollow(player)

    //Створюемо та налаштовуємо фізичний об'єкт бомби
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, null, this);

    //Змінено гравітацію гравця
    player.body.setGravityY(0)


    //Створюємо та налаштовуємо анімації
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dudeleft', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //Додано колізії між гравцем та платформами
    this.physics.add.collider(player, platforms);

       // Створюємо та налаштовуємо групу зірок
       stars = this.physics.add.group({
        key: 'cheese', // Змінено ключ на 'cheese'
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    // Додаємо колізії між зірками та платформами
    this.physics.add.collider(stars, platforms);

    // Додаємо функцію збору зірок
    this.physics.add.overlap(player, stars, collectStar, null, this);

}
this.physics.add.overlap(player, stars, collectStar, null, this);

function collectStar (player, star) {
    star.disableBody(true, true); // Вимикаємо фізику для зірки, яку зібрав гравець

    // Збільшуємо рахунок
    score += 10;
    scoreText.setText('Score: ' + score);
}

function update ()
{
    //Керування персонажем
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
}