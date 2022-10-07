export class ABI {
    static createAccount = {
        "inputs": [
          {
            "internalType": "address",
            "name": "_referral",
            "type": "address"
          }
        ],
        "name": "createAccount",
        "outputs": [
          
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    };

    static createMerchant = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        },
        {
          "internalType": "bytes32",
          "name": "_merchantHash",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "_referral",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_paymentReceiver",
          "type": "address"
        }
      ],
      "name": "createMerchant",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };

    static approveMerchant = {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_id",
          "type": "bytes32"
        }
      ],
      "name": "approveMerchant",
      "outputs": [
        
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    };
    
    static chargeFundsWithFee = {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "_merchantId",
            "type": "bytes32"
          },
          {
            "internalType": "bytes32",
            "name": "_orderId",
            "type": "bytes32"
          },
          {
            "internalType": "uint32",
            "name": "_paidCoin",
            "type": "uint32"
          },
          {
            "internalType": "uint256",
            "name": "_totalAmount",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "_totalTax",
            "type": "uint256"
          },
          {
            "internalType": "bytes",
            "name": "_rewardInfo",
            "type": "bytes"
          }
        ],
        "name": "chargeFundsWithFee",
        "outputs": [
          
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    };

}