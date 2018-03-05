const values = require('config.values');
const MH = require('memoryHelper');
const filters = require('tools.filters');

const W2N5 = require('config.W2N5');
const W1N4 = require('config.W1N4');
const W1N5 = require('config.W1N5');
const W3N5 = require('config.W3N5');

const roomConfigs = {
    W2N5,
    W1N4,
    W1N5,
    W3N5
};

const MR = MH.read; // Memory Read
const MW = MH.write; // Memory Write

let roomLevel = Memory.conf_roomLevel || 1;

module.exports = {
    instanceNew() {
        const level = room.controller.level;
        const name = room.name;
        
        const RoomValues = values[level];
        const SpecificRoomConfig = roomConfigs[name];
        
        const constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        const mineral = room.find(FIND_MINERALS);
        const structures = room.find(FIND_STRUCTURES);
        const spawners = filters.readySpawners(structures);
        const toFillSpawn = filters.toFillSpawn(structures);
        const toFillExtension = filters.toFillExtension(structures);
        const toFillTurret = filters.toFillTurret(structures);
        const toFillOthers = filters.toFillOthers([].concat(SpecificRoomConfig.links_in));
        const toRepair = filters.toRepair(structures);
        const toKill = room.find(FIND_HOSTILE_CREEPS);
        
        const creeps = room.find(FIND_MY_CREEPS);
        const overseer = _.filter(creeps, (creep) => creep.memory.role === 'overseer');
        const harvesters = _.filter(creeps, (creep) => creep.memory.role === 'harvester');
        const upgraders = _.filter(creeps, (creep) => creep.memory.role === 'upgrader');
        const builders = _.filter(creeps, (creep) => creep.memory.role === 'builder');
        const drill_1 = _.filter(creeps, (creep) => creep.memory.role === 'drill_1');
        const drill_2 = _.filter(creeps, (creep) => creep.memory.role === 'drill_2');
        const drill_3 = _.filter(creeps, (creep) => creep.memory.role === 'drill_3');
        const truck_1 = _.filter(creeps, (creep) => creep.memory.role === 'truck_1');
        const truck_2 = _.filter(creeps, (creep) => creep.memory.role === 'truck_2');
        
        const RealTimeConfig = {
            level,
            name,
            constructionSites,
            mineral,
            structures,
            spawners,
            toFillSpawn,
            toFillExtension,
            toFillTurret,
            toFillOthers,
            toRepair,
            toKill,
            creeps,
            overseer,
            harvesters,
            upgraders,
            builders,
            drill_1,
            drill_2,
            drill_3,
            truck_1,
            truck_2
        };
        
        return Object.assign(RoomValues, RealTimeConfig, SpecificRoomConfig);
    }
};