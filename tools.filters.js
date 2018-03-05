module.exports = {
    toFillSpawn(structures)
    {
        return structures.filter(
            (x) => {
                return x.structureType === STRUCTURE_SPAWN && x.energy < x.energyCapacity;
            }
        );
    },
    toFillExtension(structures)
    {
        return structures.filter(
            (x) => {
                return x.structureType === STRUCTURE_EXTENSION  && x.energy < x.energyCapacity;
            }
        );
    },
    toFillTurret(structures)
    {
        return structures.filter(
            (x) => {
                return x.structureType === STRUCTURE_TOWER  && x.energy < x.energyCapacity;
            }
        );
    },
    toFillOthers(ids) {
        let out = [];
        
        for (const id of ids) {
            let x = Game.getObjectById(id);
            if (x.energy < x.energyCapacity) {
                out.push(x);
            }
        }
        
        return out;
    },
    toRepair(structures) {
        return structures.filter(
            (x) => {
                return x.hits < x.hitsMax;
            }
        );
    },
    readySpawners(structures) {
        return structures.filter(
            (x) => {
                return x.structureType ===STRUCTURE_SPAWN  && x.spawning === null && (x.name === 'Home1' || x.id === '5a528d300d0487ad5a090fd4' || x.id === '5a52b3e80d0487ad5a0919bb' || x.id === '5a6cd5f37532ce0edcb3d096');
            }
        );
    },
    toIds(gameObjects) {
        return gameObjects.map(x=> x.id);
    }
};