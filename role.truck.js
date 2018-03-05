const roleTruck = {
    findDepot: function(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                    structure.energy < structure.energyCapacity;
            }
        }));
    },
    
    findLab: function(creep) {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_LAB &&
                    structure.mineralAmount <= structure.mineralCapacity && structure.mineralAmount > 0);
            }
        }));
    },
    
    run: function(creep, resource) {
        if(creep.carry.energy === 0) {
            creep.memory.trucking = false;
        } else if(creep.carry.energy === creep.carryCapacity) {
            creep.memory.trucking = true;
        }

        if (resource) {
            let input, output;
            if (creep.memory.reverse) {
                I = creep.memory.containerId;
                O = creep.memory.sourceId;
            } else {
                I = creep.memory.sourceId;
                O = creep.memory.containerId;
            }
            
            if(creep.memory.trucking || creep.ticksToLive < creep.memory.minTTL) {
                let output;
                if (creep.memory.canHelp && creep.memory.resource === RESOURCE_ENERGY) {
                    output = roleTruck.findDepot(creep) || Game.getObjectById(O);
                } else if(creep.memory.canHelp) {
                    output = roleTruck.findSource2(creep) || Game.getObjectById(O);
                } else {
                    output = Game.getObjectById(O);
                }
                
                if(output && creep.transfer(output, creep.memory.resource) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(output);
                }
            } else {
                const input = Game.getObjectById(I);

                if(creep.withdraw(input, creep.memory.resource) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(input);
                }
            }
            
            return;
        }
    }
};

module.exports = roleTruck;