const scan = (config) => {
    // Scan for closest dammage structure
    return config.toRepair.filter(
        (x) => {
            return x.hits < config.building.turret.structureMaxHits;
        }
    )[0];
};

const scanSpecial = (config) => {
    // Scan for closest dammage structure
    const filtred = config.toRepair.filter(
        (x) => {
            return x.hits < 14000000;
        }
    );
    
    // To try to not target the same object
    return filtred[1] || filtred[0];
};

const tower = {
    _run: (turrets, structure, config) => {
        for (let turret of turrets) {
            if (config.toKill.length !== 0) {
                turret.attack(turret.pos.findClosestByRange(config.toKill));
            } else {
                
                // No hostile, then repair
                if (!structure) {
                    structure = scan(config);
                }
                
                if(structure) {
                    turret.repair(structure);
                }
            }
        }
    },
    
    run: (config) => {
        const turrets = config.turret.map(x => Game.getObjectById(x));
        
        tower._run(turrets, null, config);
    },
    
    specialMission: (config) => {
        const turrets = config.turret_special.map(x => Game.getObjectById(x));
        const specialTargets = config.turret_special_targets.map(x => Game.getObjectById(x));

        for (const specialTarget of specialTargets) {
            if (specialTarget.hits < specialTarget.hitsMax) {
                tower._run(turrets, specialTarget, config);
                return;
            }
        }
        
        tower._run(turrets, scanSpecial(config), config);
    }
}

module.exports = tower;