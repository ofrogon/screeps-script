const roleDrill = {
    drill: (creep, config, element) => {
        let sourceObj = Game.getObjectById(creep.memory.sourceId);
        
        if (creep.carry[element] === creep.carryCapacity || sourceObj.energy === 0 || creep.ticksToLive < 2) {
            // Creep full, must empty
            creep.transfer(Game.getObjectById(creep.memory.containerId), RESOURCE_ENERGY);
            return;
        }
        
        creep.harvest(sourceObj);
    },
    
    findDepot: (creep, config) => {
        return creep.pos.findClosestByRange(config.structures.filter(
            (x) => {
                return x.structureType === STRUCTURE_LAB && x.mineralAmount < x.mineralCapacity;
            }
        ));
    },
    
    mineral_drill: (creep, config) => {
        const sourceObj = Game.getObjectById(creep.memory.sourceId);
        const extractor = Game.getObjectById(config.drillSourceMineralExtractor);

        if (extractor.cooldown === 0) {
            creep.harvest(sourceObj);
        } else {
            creep.transfer(roleDrill.findDepot(creep, config), RESOURCE_HYDROGEN);
        }
    },
    
    run: (creep, config) => {
        // If Mineral
        if (creep.memory.sourceId === config.drillSourceMineral) {
            if (creep.pos.x === creep.memory.x && creep.pos.y === creep.memory.y) {
                roleDrill.mineral_drill(creep, config, config.drillSourceMineralType);
            } else {
                creep.moveTo(creep.memory.x, creep.memory.y);
            }
            return;
        }
        
        // Energy
        if (creep.pos.x === creep.memory.x && creep.pos.y === creep.memory.y) {
            roleDrill.drill(creep, config, RESOURCE_ENERGY);
        } else {
            creep.moveTo(creep.memory.x, creep.memory.y);
        }
    },
    
    config: [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE]
}

module.exports = roleDrill;