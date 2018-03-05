//const roleUpgrader = require('role.upgrader');

const roleOverseer = {
    findDepot: (creep, config) => {
        let toFill;
        
        if (!toFill) {
            toFill = [].concat(config.toFillOthers, config.toFillTurret).filter(
                (x) => {
                    return x.energy < 800;
                }
            );
        }

        if (toFill.length === 0) {
            return null;
        } else {
            return creep.pos.findClosestByRange(toFill);
        }
    },
    
    /** @param {Creep} creep **/
    run: (creep, config) => {
        if (!creep.memory.empty && creep.carry.energy === 0) {
            creep.memory.empty = true;
        } else if (creep.memory.empty && creep.carry.energy === creep.carryCapacity) {
            creep.memory.empty = false;
        }

        if(creep.memory.empty) {
            let source = Game.getObjectById(config.storage);

            if(creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            let depot;

            // Validate the depot
            if (false && creep.memory.depotId) {
                // Has a depot in memory
                depot = Game.getObjectById(creep.memory.depotId);
                if (depot.energy === depot.energyCapacity) {
                    // Depot full, find new one
                    depot = roleOverseer.findDepot(creep, config);
                }
            } else {
                depot = roleOverseer.findDepot(creep, config);
            }
            
            if (depot && creep.transfer(depot, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.memory.depotId = depot.id;
                creep.moveTo(depot);
            } else if (!depot) {
                // No more depot... be a builder!
                //roleUpgrader.run(creep);
            }
        }
    },
    
    config: [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE]
};

module.exports = roleOverseer;