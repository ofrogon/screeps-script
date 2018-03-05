const roleUpgrader = require('role.upgrader');

const roleScientist = {
    findDepot: (creep) => {
        return creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType === STRUCTURE_LAB &&
                    structure.energy < structure.energyCapacity);
            }
        }));
    },

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.trucking && creep.carry.energy === 0) {
            creep.memory.trucking = false;
        } else if(!creep.memory.trucking && creep.carry.energy == creep.carryCapacity) {
            creep.memory.trucking = true;
        }

        if(creep.memory.trucking || creep.ticksToLive < 16) {
            let storageOut = roleScientist.findDepot(creep);
            if (storageOut) {
                if(creep.transfer(storageOut, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storageOut);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
        else {
            let storageIn = Game.getObjectById(creep.memory.sourceId);

            if(creep.withdraw(storageIn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storageIn);
            }
        }
    },
    
    config: [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE]
};

module.exports = roleScientist;