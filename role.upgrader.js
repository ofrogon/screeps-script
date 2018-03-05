module.exports = {
    run: (creep, config) => {
        if(creep.memory.upgrading && creep.carry.energy === 0) {
            creep.memory.upgrading = false;
        } else if(!creep.memory.upgrading && creep.carry.energy === creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            let sourceObj = Game.getObjectById(config.upgradersSource);
            
            if(creep.withdraw(sourceObj, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceObj);
            } else if(creep.harvest(sourceObj) === ERR_NOT_IN_RANGE) {
                creep.moveTo(sourceObj);
            }
        }
    }
};