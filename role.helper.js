module.exports = {
    run: (creep) => {
        if (creep.room.name === 'W2N5') {
            creep.memory.x = 0;
            creep.memory.y = 31;
        } else {
            // Build the spawn
            if (!creep.memory.empty && creep.carry.energy === 0) {
                creep.memory.empty = true;
            } else if (creep.memory.empty && creep.carry.energy === creep.carryCapacity) {
                creep.memory.empty = false;
            }
            
            if(creep.memory.empty) {
                let source = Game.getObjectById('b25207741a44ada');
                if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                // Upgrader
                /*
                if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
                return;//*/
                
                // Build
                let toBuild = creep.pos.findClosestByRange(creep.room.find(FIND_CONSTRUCTION_SITES));
                
                if (toBuild) {
                    if(creep.build(toBuild) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(toBuild);
                    };
                } else {
                    // Harvest
                    let source = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                                    structure.energy < structure.energyCapacity;
                            }
                        }));
                    if(creep.transfer(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(source);
                    }
                }
            }
            
            return;
        }
        
        if (creep.pos.x === creep.memory.x && creep.pos.y === creep.memory.y) {
            if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        } else {
            creep.moveTo(creep.memory.x, creep.memory.y);
        }
    },
    config: [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
};