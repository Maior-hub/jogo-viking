from personagem import Personagem
from arma import Arma
from combate import atacar

jogador = Personagem("Jogador")
monstro = Personagem("Monstro")

espada = Arma("Espada", "1d6")
machado = Arma("Machado", "2d3")

jogador.arma = espada
monstro.arma = machado

while jogador.vivo() and monstro.vivo():
    atacar(jogador, monstro)
    if monstro.vivo():
        atacar(monstro, jogador)

print("Fim da luta")