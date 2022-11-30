var trex, trex_correndo, trexcolide;
var solo, soloImg, soloInvisivel;
var nuvem, nuvemImg, nuvens;
var cacto, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6, cactus
var pontos = 0;
var JOGAR=1
var FIM=0
var estado=JOGAR
var game_over, game_overimg
var reiniciar, reiniciarimg
var som_pulo, som_r_i_p, som_checkpoint

function preload() {
  trex_correndo = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trexcolide = loadAnimation('trex_colidiu.png')
  soloImg = loadImage("solo2.png");
  nuvemImg = loadImage("nuvem.png");
  game_overimg = loadImage("fimDoJogo.png");
  reiniciarimg = loadImage("reiniciar.png");
  
  som_pulo=loadSound('pulo.mp3')
  som_r_i_p=loadSound('morte.mp3')
  som_checkpoint=loadSound('checkPoint.mp3')

  // carregar imagens dos obstaculos
  cacto1 = loadImage("obstaculo1.png");
  cacto2 = loadImage("obstaculo2.png");
  cacto3 = loadImage("obstaculo3.png");
  cacto4 = loadImage("obstaculo4.png");
  cacto5 = loadImage("obstaculo5.png");
  cacto6 = loadImage("obstaculo6.png");
}

function setup() {
  createCanvas(600, 200);

  //cria trex
  trex = createSprite(50, 100, 20, 50);
  trex.addAnimation("correndo", trex_correndo);
  trex.addAnimation("colisao", trexcolide);
  trex.scale = 0.5;
  trex.debug=false 
  trex.setCollider('circle',0,0,43)

  solo = createSprite(300, 170, 1200, 5);
  solo.addImage(soloImg);

  soloInvisivel = createSprite(300, 180, 1200, 5);
  soloInvisivel.visible = false;

  game_over = createSprite(300,80)
  game_over.addImage(game_overimg)
  game_over.scale = 0.5
  game_over.visible=false

  reiniciar = createSprite(300,120)
  reiniciar.addImage(reiniciarimg)
  reiniciar.scale = 0.5
  reiniciar.visible=false

cactus=createGroup()

nuvens=createGroup()

}

function draw() {
  background("white");

  text("Pontos: "+pontos,500,20);
 
  trex.collide(soloInvisivel);

  drawSprites();

  if (estado==JOGAR) {
    pontos = Math.round((pontos+(frameRate()/60)));

    if (pontos %100 === 0 && pontos > 0) {
      som_checkpoint.play()
    }

    //pulo
    if (keyDown("space") && trex.y > 153) {
      trex.velocityY = -15;
      som_pulo.play()
    }
  
    //gravidade
    trex.velocityY = trex.velocityY + 1;
    solo.velocityX = -(6+pontos*3/100);

    if (solo.x < 0) {
      solo.x = solo.width / 2;
    }
  
    //console.log(trex.y);
  
    //gerando nuvens e cactos
    gerarNuvens();
    gerarCactos();
    if (trex.isTouching(cactus)) {
      estado=FIM;
      som_r_i_p.play()
      //trex.velocityY = -15;
      //som_pulo.play()
    }
  } else if(estado==FIM) {
    trex.velocityY = 0;
    trex.changeAnimation("colisao")     
    solo.velocityX = 0;
    cactus.setVelocityXEach(0);
    cactus.setLifetimeEach(-1);
    nuvens.setVelocityXEach(0);
    nuvens.setLifetimeEach(-1);
    game_over.visible=true
    reiniciar.visible=true
    if (mousePressedOver(reiniciar)) {
      reinicie()
    }
  }
}

//definição da função de gerar nuvens
function gerarNuvens() {

  if (frameCount % 60 === 0) {
    nuvem = createSprite(630, 100, 40, 10);
    nuvens.add(nuvem)
    nuvem.y = Math.round(random(40, 120));
    nuvem.addImage(nuvemImg);
    nuvem.scale = 0.5;
    nuvem.velocityX = -3;
    nuvem.depth = trex.depth;
    trex.depth = trex.depth + 1;
    nuvem.lifetime = 220;
  }
}

function gerarCactos(){
  //criar sprite de obstáculo a cada 60 quadros
  if(frameCount %60 === 0){;
    cacto = createSprite(600,155,10,40);
    cacto.velocityX= -(6+pontos*3/100);
    cactus.add(cacto);
  
  //adicionar imagem ao obstaculo aleatoriamente
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: cacto.addImage(cacto1);
        	break;
      case 2: cacto.addImage(cacto2);
        	break;
   	  case 3: cacto.addImage(cacto3);
        	break;
      case 4: cacto.addImage(cacto4);
        	break;
      case 5: cacto.addImage(cacto5);
        	break;
      case 6: cacto.addImage(cacto6);
        	break;
      default: break;
    }
    //atribuir escala e tempo de vida aos obstáculos
    cacto.scale = 0.5;
    cacto.lifetime = 300;
  }
}

function reinicie() {

 estado= JOGAR
 cactus.destroyEach() 
 nuvens.destroyEach() 
 reiniciar.visible=false
 game_over.visible=false
 trex.changeAnimation("correndo", trex_correndo)
 pontos=0
}