const roleBuilder = require('role.builder');

const roleRepair = {
    findConstructionSite: function(creep, config) {
        return creep.pos.findClosestByRange(config.toRepair.filter(
            (x) => {
                return x.hits < 30000000;
            }
        ));
    },

    run: function(creep, config) {
        if (!creep.memory.empty && creep.carry.energy === 0) {
            creep.memory.empty = true;
        } else if (creep.memory.empty && creep.carry.energy === creep.carryCapacity) {
            creep.memory.empty = false;
        }

        if(creep.memory.empty) {
            let source = Game.getObjectById(config.storage);

            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        } else {
            let constructionSite;

            // Validate the constructionSite
            if (creep.memory.constructionSiteId) {
                // Has a constructionSite in memory
                constructionSite = Game.getObjectById(creep.memory.constructionSiteId);
                if (!constructionSite || constructionSite.progress === constructionSite.progressTotal) {
                    // constructionSite completed, find new one
                    constructionSite = roleRepair.findConstructionSite(creep, config);
                }
            } else {
                constructionSite = roleRepair.findConstructionSite(creep, config);
            }
            
            if (constructionSite && creep.repair(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.memory.constructionSiteId = constructionSite.id;
                creep.moveTo(constructionSite);
            } else if (!constructionSite) {
                roleBuilder.run(creep);
            }
        }
    }
};

module.exports = roleRepair;
