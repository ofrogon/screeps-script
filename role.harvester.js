const roleBuilder = require('role.builder');

const roleHarvester = {
    findDepot: (creep, config) => {
        const toFill = [].concat(config.toFillSpawn, config.toFillExtension);
        
        if (toFill.length === 0) {
            return null;
        } else {
            return creep.pos.findClosestByRange(toFill);
        }
    },

    run: (creep, config) => {
        if (!creep.memory.empty && creep.carry.energy === 0) {
            creep.memory.empty = true;
        } else if (creep.memory.empty && creep.carry.energy === creep.carryCapacity) {
            creep.memory.empty = false;
        }

        if(creep.memory.empty) {
            let source;// = Game.getObjectById(config.storage);
            
            if (config.harvesterSource) {
                source = Game.getObjectById(config.harvesterSource);
            }
            
            if (!source || config.level < 3 || source.energy === 0) {
                source = Game.getObjectById(config.sources[0]);
                if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                if(creep.withdraw(source, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        } else {
            let depot;

            // Validate the depot
            if (creep.memory.depotId) {
                // Has a depot in memory
                depot = Game.getObjectById(creep.memory.depotId);
                if (depot && depot.energy === depot.energyCapacity) {
                    // Depot full, find new one
                    depot = roleHarvester.findDepot(creep, config);
                }
            } else {
                depot = roleHarvester.findDepot(creep, config);
            }
            
            if (depot && creep.transfer(depot, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.memory.depotId = depot.id;
                creep.moveTo(depot);
            } else {
                if (!depot && config.storage) {
                    let storage = Game.getObjectById(config.storage);
                    if (creep.transfer(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage);
                    }
                } else {
                    // No more depot... be a builder!
                    roleBuilder.run(creep, config);
                }
            }
        }
    }
};

module.exports = roleHarvester;
