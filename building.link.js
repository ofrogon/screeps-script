module.exports = {
    run: (config) => {
        linkIns = config.links_in.map(x => Game.getObjectById(x));
        linkOuts = config.links_out.map(x => Game.getObjectById(x));
        
        for (const linkIn of linkIns) {
            // Transfert only if ready and full
            if (linkIn.cooldown === 0) {
                // Filter to only have no full destination
                linkOuts = linkOuts.filter(x => (x.energy + 300) < x.energyCapacity);
                
                if (linkOuts.length > 0) {
                    linkIn.transferEnergy(linkOuts[0], (linkOuts[0].energyCapacity - linkOuts[0].energy));
                } else {
                    break;
                }
            }
        }
    }
};