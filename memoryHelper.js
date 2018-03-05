module.exports = {
    read: function(room, memoryName) {
        return Memory[`config_${room.name}_${memoryName}`];
    },
    write: function(room, memoryName, value) {
        return Memory[`config_${room.name}_${memoryName}`] = value;
    }
};