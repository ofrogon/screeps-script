const roleHarvester = require('role.harvester');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleRepair = require('role.repair');
const roleDrill = require('role.drill');
const roleTruck = require('role.truck');
const roleOverseer = require('role.overseer');
const roleExplorer = require('role.explorer');
const roleHelper = require('role.helper');

const config = require('config');
const truckConfig = require('config.truck');

module.exports = {
    cleanMemory: function() {
        for(const name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },
    creepSpawner: function(config) {
        // TODO add the others
        if (config.spawners.length === 0)
            return;
        
        // Builder
        if(config.constructionSites.length > 0 && config.builders.length < config.screepsConfig.builder.number) {
            const newName = `Builder_${config.name}_${Game.time}`;
            console.log('Spawning new builder: ' + newName);
            config.spawners[0].spawnCreep(config.screepsConfig.builder.bodyParts, newName, {memory: {role: 'builder'}});
        }
        
        // Drills
        if (config.drillActivate) {
            if(config.drillPosition._1 && config.drill_1.length === 0) {
                const newName = `Drill-1_${config.name}_${Game.time}`;
                console.log('Spawning new drill: ' + newName);
                config.spawners[0].spawnCreep(roleDrill.config, newName, {memory: {role: 'drill_1', x:config.drillPosition._1.x, y:config.drillPosition._1.y, sourceId: config.drillSourceEnergy[0], containerId: config.drillDepotEnergy[0]}});
            }
            if(config.drillPosition._2 && config.drill_2.length === 0 && config.drillSourceEnergy.length === 2) {
                const newName = `Drill-2_${config.name}_${Game.time}`;
                console.log('Spawning new drill: ' + newName);
                config.spawners[0].spawnCreep(roleDrill.config, newName, {memory: {role: 'drill_2', x:config.drillPosition._2.x, y:config.drillPosition._2.y, sourceId: config.drillSourceEnergy[1], containerId: config.drillDepotEnergy[1]}});
            }
            if(config.drillPosition._3 && config.drill_3.length === 0 && config.level > 5 && config.drillSourceMineralExtractor && config.drillSourceMineralActivate) {
                const newName = `Drill-3_${config.name}_${Game.time}`;
                console.log('Spawning new drill: ' + newName);
                config.spawners[0].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'drill_3', x:config.drillPosition._3.x, y:config.drillPosition._3.y, sourceId: 'c20e6164daf6d5a', containerId: '5a403afc4dc13c0a5619a4df'}});
            }
        }
        
        // Harvester
        if(config.harvesters.length < config.screepsConfig.harvester.number && config.name != 'W2N5') {
            const newName = `Harvester_${config.name}_${Game.time}`;
            console.log('Spawning new harvester: ' + newName);
            config.spawners[0].spawnCreep(config.screepsConfig.harvester.bodyParts, newName, {memory: {role: 'harvester'}});
        }
        
        // Overseer
        if(config.overseer.length < config.screepsConfig.overseer.number) {
            const newName = `Overseer_${config.name}_${Game.time}`;
            console.log('Spawning new overseer: ' + newName);
            config.spawners[0].spawnCreep(config.screepsConfig.overseer.bodyParts, newName, {memory: {role: 'overseer'}});
        }
        
        // Upgrader
        if(config.upgraders.length < config.screepsConfig.upgrader.number) {
            const newName = `Upgrader_${config.name}_${Game.time}`;
            console.log('Spawning new upgrader: ' + newName);
            config.spawners[0].spawnCreep(config.screepsConfig.upgrader.bodyParts, newName, {memory: {role: 'upgrader'}});
        }
    },
    creepRepartitor: function(config) {
        for(const creep of config.creeps) {
            switch(creep.memory.role) {
                case 'harvester':
                    roleHarvester.run(creep, config);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep, config);
                    break;
                case 'drill_1':
                case 'drill_2':
                case 'drill_3':
                    roleDrill.run(creep, config);
                    break;
                case 'overseer':
                    roleOverseer.run(creep, config);
                    break;
                case 'builder':
                    roleBuilder.run(creep, config);
                    break;
            }
        }
    },
    creepRepartitorGlobal: function() {
        for(const name in Game.creeps) {
            const creep = Game.creeps[name];
            
            switch(creep.memory.role) {
                case 'explorer':
                    roleExplorer.run(creep);
                    break;
                case 'helper':
                    roleHelper.run(creep);
                    break;
            }
        }
    },
    trucking: function() {
        for(const name in truckConfig) {
            const creep = Game.creeps[name];
            const TC = truckConfig[name];
            
            if (!creep) {
                Game.getObjectById(TC.spawnerId).spawnCreep(
                    TC.bodyParts, 
                    name, 
                    {
                        memory: {
                            role: 'truck', 
                            sourceId: TC.inId, 
                            containerId: TC.outId, 
                            minTTL: TC.minTTL, 
                            canHelp: TC.canHelp, 
                            resource: TC.resource, 
                            reverse: TC.reverse
                        }
                    });
            } else {
                roleTruck.run(creep, TC.resource);
            }
        }
    }
};