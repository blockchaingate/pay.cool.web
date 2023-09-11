// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import * as Btc from 'bitcoinjs-lib';
export const environment = {
  env: 'dev',
  version: '1.0.13',
  production: false,
  EPAY_API: 'http://29597375fx.zicp.vip/paymentApi',
  appid: '5f80c3b09577e8dc2f8db596',
  cat_typ: 'ecombar',
  baseUrl: 'http://localhost:4200',
  IDDOCK: 'http://localhost:4201',
//  EX_GATEWAY: 'https://test.blockchaingate.com/v2/payment/gateway',
//  EX_WEBSITE: 'http://localhost:4200/',


  endpoints: {
    local: 'https://test.blockchaingate.com/v2/',
    test: 'https://test.blockchaingate.com/v2/',
    prod: 'https://blockchaingate.com/v2/',
    kanban: 'https://kanbantest.fabcoinapi.com/',
    emailApi: "https://api.blockchaingate.com/v2/subscribes/",
    api: 'https://test.fabcoin.org/api/',
    // blockchaingate: 'https://api.blockchaingate.com/v2/',
    //blockchaingate: 'http://localhost:3002/v2/',
    blockchaingate: 'https://test.blockchaingate.com/v2/',
    website: 'https://test.exchangily.com/',
    BTC: {
        exchangily: 'https://btctest.fabcoinapi.com/'
    },
    FAB: {
        exchangily: 'https://fabtest.fabcoinapi.com/'
    },
    ETH: {
        exchangily: 'https://ethtest.fabcoinapi.com/',
        // etherscan: 'https://api-ropsten.etherscan.io/'
    },
    BCH: {
        exchangily: 'https://bchtest.fabcoinapi.com/',
    },
    DOGE: {
        exchangily: 'https://dogetest.fabcoinapi.com/',
    },
    LTC: {
        exchangily: 'https://ltctest.fabcoinapi.com/',
    },
    blockchain: 'https://testapi.fundark.com/api/'    
    //blockchain: 'http://localhost:3000/api/'
  },
  chains: {
    BTC: {
        network: Btc.networks.testnet,
        satoshisPerBytes: 60,
        bytesPerInput: 148
    },
    DOGE: {
        network: {
            messagePrefix: '\u0019Dogecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x71,
            scriptHash: 0xc4,
            wif: 0xf1,
        },
        satoshisPerBytes: 400000,
        bytesPerInput: 148
    },
    LTC: {
        network: {
            messagePrefix: '\u0019Litecoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x0436f6e1,
                private: 0x0436ef7d,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0x3a,
            wif: 0xef,
        },
        satoshisPerBytes: 200,
        bytesPerInput: 148
    },
    BCH: {
        network: {
            messagePrefix: '\u0018Bitcoin Signed Message:\n',
            bech32: 'tb',
            bip32: {
                public: 0x043587cf,
                private: 0x04358394,
            },
            pubKeyHash: 0x6f,
            scriptHash: 0xc4,
            wif: 0xef,
        },
        satoshisPerBytes: 50,
        bytesPerInput: 148
    },
    ETH: {
        chain: 'goerli',
        hardfork: 'byzantium',
        gasPrice: 90,
        gasPriceMax: 200,
        gasLimit: 21000,
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
    },
    BNB: {
        chain: {
            name: 'bnb',
            networkId: 97,
            chainId: 97
        },
        gasPrice: 10,
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
    },
    FAB: {
        network: Btc.networks.testnet,
        chain: {
            name: 'test',
            networkId: 212,
            chainId: 212
        },
        satoshisPerBytes: 100,
        bytesPerInput: 148,
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
            name: 'test',
            networkId: 212,
            chainId: 212
        },
        gasPrice: 50000000,
        gasLimit: 20000000,
        Safes: {
            SimulateTxAccessor: '0x697694d0bef59bf6a6077368fc657275bac458be',
            SafeProxyFactory: '0x245e2c201f129034b0c357da08f044f1474d4cb0',
            TokenCallbackHandler: '0x443cc78fd2e8912492a0b415de5548baf3ef98d8',
            CompatibilityFallbackHandler: '0x81bdb543f25f582404f4c0e4889b8e56d491c370',
            CreateCall: '0xdc2dafff2f57acd18daf7a0f78d6aef7dde60697',
            MultiSend: '0xedfbc7b1cc7a4d056da718b3451f616b3938acca',
            MultiSendCallOnly: '0x0b792260e544636fdc75ce8c55e2e11a38283013',
            SignMessageLib: '0xf052f9e650ffec988a740f78f1802ae72314a39a',
            SafeL2: '0x83681373c0ea8160580fb7d8a6e4ca23396a2d3b',
            Safe: '0xa8525bb37a3ea2ba6c61d00f05dc136fb9edc998'
        }
    }
  },

  addresses: {
    Referral_ROOT: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR',

    ecombarOfficial: {
        ETH: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        FAB: '1FNEhT8uTmrEMvHGCGohnEFv6Q1z4qRhQu'
    },
    smartContract: {
        smartConractProjectUserRelation: '0x0185f15ccd4e7dfec68cdc671fb07ec5a22036be',
        smartConractMerchantInfo: '0xab9f22b6bb7a134cb0058bc4582d5ce043269700',
        smartContractMerchantNode: '0xc2f52d79994ed8f0b68e73edf28f3f562da75a06',
        smartConractAdressReferral: '0x686bba93b02abf2efdcfec1b42a2c93e6e7bb6a6',
        /*
        smartConractFeeCharger: '0x84abbbc0ccfb542787da81de570583e8e127cd2f',
        smartContractRewardDistribution: '0x6ef9ad58f8ac314b42e97078a1967d1375adb32d',
        smartConractAdressExchangeRate: '0x44b9c6409fbb133f4f0ebbb07b4fb61c0d20181b',
        smartContractLocker: '0x266a9a762edd46a7f183cd81e0bf5057d630f03c',
        smartContractZap: '0xefd18bf4b9f14fc182e24302bb41a80a68e8ecf2',
        smartContractPackage: '0xb19c9516de58b9f636c5e1e9ccabd4375fde6a61',
        */
        feeDistribution: '0x81dd9357bf85bdb272e9ee1ec0ec2baa8bdffd06',
        locker: '0xab64a2a910a6dda85620a109cd012bb4a7b20b6f',
        exchangeRate: '0xb9622a9e96ea64bcb0bafc609f810994250f0db4',
        sevenStarProxy: '0x0449e15d3695023c3ae50e48687b704d3b3e25ce',
        
        feeDistribution2: '0x127a02844ef0f532cf4b7daf94ff322b7d3feedd',
        locker2: '0xb1555c941b5ae20c8ec4549c26000ca6e06805c5',
        exchangeRate2: '0x181ce350dccde3ace0153bbb844fdf39c16540da',
        sevenStarProxy2: '0x7881175b4014b3848caf41afb0702cb2f19fa8fc',
        merchantCredit2: '0xb23d43b57931e49747776c3d86861d54c21705cb',
        regularLocker2: '0xd758bee432a0f92ec99eeb07afda1b6060dbf87c',
        
        SEVENSTAR_ENROLLMENT: '0x294b2befc6f725d941917aee5b4022e8165eb540',
        FABLOCK: '0xa7d4a4e23bf7dd7a1e03eda9eb7c28a016fd54aa',
        EXG: '0x867480ba8e577402fa44f43c33875ce74bdc5df6',
        USDT: {
            ETH:'0xa9f4f6f0fa56058ebdb91865eb2f6aec83b94532',
            BNB: '0x4850754ea867654339f38d4e6df7cd80cfee141f',
            TRX: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
        },
        USDC: {
            ETH: '0x1c35eCBc06ae6061d925A2fC2920779a1896282c',
            TRX: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
        },
        DUSD: '0x78f6bedc7c3d6500e004c6dca19c8d614cfd91ed',
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
        // BNB: '0xE90e361892d258F28e3a2E758EEB7E571e370c6f',
        INB: '0x919c6d21670fe8cEBd1E86a82a1A74E9AA2988F8',
        REP: '0x4659c4A33432A5091c322E438e0Fb1D286A1EbdE',
        HOT: '0x6991d9fff5de74085f5c786d425403601280c8f4',
        CEL: '0xa07a1ab0a8e4d95683dce8d22d0ed665499f0a2b',
        MATIC: '0x39ccec89a2251652265ab63fdcd551b6f65e37d5',
        IOST: '0x4dd868d8d961f202e3244a25871105b5e1feaa62',
        MANA: '0x4527fa0ce6f221a7b9e54412d7a3edd9a37c350a',
        FUN: '0x98e6affb8192ffd89a62e27dc5a594cd3c1fc8db', //??
        WAX: '0xb2140669d08a02b78a9fb4a9ebe36371ae023e5f',
        ELF: '0xdd3d64919c119a7cde45763b94cf3d1b33fdaff7',
        GNO: '0x94fd1b18c927935d4f1751239172ad212281f4ac',
        POWR: '0x6e981f5d973a3ab55ff9db9a77f4123b71d833dd',
        WINGS: '0x08705dc287150ba2da249b5a1b0c3b99c71b4100',
        MTL: '0x1c9b5afa112b42b12fb06b62e5f1e159af49dfa7',
        KNC: '0x3aad796ceb3a1063f727c6d0c698e37053292d10',
        GVT: '0x3e610d9fb322063e50d185e2cc1b45f007e7180c',
        DRGN: '0xbbdd7a557a0d8a9bf166dcc2730ae3ccec7df05c',
        NVZN: '0xf18e828a19c00764522e50a511fffd521de4b119'
    },
   exchangilyOfficial: {
    EXG: '0xed76be271bb47a6df055bbc2039733c26fdecc82',
    FAB: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
    BTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
    ETH: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    USDT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    DUSD: '0xed76be271bb47a6df055bbc2039733c26fdecc82',
    BCH: 'bchtest:qrkhd038rw685m0s2kauyquhx0pxlhkvsg6dydtwn9',
    LTC: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
    DOGE: 'nqqkf8PqJj3CUjwLMEcjJDfpiU5NDcMUrB',
    // BNB: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    INB: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    REP: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    HOT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    CEL: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    MATIC: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    IOST: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    MANA: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    FUN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E', // ??
    WAX: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    ELF: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    GNO: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E', 
    POWR: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    WINGS: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    MTL: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    KNC: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    GVT: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    DRGN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    NVZN: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
    TRX: 'TGGJPohUhzpW8W1LTRhPejGK8LDyR7ofM3'
   },
    promotionOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
    },
    otcOfficial: {
        USDT: '0x4e93c47b42d09f61a31f798877329890791077b2',
        DUSD: '0xcdd40948208b0098b6a51e69d945de4692766ef3',
        BTC: 'muQDw5hVmFgD1GrrWvUt6kjrzauC4Msaki',
        ETH: '0x4e93c47b42d09f61a31f798877329890791077b2',
        FAB: 'n1eXG5oe6wJ6h43akutyGfphqQsY1UfAUR'
    },
    campaignOfficial: {
        ETH: '0x450C53c50F8c0413a5829B0A9ab9Fa7e38f3eD2E',
        FAB: 'n3AYguoFtN7SqsfAJPx6Ky8FTTZUkeKbvc',
        TRX: 'TSGTqL78E6x1PGqrv6Cw7R4yXYRiXU1kwR',
        BINPAY: 'oczwCWznwf9bxnbvrbEFDAurMRuJmCiEBS'
    }
},

  CoinType: {
    BTC: 1,
    ETH: 60,
    FAB: 1150,
    BCH: 1,
    LTC: 1,
    DOGE: 1,
    TRX: 195
  },
  moneris: {
    ps_store_id: '9VGAUtore3',
    hpp_key: 'hpRS5R56OATG'
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

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
