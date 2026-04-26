# -*- coding: utf-8 -*-

import random

def rolar_d6():
    return random.randint(1, 6)

def rolar_2d3():
    return random.randint(1, 3) + random.randint(1, 3)

class Arma:
    def __init__(self, nome, tipo_dado):
        self.nome = nome
        self.tipo_dado = tipo_dado

    def rolar_dano(self):
        if self.tipo_dado == "1d6":
            return rolar_d6()
        elif self.tipo_dado == "2d3":
            return rolar_2d3()