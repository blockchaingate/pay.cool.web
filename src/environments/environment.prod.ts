import * as Btc from 'bitcoinjs-lib';
export const environment = {
  env: 'prod',
  production: true,
  EPAY_API: 'https://api.epay.com/paymentApi',
  appid: '5b6a8688905612106e976a69',
  IDDOCK: 'http://localhost:4201',
  cat_typ: 'ecom',
  baseUrl: 'http://localhost:4200',
  endpoints: {
    prod: 'https://api.blockchaingate.com/v2/',
    blockchaingate: 'https://api.blockchaingate.com/v2/',
    website: 'http://ecombar.com/',
    emailApi: "https://api.blockchaingate.com/v2/subscribes",
    api: 'https://api.pay.cool/api/',
    kanban: 'https://kanbanprod.fabcoinapi.com/',
    BTC: {
      exchangily: 'https://btcprod.fabcoinapi.com/'
    },
    FAB: {
        exchangily: 'https://fabprod.fabcoinapi.com/'
    },
    ETH: {
        exchangily: 'https://ethprod.fabcoinapi.com/',
    },
    BCH: {
        exchangily: 'https://bchprod.fabcoinapi.com/',
    },
    DOGE: {
        exchangily: 'https://dogeprod.fabcoinapi.com/',
    },
    LTC: {
        exchangily: 'https://ltcprod.fabcoinapi.com/',
    },
    blockchain: 'https://api.pay.cool/api/'     
  },
  chains: {
    BTC: {
        network: Btc.networks.bitcoin,
        satoshisPerBytes: 90,
        bytesPerInput: 152
    },
    DOGE: {
        network: {
            messagePrefix: '\u0019Dogecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x02facafd,
              private: 0x02fac398,
            },
            pubKeyHash: 0x1e,
            scriptHash: 0x16,
            wif: 0x9e,
        },            
        satoshisPerBytes: 1500000,
        bytesPerInput: 148
    },

    LTC: {
        network: {
            messagePrefix: '\u0019Litecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x019da462,
              private: 0x019d9cfe,
            },
            pubKeyHash: 0x30,
            scriptHash: 0x32,
            wif: 0xb0,
        },            
        satoshisPerBytes: 150,
        bytesPerInput: 148
    },  
    BCH: {
        network: {
            messagePrefix: '\u0018Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
              public: 0x0488b21e,
              private: 0x0488ade4,
            },
            pubKeyHash: 28,
            scriptHash: 40,
            wif: 0x80,
        },            
        satoshisPerBytes: 9,
        bytesPerInput: 148
    },               
    ETH: {
        chain: 'mainnet',
        hardfork: 'petersburg',
        gasPrice: 90,
        gasPriceMax: 200,
        gasLimit: 21000,
        gasLimitToken: 150000,
        Safes: {
            SimulateTxAccessor: '0x3d4BA2E0884aa488718476ca2FB8Efc291A46199',
            SafeProxyFactory: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67',
            TokenCallbackHandler: '',
            CompatibilityFallbackHandler: '0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99',
            CreateCall: '0x9b35Af71d77eaf8d7e40252370304687390A1A52',
            MultiSend: '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526',
            MultiSendCallOnly: '0x9641d764fc13c8B624c04430C7356C1C7C8102e2',
            SignMessageLib: '0xd53cd0aB83D845Ac265BE939c57F53AD838012c9',
            SafeL2: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
            Safe: '0x41675C099F32341bf84BFc5382aF534df5C7461a'
        }
    },
    BNB: {
        chain: {
            name: 'bnb',
            networkId: 56,
            chainId: 56
        },
        gasPrice: 5,
        gasLimitToken: 150000,
        Safes: {
            SimulateTxAccessor: '0x3d4BA2E0884aa488718476ca2FB8Efc291A46199',
            SafeProxyFactory: '0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67',
            TokenCallbackHandler: '0xeDCF620325E82e3B9836eaaeFdc4283E99Dd7562',
            CompatibilityFallbackHandler: '0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99',
            CreateCall: '0x9b35Af71d77eaf8d7e40252370304687390A1A52',
            MultiSend: '0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526',
            MultiSendCallOnly: '0x9641d764fc13c8B624c04430C7356C1C7C8102e2',
            SignMessageLib: '0xd53cd0aB83D845Ac265BE939c57F53AD838012c9',
            SafeL2: '0x29fcB43b46531BcA003ddC8FCB67FFE91900C762',
            Safe: '0x41675C099F32341bf84BFc5382aF534df5C7461a'
        }

/*
reusing "SimulateTxAccessor" at 0x3d4BA2E0884aa488718476ca2FB8Efc291A46199
reusing "SafeProxyFactory" at 0x4e1DCf7AD4e460CfD30791CCC4F9c8a4f820ec67
reusing "TokenCallbackHandler" at 0xeDCF620325E82e3B9836eaaeFdc4283E99Dd7562
deploying "CompatibilityFallbackHandler" (tx: 0x586ee5147521c968654e2eb693f7a1bae0312475575dce4095e633c11440d8ba)...: deployed at 0xfd0732Dc9E303f09fCEf3a7388Ad10A83459Ec99 with 1269776 gas
reusing "CreateCall" at 0x9b35Af71d77eaf8d7e40252370304687390A1A52
reusing "MultiSend" at 0x38869bf66a61cF6bDB996A6aE40D5853Fd43B526
reusing "MultiSendCallOnly" at 0x9641d764fc13c8B624c04430C7356C1C7C8102e2
deploying "SignMessageLib" (tx: 0xe2047cfbb3a7a4ce1ac6d7a5e4e006967f7e589426eb8b129fa0a3dcd975c65a)...: deployed at 0xd53cd0aB83D845Ac265BE939c57F53AD838012c9 with 262353 gas
deploying "SafeL2" (tx: 0xcc565187d139ea41dfad9257d841c24b57ced73b3b4865e34a7179b5bb8678e8)...: deployed at 0x29fcB43b46531BcA003ddC8FCB67FFE91900C762 with 5331001 gas
deploying "Safe" (tx: 0x7932c3290676f81678c5bb04f443c763489beabf9a296a08664740f1ae8eed87)...: deployed at 0x41675C099F32341bf84BFc5382aF534df5C7461a with 5148594 gas
*/


    },
    FAB: {
        network: Btc.networks.bitcoin,
        chain: {
            name: 'mainnet',
            networkId: 0,
            chainId: 0
        },
        satoshisPerBytes: 100,
        bytesPerInput: 152,
        gasPrice: 50,
        gasLimit: 800000
    },
    TRX: {
        network: {
            messagePrefix: '\x15TRON Signed Message:\n'
        },
        feeLimit: 40,
        feeLimitToken: 40,
        fullNode: 'https://api.trongrid.io',
        solidityNode: 'https://api.trongrid.io',
        eventServer: 'https://api.trongrid.io' 
    },    
    KANBAN: {
        chain: {
            name: 'mainnet',
            networkId: 211,
            chainId: 211
        },
        gasPrice: 50000000,
        gasLimit: 20000000,
        Safes: {
            SimulateTxAccessor: '0x1a5fafd1525fb85223f0decffda3df03992a40b9',
            SafeProxyFactory: '0x1907a90db1d3a9ec5916b071ffb6990d39e914ce',
            TokenCallbackHandler: '0x89619afac0f4631ca40c2848301a30c0f95fe6ee',
            CompatibilityFallbackHandler: '0xead13823efdf2fefb10e36ff6a3f6f34944569b0',
            CreateCall: '0x4da06f0120ea702aa0cd457aaa1256615bb8a208',
            MultiSend: '0x554ee38572c69da84fab588b27f67adbbf4cd6ad',
            MultiSendCallOnly: '0x17efecd54478cb0b970e91957ef6445d768dd2c8',
            SignMessageLib: '0x5e63d91e8c5fd4e879cc87d52cf5680229d9853a',
            SafeL2: '0xb05745f3b27cc575633cd7238f3c42d53b1836ce',
            Safe: '0xb9de13dcbb1466762532f8b985cc508935ca1c2c'
        }
    }
  },
  CoinType: {
    BTC: 0,
    ETH: 60,
    FAB: 1150,
    BCH: 145,
    LTC: 2,
    DOGE: 3,
    TRX: 195
  },   
  moneris: {
    ps_store_id: '9VGAUtore3',
    hpp_key: 'hpRS5R56OATG'
  },  
addresses: {
    Referral_ROOT: '13XarB3tKd54WDTrhegxdTMpf8QKTU2t2g',
    ecombarOfficial: {
        ETH: '0x0dF198C80893c1373a11AdE9ad6454181aE18E73',
        FAB: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu'
    },

    smartContract: {
        locker2: '0x9a56b2370ac5a41b84d1bc72c1722b6fc27e77d0',

        smartContractMerchantNode: '0xf846051d657b37337ecd7e04bba10cf9b4467545',
        smartContractUserNode: '0xc89fcaac386421032b510edb9a35b8f48097b5f4',

        smartConractMerchantInfo: '0x56aaf3fd0c9114417f9cb06b2c3963179b0e2ba9',
        feeDistribution2: '0x2f20125f2ed7cb0f0ac1b928f5e751307a7686a8',

        smartConractProjectUserRelation: '0xae7657cc5923398bfd810660f8009d05ff98f5c4',
        smartConractAdressReferral: '0xcd9c20e8e1252d5cd5eacd825e1be2dbda808000',

        /*
        feeDistribution: '0xf3b46ef452099ec2b6f81644b6da75c91c5e116a',
        locker: '0x08283086b2192666128b7a6eaf66df2dfd3f1b6b',
        exchangeRate: '0xc790135e17490400a46bebff9efcc77dac39bdcf',
        sevenStarProxy: '0x541ce3f716a3d6b64b0da9f51e7fe8ad52294f28',
        */

        exchangeRate2: '0xb760282b470219d974b79734063313fbc7016567',
        sevenStarProxy2: '0x9609c27a06565c59923fe3bf81cdf6f10394f4a6',
        merchantCredit2: '0xb6b3b79ce88b04393c23ae1f6f3d649578814568',
        regularLocker2: '0x1062bc321fce204f7093666523c277bbfd001fce',


        SEVENSTAR_ENROLLMENT: '0x99013cf2e650ab80c0852288445cdf4d18f5f2d4',
        FABLOCK: '0x04baa04d9550c49831427c6abe16def2c579af4a',
        EXG: '0xa3e26671a38978e8204b8a37f1c2897042783b00',
        USDT: {
            ETH:'0xdac17f958d2ee523a2206206994597c13d831ec7',
            BNB: '0x55d398326f99059ff775485246999027b3197955',
            TRX:'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
        },
        USDC: {
            ETH: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
            BNB: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
            TRX: 'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'
        },
        DUSD: '0x46e0021c17d30a2db972ee5719cdc7e829ed9930',
        DCAD: '0x39296a9d1c5019fd64c9ef4cd0e657403bf10405',
        DCNY: '0xcb856b9d1184232a3ec1ae735b39778c6e65a33a',
        DJPY: '0xec794fc70b9db714a4dec2581bce6764b3731a84',
        DGBP: '0xb1c07ddae8f2f449e8896874ac307325c39842d3',
        DEURO: '0xadf9ec6c2f28217c0c8c8a173e0c06c4e6cbe4a1',
        DAUD: '0xbc01e6e46369c6fc61fefa722dd081d1c0f1c096',
        DMYR: '0x2a81b44e3c3d0bd3941c636ae3e945460b7ad49d',
        DKRW: '0x14221b728caab28eea480fb114b1edd36c72ffaf',
        DPHP: '0x4ef2bfe2726b006f6ef85e59555e23c8a7ada071',
        DTHB: '0xaf90bd20af338203e807b63417c40eb3cd45ce2e',
        DTWD: '0x5b98385998bb78fe55b547c2baa1abc4fd31e4e9',
        DSGD: '0xfc32f23a8246d9882149f2aeb2548e9a6da51746',
        DHKD: '0x838eac199995a3252bf513bad4b04741767c4331',
        DINR: '0x16c3f0a2af0f1661c556f6dd9c4c12843ccedf7a',
        DMXN: '0x9b5fe4f9fb3a20d0fc2d2b4533a047994adf51bc',
        DBRL: '0x0e0eab64b2473a0912ff767904cc013402dfc822',
        DNGN: '0xd45948d6cc0450fd97e161fafe973e59a90799c5',
        //BNB: '0xB8c77482e45F1F44dE1745F52C74426C631bDD52',
        INB: '0x17aa18a4b64a55abed7fa543f2ba4e91f2dce482',
        REP: '0x1985365e9f78359a9B6AD760e32412f4a445E862',
        HOT: '0x6c6ee5e31d828de241282b9606c8e98ea48526e2',
        CEL: '0xaaaebe6fe48e54f431b0c390cfaf0b017d09d42d',
        MATIC: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
        IOST: '0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab',
        MANA: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
        FUN: '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
        WAX: '0x39bb259f66e1c59d5abef88375979b4d20d98022',
        ELF: '0xbf2179859fc6d5bee9bf9158632dc51678a4100e',
        GNO: '0x6810e776880c02933d47db1b9fc05908e5386b96', 
        POWR: '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
        WINGS: '0x667088b212ce3d06a1b553a7221E1fD19000d9aF',
        MTL: '0xF433089366899D83a9f26A773D59ec7eCF30355e',
        KNC: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
        GVT: '0x103c3A209da59d3E7C4A89307e66521e081CFDF0',
        DRGN: '0x419c4db4b9e25d6db2ad9691ccb832c8d9fda05e',

        CSU: '0x7650987b35272a64934b6d02aad6db5b3bd8d119',

        LINK: '0x514910771af9ca656af840dff83e8264ecf986ca',
        UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
        SHIB: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
        CRO: '0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b',
        GALA: '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA',
        POLY: '0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec',
        CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
        SAND: '0x3845badAde8e6dFF049820680d1F14bD3903a5d0',
        COMP: '0xc00e94cb662c3520282e6f5717214004a7f26888',
        BAT: '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
        SUSHI: '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
        CVC: '0x41e5560054824ea6b0732e656e3ad64e20e94e45',
        CELR: '0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
        YFI: '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
        SLP: '0x37236cd05b34cc79d3715af2383e96dd7443dcf1'
    },
    /*
    exchangilyOfficial: [
        { name: 'EXG', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' },
        { name: 'FAB', address: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu' },
        { name: 'BTC', address: '1CKg6irbGXHxBHuTx7MeqYQUuMZ8aEok8z' },
        { name: 'ETH', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
        { name: 'USDT', address: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06' },
        { name: 'DUSD', address: '0x9d95ee21e4f1b05bbfd0094daf4ce110deb00931' }
    ],
    */
    exchangilyOfficial: {
        EXG: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
        FAB: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
        BTC: '1GJ9cTDJM93Y9Ug443nLix7b9wYyPnad55',
        ETH: '0x4983f8634255762A18D854790E6d35A522E2633a',
        USDT: '0x4983f8634255762A18D854790E6d35A522E2633a',
        DUSD: '0xa7c8257b0571dc3d3c96b24b668c6569391b3ac9',
        BCH: 'bitcoincash:qznusftmq4cac0fuj6eyke5vv45njxe6eyafcld37l',
        LTC: 'LaX6sfX8RoHbQHNDEBmdzyBMN9vFa95FXL',
        DOGE: 'DLSF9i9weYwpgUrendmuGiHC35HGoHuvR9',
        TRX: 'TGfvRWxddNoWrghwE5zC1JEcbXyMdPATdo',
        //BNB: '0xe7721493eea554b122dfd2c6243ef1c6f2fe0a06',
        INB: '0x4983f8634255762A18D854790E6d35A522E2633a',
        REP: '0x4983f8634255762A18D854790E6d35A522E2633a',
        HOT: '0x4983f8634255762A18D854790E6d35A522E2633a',
        CEL: '0x4983f8634255762A18D854790E6d35A522E2633a',
        MATIC: '0x4983f8634255762A18D854790E6d35A522E2633a',
        IOST: '0x4983f8634255762A18D854790E6d35A522E2633a',
        MANA: '0x4983f8634255762A18D854790E6d35A522E2633a',
        FUN: '0x4983f8634255762A18D854790E6d35A522E2633a',
        WAX: '0x4983f8634255762A18D854790E6d35A522E2633a',
        ELF: '0x4983f8634255762A18D854790E6d35A522E2633a',
        GNO: '0x4983f8634255762A18D854790E6d35A522E2633a', 
        POWR: '0x4983f8634255762A18D854790E6d35A522E2633a',
        WINGS: '0x4983f8634255762A18D854790E6d35A522E2633a',
        MTL: '0x4983f8634255762A18D854790E6d35A522E2633a',
        KNC: '0x4983f8634255762A18D854790E6d35A522E2633a',
        GVT: '0x4983f8634255762A18D854790E6d35A522E2633a',
        DRGN: '0x4983f8634255762A18D854790E6d35A522E2633a'        
    },
    promotionOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
    },
    otcOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: '1MczhymXZcpCyzuAe3DQrVafhTsaQyDo5U',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: '1KmKXs2vBMd367ifzY75JCUCbBW8sV1n4w'
    },
    campaignOfficial: {
        ETH: '',
        FAB: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu',
        TRX: '',
        BINPAY: 'KkuyzSrA85AXyrhFKa8N5zn73bsNnjkm3U'
    }
},  
depositMinimumConfirmations: {
    EXG: 12,
    BTC: 2,
    FAB: 12,
    ETH: 20,
    USDT: 20,
    DUSD: 12,
    DCAD: 12,
    DCNY: 12,
    DJPY: 12,
    DGBP: 12,
    DEURO: 12,
    DAUD: 12,
    DMYR: 12,
    DKRW: 12,
    DPHP: 12,
    DTHB: 12,
    DTWD: 12,
    DSGD: 12,
    DHKD: 12,
    DINR: 12,
    DMXN: 12,
    DBRL: 12,
    DNGN: 12,       
    BCH: 2,
    LTC: 8,
    DOGE: 20,
    BNB: 20,
    INB: 20,
    REP: 20,
    HOT: 20,
    CEL: 20,
    MATIC: 20,
    IOST: 20,
    MANA: 20,
    FUN: 20,
    WAX: 20,
    ELF: 20,
    GNO: 20,
    POWR: 20,
    WINGS: 20,
    MTL: 20,
    KNC: 20,
    GVT: 20,
    DRGN: 20,
    NVZN: 20
},    
paypal_client_id: 'AdmdQayzrKMsDPxU89G_UWcLVfFlHhG-zfFm4I75F6xusJ64AIBOre6J6NxfzsM6JStHQmtviHoCp59x'
};
