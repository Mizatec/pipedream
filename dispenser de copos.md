# Instituto paulo souza


## Fatec dr Ary fossem

#### *Trabalho de Sistemas Embarcado*

_____________________________________________

1. Descricriçaõ do projeto
> **_Dispenser de copos descartaveis automatico com sensor._**

 >É um equipamento que você pode retirar copos descartaveis apenas movimentado de sua mão em direção ao dispenser e ele solta um copo.
 >É um projeto penssado em não ter contato direto com o dispenser devido a pandemia esse produto seria muito eficiente por não possuir esse contato.
 >Ele se baseia em você com apenas um movimento ter disponivel um copo pra você tomar agua ou até mesmo tomar um café.
 * Lista de materiais
+ Itens
> Um sesor Ultrasonico,
> Um dispenser de copos manual,
> Um arduino,
> Uma fonte de 5V e
> Um motor de passos
-

 **Codigo de funcionamento**

>Codigo pro Arduino
```#include <Stepper.h>

//Inclui a biblioteca que contém as funções do motor de passo
#include <AccelStepper.h>
//Conversão de graus para steps:
//360° = 1024 
//180° = 512
//90° = 256
//60° = 170
//45° = 128
//30° = 85
//15° = 28
#define N_STEPS 1024


int echoPino = 12;
int trigPino = 13;
long duracao = 0;
long distancia = 0;
#define active 10
bool movimenta = false; 
// Cria objeto SteperMotor indicando o numero de voltas e os pinos de controle 
AccelStepper StepperMotor (AccelStepper::FULL4WIRE, 8, 10, 9, 11); 
void setup()
{  
  Serial.begin (9600);
  pinMode (echoPino , INPUT);
  pinMode (trigPino , OUTPUT);
    // Configura a velocidade máxima em passos por segundo
  StepperMotor.setMaxSpeed(2000);
  // Configura a aceleração do motor
  StepperMotor.setAcceleration(200);
  
  // Define o movimento do motor
  StepperMotor.moveTo(N_STEPS);
}
void loop()
{
  {
    if (!movimenta) {
    digitalWrite (trigPino, LOW);
    delayMicroseconds(10);  
    digitalWrite (trigPino, HIGH);
    delayMicroseconds(10);  
    digitalWrite (trigPino, LOW);
    duracao = pulseIn (echoPino, HIGH);
  distancia = duracao /58;
Serial.print("Distancia em cm:");
  Serial.println(distancia);
    if(distancia < active)
  {
    movimenta = true;
  }
  }

  if (movimenta)  {
  // Verifica se ainda existem passos a serem dados
  if (StepperMotor.distanceToGo() == 0){
    // Executa o comando par dar uma volta no sentido contrário e parar no mesmo ponto.
    delay(10);
     movimenta = false;
    StepperMotor.moveTo(-StepperMotor.currentPosition());
   
  }
  // Habilita as portas de controle do arduino para movimentar o motor
  StepperMotor.run();
  }
  else
    delay(50);
  }
  }

