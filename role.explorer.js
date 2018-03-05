const roleHelper = require('role.helper');

module.exports = {
    run: (creep) => {
        if (creep.room.name === 'W2N5') {
            creep.memory.x = 0;
            creep.memory.y = 26;
        } else {
            if (room.controller && room.controller.my) {
                roleHelper.run(creep);
                return;
            } else {
                creep.memory.x = 26;
                creep.memory.y = 39;
                
                if (creep.pos.x === creep.memory.x && creep.pos.y === creep.memory.y) {
                    if(creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }
        }
        
        creep.moveTo(creep.memory.x, creep.memory.y);
    },
    config: [CLAIM,WORK,CARRY,CARRY,MOVE,MOVE]
};