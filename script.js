/* =========================
   NAVEGAÇÃO ENTRE TELAS
========================= */
function openScreen(id) {
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    document.getElementById(id).classList.add("active");
}

/* =========================
   PLAYER
========================= */
let player = {
    baseAtk: 1,
    baseDef: 1,
    baseAcc: 1,
    baseEva: 1,

    weapon: null,
    helmet: null,
    chest: null,
    legs: null,
    boots: null
};

let items = [];

/* =========================
   SISTEMA DE LOOT
========================= */
function randomRarity() {
    let r = Math.random();

    if (r < 0.5) return "Comum";
    if (r < 0.75) return "Raro";
    if (r < 0.9) return "Épico";

    return "Lendário";
}

function dropItem() {
    let tipos = [
        {
            name: "Espada",
            icon: "🗡️",
            slot: "weapon",
            atributo: "atk"
        },
        {
            name: "Capacete",
            icon: "🪖",
            slot: "helmet",
            atributo: "def"
        },
        {
            name: "Peitoral",
            icon: "🛡️",
            slot: "chest",
            atributo: "def"
        },
        {
            name: "Calça",
            icon: "👖",
            slot: "legs",
            atributo: "eva"
        },
        {
            name: "Botas",
            icon: "👢",
            slot: "boots",
            atributo: "acc"
        }
    ];

    let base = tipos[Math.floor(Math.random() * tipos.length)];

    let item = {
        name: base.name,
        icon: base.icon,
        slot: base.slot,
        raridade: "Comum"
    };

    // adiciona atributo baseado no tipo
    item[base.atributo] = Math.floor(Math.random() * 3) + 1;

    items.push(item);
    renderInventory();
}

/* =========================
   INVENTÁRIO
========================= */
function renderInventory() {
    let inv = document.getElementById("inventory");
    inv.innerHTML = "";

    items.forEach(item => {
        let div = document.createElement("div");

        div.innerText = item.icon;

        // clique direito = equipar
        div.oncontextmenu = (e) => {
            e.preventDefault();
            equip(item);
        };

        // tooltip
        div.onmouseover = (e) => showTooltip(e, item);
        div.onmousemove = moveTooltip;
        div.onmouseout = hideTooltip;

        inv.appendChild(div);
    });
}

/* =========================
   EQUIPAR / DESEQUIPAR
========================= */
function equip(item) {
    let slotId = item.slot;

    // se já existe item equipado nesse slot, devolve ao inventário
    if (player[slotId]) {
        items.push(player[slotId]);
    }

    // equipa novo item
    player[slotId] = item;

    let slot = document.getElementById(slotId);
    slot.innerText = item.icon;
    slot.classList.add("equipped");

    // remove do inventário
    items = items.filter(i => i !== item);

    renderInventory();
    updateStats();
}

function unequip(slot) {
    if (player[slot]) {
        items.push(player[slot]);
    }

    player[slot] = null;

    let icons = {
        weapon: "🗡️",
        helmet: "🪖",
        chest: "🛡️",
        legs: "👖",
        boots: "👢"
    };

    let el = document.getElementById(slot);
    el.innerText = icons[slot];
    el.classList.remove("equipped");

    renderInventory();
    updateStats();
}

/* =========================
   STATS
========================= */
function updateStats() {
    let atk = player.baseAtk;
    let def = player.baseDef;
    let acc = player.baseAcc;
    let eva = player.baseEva;

    let equips = [
        player.weapon,
        player.helmet,
        player.chest,
        player.legs,
        player.boots
    ];

    equips.forEach(item => {
        if (!item) return;

        if (item.atk) atk += item.atk;
        if (item.def) def += item.def;
        if (item.acc) acc += item.acc;
        if (item.eva) eva += item.eva;
    });

    // tela personagem
    document.getElementById("atk").innerText = atk;

    // combate
    combatPlayer.atk = atk;
    combatPlayer.def = def;
    combatPlayer.acc = acc;
    combatPlayer.eva = eva;

    // tela masmorra
    document.getElementById("p_atk").innerText = atk;
    document.getElementById("p_def").innerText = def;
    document.getElementById("p_acc").innerText = acc;
    document.getElementById("p_eva").innerText = eva;
}

/* =========================
   TOOLTIP
========================= */
function showTooltip(e, item) {
    let tooltip = document.getElementById("tooltip");

    let stats = "";

    if (item.atk) stats += `ATK: ${item.atk}<br>`;
    if (item.def) stats += `DEF: ${item.def}<br>`;
    if (item.acc) stats += `ACC: ${item.acc}<br>`;
    if (item.eva) stats += `EVA: ${item.eva}<br>`;

    tooltip.innerHTML = `
        <b>${item.name}</b><br>
        ${stats}
        Raridade: ${item.raridade}
    `;

    tooltip.style.display = "block";
    moveTooltip(e);
}

function moveTooltip(e) {
    let tooltip = document.getElementById("tooltip");

    tooltip.style.left = (e.pageX + 10) + "px";
    tooltip.style.top = (e.pageY + 10) + "px";
}

function hideTooltip() {
    document.getElementById("tooltip").style.display = "none";
}

/* =========================
   COMBATE - PLAYER
========================= */
let combatPlayer = {
    hp: 10,
    maxHp: 10,
    atk: 1,
    def: 1,
    acc: 1,
    eva: 1
};

/* =========================
   COMBATE - ENEMY
========================= */
let enemy = {
    name: "Inimigo",
    boss: false,
    hp: 10,
    maxHp: 10,
    atk: 1,
    def: 1,
    acc: 1,
    eva: 1
};

/* =========================
   DADO
========================= */
function d6() {
    return Math.floor(Math.random() * 6) + 1;
}

/* =========================
   UPDATE UI COMBATE
========================= */
function updateCombatUI() {
    // player
    document.getElementById("p_hp").innerText = combatPlayer.hp;
    document.getElementById("p_atk").innerText = combatPlayer.atk;
    document.getElementById("p_def").innerText = combatPlayer.def;
    document.getElementById("p_acc").innerText = combatPlayer.acc;
    document.getElementById("p_eva").innerText = combatPlayer.eva;

    // enemy
    document.getElementById("e_hp").innerText = enemy.hp;
    document.getElementById("e_atk").innerText = enemy.atk;
    document.getElementById("e_def").innerText = enemy.def;
    document.getElementById("e_acc").innerText = enemy.acc;
    document.getElementById("e_eva").innerText = enemy.eva;

    let enemyName = document.getElementById("enemy_name");
    enemyName.innerText = "👹 " + enemy.name;
    enemyName.style.color = enemy.boss ? "red" : "white";

    // barras de vida
    let pPerc = (combatPlayer.hp / combatPlayer.maxHp) * 100;
    let ePerc = (enemy.hp / enemy.maxHp) * 100;

    document.getElementById("p_hpbar").style.width = pPerc + "%";
    document.getElementById("e_hpbar").style.width = ePerc + "%";
}

/* =========================
   ANIMAÇÃO DADO
========================= */
function animarDado() {
    let dice = document.getElementById("dice");
    let i = 0;

    let interval = setInterval(() => {
        dice.innerText = "🎲 " + d6() + " | 🎲 " + d6();

        i++;

        if (i > 10) {
            clearInterval(interval);
        }
    }, 50);
}

/* =========================
   TURNO DE COMBATE
========================= */
function turno() {
    if (combatPlayer.hp <= 0 || enemy.hp <= 0) {
        document.getElementById("log").innerText =
            "⚠️ Luta acabou! Clique em Nova Luta.";
        return;
    }

    animarDado();

    setTimeout(() => {
        let log = "🧍 Você ataca!\n";

        let pBox = document.getElementById("player_box");
        pBox.classList.add("attack");

        setTimeout(() => {
            pBox.classList.remove("attack");
        }, 200);

        /* PLAYER ATACA */
        let atk_total =
            combatPlayer.atk +
            (player.weapon ? player.weapon.atk : 0) +
            d6();

        let acc_total = combatPlayer.acc + d6();
        let def_total = enemy.def + d6();
        let eva_total = enemy.eva + d6();

        log += `🎯 ACC ${acc_total} vs EVA ${eva_total}\n`;
        log += `🎲 ATK ${atk_total} vs DEF ${def_total}\n`;

        if (acc_total < eva_total) {
            log += "❌ Errou!\n";
        } else {
            if (atk_total <= def_total) {
                log += "🛡️ Bloqueado!\n";
            } else {
                let dmg = atk_total - def_total;
                enemy.hp -= dmg;
                if (enemy.hp < 0) enemy.hp = 0;

                log += `💢 Dano ${dmg}\n`;
            }
        }

        /* INIMIGO MORREU */
        if (enemy.hp <= 0) {
            log += "\n🏆 Você venceu!\n";

            if (Math.random() < 0.7) {
                dropItem();
                log += "🎁 Dropou item!";
            } else {
                log += "❌ Sem drop";
            }

            document.getElementById("log").innerText = log;
            updateCombatUI();
            return;
        }

        /* INIMIGO ATACA */
        let eBox = document.getElementById("enemy_box");
        eBox.classList.add("attack-enemy");

        setTimeout(() => {
            eBox.classList.remove("attack-enemy");
        }, 200);

        log += "\n👹 Inimigo ataca!\n";

        atk_total = enemy.atk + d6();
        acc_total = enemy.acc + d6();
        def_total = combatPlayer.def + d6();
        eva_total = combatPlayer.eva + d6();

        log += `🎯 ACC ${acc_total} vs EVA ${eva_total}\n`;
        log += `🎲 ATK ${atk_total} vs DEF ${def_total}\n`;

        if (acc_total < eva_total) {
            log += "❌ Inimigo errou!\n";
        } else {
            if (atk_total <= def_total) {
                log += "🛡️ Você bloqueou!\n";
            } else {
                let dmg = atk_total - def_total;
                combatPlayer.hp -= dmg;

                if (combatPlayer.hp < 0) {
                    combatPlayer.hp = 0;
                }

                log += `💢 Você tomou ${dmg}\n`;
            }
        }

        if (combatPlayer.hp <= 0) {
            log += "\n💀 Você morreu!";
        }

        document.getElementById("log").innerText = log;
        updateCombatUI();

    }, 600);
}

/* =========================
   RESET COMBATE
========================= */
function resetCombat() {
    combatPlayer.hp = combatPlayer.maxHp;

    let inimigos = [
        {
            name: "Goblin",
            boss: false,
            hp: 8,
            atk: 1,
            def: 1,
            acc: 1,
            eva: 1
        },
        {
            name: "Esqueleto",
            boss: false,
            hp: 10,
            atk: 2,
            def: 2,
            acc: 2,
            eva: 2
        },
        {
            name: "Lobo",
            boss: false,
            hp: 10,
            atk: 3,
            def: 2,
            acc: 3,
            eva: 2
        },
        {
            name: "Viking Sombrio",
            boss: true,
            hp: 20,
            atk: 4,
            def: 3,
            acc: 3,
            eva: 3
        }
    ];

    let escolhido =
        inimigos[Math.floor(Math.random() * inimigos.length)];

    enemy = {
        name: escolhido.name,
        boss: escolhido.boss,
        hp: escolhido.hp,
        maxHp: escolhido.hp,
        atk: escolhido.atk,
        def: escolhido.def,
        acc: escolhido.acc,
        eva: escolhido.eva
    };

    document.getElementById("log").innerText = "Nova luta!";
    updateCombatUI();
}

/* =========================
   LOAD INICIAL
========================= */
window.onload = () => {
    let slots = [
        "weapon",
        "helmet",
        "chest",
        "legs",
        "boots"
    ];

    slots.forEach(slot => {
        document.getElementById(slot).oncontextmenu = (e) => {
            e.preventDefault();
            unequip(slot);
        };
    });

    updateStats();
    resetCombat();
}
/* =========================
   Ferreiro - craft 
========================= */

function craftIncomum() {
    let comuns = items.filter(item =>
        item.name === "Espada" &&
        item.raridade === "Comum"
    );

    let log = document.getElementById("smith_log");

    if (comuns.length < 5) {
        log.innerText = "❌ Você precisa de 5 Espadas Comuns.";
        return;
    }

    // remove 5 comuns
    let removidos = 0;

    items = items.filter(item => {
        if (
            item.name === "Espada" &&
            item.raridade === "Comum" &&
            removidos < 5
        ) {
            removidos++;
            return false;
        }

        return true;
    });

    // cria espada incomum
    let novaArma = {
        name: "Espada Incomum",
        icon: "🗡️",
        atk: 3,
        raridade: "Incomum",
        slot: "weapon"
    };

    items.push(novaArma);

    renderInventory();

    log.innerText =
        "✨ Você forjou uma Espada Incomum!";
}