const roleUpgrader = require('role.upgrader');

const roleBuilder = {
    findConstructionSite: (creep, config) => {
        //const toBuild = config.constructionSites;
        const toBuild = creep.room.find(FIND_CONSTRUCTION_SITES)
        
        if (toBuild.length === 0) {
            return null;
        } else {
            return creep.pos.findClosestByRange(toBuild);
        }
    },

    run: (creep, config) => {
        if (!creep.memory.empty && creep.carry.energy === 0) {
            creep.memory.empty = true;
        } else if (creep.memory.empty && creep.carry.energy === creep.carryCapacity) {
            creep.memory.empty = false;
        }

        if(creep.memory.empty) {
            let source;
            
            if (config.storage) {
                source = Game.getObjectById(config.builderSource || config.storage);
            } else {
                source = Game.getObjectById(config.sources[0]);
            }
            
            if (creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            } else {
                if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        } else {
            let constructionSite;

            // Validate the constructionSite
            if (creep.memory.constructionSiteId) {
                // Has a constructionSite in memory
                constructionSite = Game.getObjectById(creep.memory.constructionSiteId);
                if (!constructionSite || constructionSite.progress === constructionSite.progressTotal) {
                    // constructionSite completed, find new one
                    constructionSite = roleBuilder.findConstructionSite(creep, config);
                }
            } else {
                constructionSite = roleBuilder.findConstructionSite(creep, config);
            }
            
            if (constructionSite && creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                creep.memory.constructionSiteId = constructionSite.id;
                creep.moveTo(constructionSite);
            } else if (!constructionSite) {
                roleUpgrader.run(creep, config);
            }
        }
    }
};

module.exports = roleBuilder;
