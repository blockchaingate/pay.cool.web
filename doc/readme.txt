            const root = BIP32.fromSeed(seed, environment.chains[(name == 'KANBAN') ? 'FAB' : name]['network']);

            let childNode = root.derivePath(path);

            
            priKey = childNode.toWIF();

            buffer = wif.decode(priKey);