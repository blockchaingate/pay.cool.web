gamearn: analyst tribe easy rocket hobby volcano ankle meat critic swarm vacuum furnace
gameearn charger: wine sign pass shop embody joke art true evoke coach kidney list


0x
00020000
005a
dcd0f23125f74ef621dfa3310625f8af0dcd971b
00000000000000000000000000000000000000000000000001c6bf5263400000
00020000
0032
dcd0f23125f74ef621dfa3310625f8af0dcd971b
00000000000000000000000000000000000000000000000001a1cc93b1960000



approve txid: 0x8abf5e84081d5542857f5acf28e157cc8a4b8d65e67cfe9f6de434634f9ff08c
brand ndw

merchant credit added: 0x6c4f0e6121f99a1979a057cdfc574410a3dfb0094bac3de8edc6cac8e38ac491


faculty hour almost rival awkward soft way cloth swallow sentence comfort eagle

moneris:
ken
98@yQ

#edeff0;

0x621d569517dc9e29e9166669

new:gesture number project expand sister lemon dress slush try weekend section planet

const Web3 = require('web3');
const  Hash = require('eth-lib/lib/hash');
const Account = require('eth-lib/lib/account');

    signJsonData(privateKey: any, data: any) {

        var queryString = Object.keys(data).filter((k) => (data[k] != null) && (data[k] != undefined))
        .map(key => key + '=' + (typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]))).sort().join('&');

        const signature = signKanbanMessageWithPrivateKey(queryString, privateKey);
        return signature;  
    }



  hashKanbanMessage(data) {
    const web3 = new Web3();
    var messageHex = web3.utils.isHexStrict(data) ? data : web3.utils.utf8ToHex(data);
    var messageBytes = web3.utils.hexToBytes(messageHex);
    var messageBuffer = Buffer.from(messageBytes);
    var preamble = '\x17Kanban Signed Message:\n' + messageBytes.length;
    var preambleBuffer = Buffer.from(preamble);
    var ethMessage = Buffer.concat([preambleBuffer, messageBuffer]);
    var hash = Hash.keccak256s(ethMessage);    
    console.log('hash1=', hash);
    return hash;
  }

  signKanbanMessageWithPrivateKey(message: string, privateKey: any) {
    var hash = hashKanbanMessage(message);
    return signKanbanMessageHashWithPrivateKey(hash, privateKey);
  }

  signKanbanMessageHashWithPrivateKey(hash: string, privateKey: any) {

    const privateKeyHex = `0x${privateKey.toString('hex')}`;
    // 64 hex characters + hex-prefix
    if (privateKeyHex.length !== 66) {
        throw new Error("Private key must be 32 bytes long");
    }    
    var signature = Account.sign(hash, privateKeyHex);
    var vrs = Account.decodeSignature(signature);
    return {
        messageHash: hash,
        v: vrs[0],
        r: vrs[1],
        s: vrs[2],
        signature: signature
    };
  }






const data = {
    parentId: this.referral
};

const sig = signJsonData(privateKey, data);
data['sig'] = sig.signature; 
