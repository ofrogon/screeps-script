const buildingTurret = require('building.turret');
const buildingLink = require('building.link');

const tools = require('tools');
const filters = require('tools.filters');
const config = require('config');

module.exports.loop = () => {
    tools.cleanMemory();
    
    for (room in Game.rooms) {
        // Ignore others room
        if (room === 'W1N4' || room === 'W2N5' || room === 'W1N5' || room === 'W3N5') {
            try {
                room = Game.rooms[room];
                
                // Setup
                const roomConfig = config.instanceNew(room);
                
                // Buildings
                buildingTurret.run(roomConfig);
                buildingTurret.specialMission(roomConfig);
                buildingLink.run(roomConfig);
                
                // Screeps
                tools.creepSpawner(roomConfig);
                tools.creepRepartitor(roomConfig);
            } catch(e) {
               console.error(e);
            }
        }
    }
    
    try {
        tools.trucking();
    } catch(e) {
        console.error(e);
    }
    
    // Game.rooms['W3N5'].terminal.send(RESOURCE_ENERGY, 100000, 'W2N5');
    
    // Helpers!
    /*const helpers = _.filter(Game.creeps, (creep) => creep.memory.role === 'helper');
    if(helpers.length < 2) {
        var newName = 'ChuckNorris_' + Game.time;
        Game.spawns['Home2'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], newName, {memory: {role: 'helper', x: 10, y: 49}});
    }*/

    tools.creepRepartitorGlobal();
}