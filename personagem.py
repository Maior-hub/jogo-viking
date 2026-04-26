class Personagem:
    def __init__(self, nome):
        self.nome = nome
        self.atk = 1
        self.defesa = 1
        self.acerto = 1
        self.esquiva = 1
        self.hp = 10
        self.arma = None

    def vivo(self):
        return self.hp > 0