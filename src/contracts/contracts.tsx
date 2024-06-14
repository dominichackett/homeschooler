export const homeSchoolerAddress ="0x445C29606bF7bFBE8Adc3718b7E4976171ab5147"

export const homeSchoolerABI = [
	{
		"inputs": [
			{
				"internalType": "uint8",
				"name": "choice",
				"type": "uint8"
			},
			{
				"internalType": "uint256",
				"name": "tutorialId",
				"type": "uint256"
			}
		],
		"name": "answerQuiz",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "runId",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "id",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					},
					{
						"internalType": "uint64",
						"name": "created",
						"type": "uint64"
					},
					{
						"internalType": "string",
						"name": "model",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "systemFingerprint",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "object",
						"type": "string"
					},
					{
						"internalType": "uint32",
						"name": "completionTokens",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "promptTokens",
						"type": "uint32"
					},
					{
						"internalType": "uint32",
						"name": "totalTokens",
						"type": "uint32"
					}
				],
				"internalType": "struct IOracle.GroqResponse",
				"name": "response",
				"type": "tuple"
			},
			{
				"internalType": "string",
				"name": "errorMessage",
				"type": "string"
			}
		],
		"name": "onOracleGroqLlmResponse",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "prompt",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "tutorialId",
				"type": "uint256"
			}
		],
		"name": "request",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "prompt",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_schoolYear",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_schoolSystem",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_subject",
				"type": "string"
			}
		],
		"name": "startTutorial",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "i",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "initialOracleAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOracleAddress",
				"type": "address"
			}
		],
		"name": "OracleAddressUpdated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOracleAddress",
				"type": "address"
			}
		],
		"name": "setOracleAddress",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tutorialId",
				"type": "uint256"
			}
		],
		"name": "TutorialCreated",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tutorialId",
				"type": "uint256"
			}
		],
		"name": "getMessageHistoryContents",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tutorialId",
				"type": "uint256"
			}
		],
		"name": "getMessageHistoryRoles",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tutorialId",
				"type": "uint256"
			}
		],
		"name": "getTutorial",
		"outputs": [
			{
				"internalType": "address",
				"name": "_student",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_schoolSystem",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_schoolYear",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_subject",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_isFinished",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tutorialId",
				"type": "uint256"
			}
		],
		"name": "getTutorialMessages",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "role",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "content",
						"type": "string"
					}
				],
				"internalType": "struct HomeSchooler.Message[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "oracleAddress",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]