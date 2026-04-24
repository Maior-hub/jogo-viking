import random

# ---------- CONFIG BASE ----------
DADO_MIN = 1
DADO_MAX = 6

# ---------- FUNÇÕES DE DADO ----------
def rolar_d6(min_val=DADO_MIN, max_val=DADO_MAX):
    return random.randint(min_val, max_val)

def rolar_2d3():
    return random.randint(1, 3) + random.randint(1, 3)

# ---------- CLASSE PERSONAGEM ----------
class Personagem:
    def __init__(self, nome):
        self.nome = nome
        self.atk = 1
        self.defesa = 1
        self.acerto = 1
        self.esquiva = 1
        self.hp = 10

        # atributos extras (base futura)
        self.crit_chance = 0.0
        self.reroll = 0
        self.dado_min = 1
        self.dado_max = 6

    def vivo(self):
        return self.hp > 0

# ---------- ATAQUE ----------
def atacar(atacante, defensor):
    print(f"\n?? {atacante.nome} ataca {defensor.nome}")

    # rolagens
    atk_dado = rolar_d6(atacante.dado_min, atacante.dado_max)
    acc_dado = rolar_d6(atacante.dado_min, atacante.dado_max)

    def_dado = rolar_d6(defensor.dado_min, defensor.dado_max)
    eva_dado = rolar_d6(defensor.dado_min, defensor.dado_max)

    # totais
    atk_total = atacante.atk + atk_dado
    acc_total = atacante.acerto + acc_dado

    def_total = defensor.defesa + def_dado
    eva_total = defensor.esquiva + eva_dado

    print(f"{atacante.nome} ? ATK {atk_total} (d{atk_dado}) | ACC {acc_total} (d{acc_dado})")
    print(f"{defensor.nome} ? DEF {def_total} (d{def_dado}) | EVA {eva_total} (d{eva_dado})")

    # checagem de acerto
    if acc_total < eva_total:
        print("? Ataque ERROU!")
        return

    print("? Ataque ACERTOU!")

    # dano
    dano = atk_total - def_total

    if dano <= 0:
        dano = 1  # dano mínimo

    # crítico
    if random.random() < atacante.crit_chance:
        bonus = dano * 0.5
        dano += bonus
        print(f"?? CRÍTICO! +{bonus:.1f}")

    defensor.hp -= int(dano)

    print(f"?? Dano causado: {int(dano)}")
    print(f"?? HP de {defensor.nome}: {defensor.hp}")

# ---------- COMBATE ----------
def combate(jogador, monstro):
    turno = 1

    while jogador.vivo() and monstro.vivo():
        print(f"\n--- TURNO {turno} ---")

        atacar(jogador, monstro)
        if monstro.vivo():
            atacar(monstro, jogador)

        turno += 1

    print("\n?? FIM DO COMBATE")
    if jogador.vivo():
        print("?? Jogador venceu!")
    else:
        print("?? Monstro venceu!")

# ---------- EXECUÇÃO ----------
if __name__ == "__main__":
    jogador = Personagem("Jogador")
    monstro = Personagem("Monstro")

    combate(jogador, monstro)