import random

def rolar_d6(min_val=1, max_val=6):
    return random.randint(min_val, max_val)

def rolar_2d3():
    return random.randint(1, 3) + random.randint(1, 3)

def atacar(atacante, defensor):
    print(f"\n⚔️ {atacante.nome} ataca {defensor.nome}")

    if atacante.arma:
        print(f"🗡️ {atacante.arma.nome}")

    atk_dado = atacante.arma.rolar_dano() if atacante.arma else rolar_d6()
    acc_dado = rolar_d6()

    def_dado = rolar_d6()
    eva_dado = rolar_d6()

    atk_total = atacante.atk + atk_dado
    acc_total = atacante.acerto + acc_dado

    def_total = defensor.defesa + def_dado
    eva_total = defensor.esquiva + eva_dado

    if acc_total < eva_total:
        print("❌ ERROU")
        return

    if atk_total <= def_total:
        print("🛡️ BLOQUEADO")
        return

    dano = atk_total - def_total
    defensor.hp -= dano

    print(f"💢 Dano: {dano} | HP: {defensor.hp}")