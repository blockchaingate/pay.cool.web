0x
dcd0f23125f74ef621dfa3310625f8af0dcd971b
08
0000000000000000000000000000000000000000000000003782dace9d900000
dcd0f23125f74ef621dfa3310625f8af0dcd971b
10
00000000000000000000000000000000000000000000000053444835ec580000

0x
dcd0f23125f74ef621dfa3310625f8af0dcd971b
04
000000000000000000000000000000000000000000000000de0b6b3a76400000
dcd0f23125f74ef621dfa3310625f8af0dcd971b
0d
0000000000000000000000000000000000000000000000014d1120d7b1600000







{"_id":"6390a521af71b33e3b21ec87","address":"0x0185f15ccd4e7dfec68cdc671fb07ec5a22036be","projectId":"9","__v":0,"dateCreated":"2022-12-07T14:37:21.918Z","newStatus":1,"status":0,"user":"msBALt92abvckwLzjkf6GXps7xebhv4sCz","gv":39500,"internalStatus":1,"pv":500,"referral":"n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR","statusesInChildren":[{"user":"mweZqx4QFEPDHHryp4K257zRss2VY4zc9D","status":2,"_id":"6398a2e1b1e4046f788a59bc"}]}

metaforce test:

user1:
deliver reduce reopen during pull lunar series sunset round play mandate wonder
address: mtjhXkw8umPmfFL2dWdUbP5UZmqnzHXUva

user1child:
victory belt direct during diesel elite theme print void milk huge off
mwQ77WnAabEbM93iKn8Vb3armoZuAuGLFa, referral: user


txid:
0xde032de2fc1d59ccfebebab675d6d91cd111ed471290802cc29a4f05a77ac3af
0x37f94f7d0ee58038e412b615548990c76219f3b3488e77819ada247c1603220f
0xbcb13d932082709d06d019a9b7951ccd707721c449e9505c28493254aa867140


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
