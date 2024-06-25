//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IOracle.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract HomeSchooler {

    struct Profile {
        string imageUrl;
        string name;
        string description;
        bool isvalue;
    }

    struct Message {
        string role;
        string content;
    }

     struct Tutorial {
        address student;
        string schoolSystem;
        string schoolYear;
        string subject;
        uint messagesCount;
        Message[] messages;
       bool isFinished;
    }

         struct MyTutorial {
        uint id;    
        address student;
        string schoolSystem;
        string schoolYear;
        string subject;
        uint messagesCount;
    
       bool isFinished;
    }


      mapping(uint => Tutorial) private tutorials;
      mapping(address=> uint[]) private myTutorials;
      mapping  (address=>Profile) profiles;

      uint private tutorialsCount;

      event TutorialCreated(address indexed owner, uint indexed tutorialId);
      event OracleResponsed(uint indexed  tutorialId,uint responseDate);
      address private owner;
      address public oracleAddress;

      IOracle.OpenAiRequest  private config;
      event OracleAddressUpdated(address indexed newOracleAddress);

      constructor(
        address initialOracleAddress
    ) {
        owner = msg.sender;
        oracleAddress = initialOracleAddress;
        tutorialsCount = 0;

             config = IOracle.OpenAiRequest({
            model : "gpt-4-turbo-preview",
            frequencyPenalty : 21, // > 20 for null
            logitBias : "", // empty str for null
            maxTokens : 1000, // 0 for null
            presencePenalty : 21, // > 20 for null
            responseFormat : "{\"type\":\"text\"}",
            seed : 0, // null
            stop : "", // null
            temperature : 10, // Example temperature (scaled up, 10 means 1.0), > 20 means null
            topP : 101, // Percentage 0-100, > 100 means null
            tools : "[{\"type\":\"function\",\"function\":{\"name\":\"web_search\",\"description\":\"Search the internet\",\"parameters\":{\"type\":\"object\",\"properties\":{\"query\":{\"type\":\"string\",\"description\":\"Search query\"}},\"required\":[\"query\"]}}},{\"type\":\"function\",\"function\":{\"name\":\"image_generation\",\"description\":\"Generates an image using Dalle-2\",\"parameters\":{\"type\":\"object\",\"properties\":{\"prompt\":{\"type\":\"string\",\"description\":\"Dalle-2 prompt to generate an image\"}},\"required\":[\"prompt\"]}}}]",
            toolChoice : "auto", // "none" or "auto"
            user : "" // null
        });
    }

        function startTutorial(string memory prompt,string memory _schoolYear,string memory _schoolSystem,string memory _subject) public returns (uint i) {
                Tutorial storage tutorial= tutorials[tutorialsCount];

        tutorial.student = msg.sender;
        tutorial.schoolYear = _schoolYear;
        tutorial.schoolSystem = _schoolSystem;
        tutorial.subject = _subject;

        Message memory systemMessage;
        systemMessage.content = prompt;
        systemMessage.role = "system";
        tutorial.messages.push(systemMessage);
        tutorial.messagesCount++;


        Message memory assistantMessage;
        assistantMessage.content = "I'll first describe the topics associated with your subject.";
        assistantMessage.role = "assistant";
        tutorial.messages.push(assistantMessage);
        tutorial.messagesCount++;

         uint currentId = tutorialsCount;
         tutorialsCount = currentId + 1; 

         myTutorials[msg.sender].push(currentId);
        IOracle(oracleAddress).createOpenAiLlmCall(currentId, config);
        emit TutorialCreated(msg.sender, currentId);

        return currentId;

        }

   modifier onlyStudent(uint tutorialId) {
        require(tutorials[tutorialId].student ==  msg.sender , "Caller is not owner");
        _;
    }

   modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not owner");
        _;
    }

    modifier onlyOracle() {
        require(msg.sender == oracleAddress, "Caller is not oracle");
        _;
    }

    function setOracleAddress(address newOracleAddress) public onlyOwner {
        oracleAddress = newOracleAddress;
        emit OracleAddressUpdated(newOracleAddress);
    }


 function onOracleOpenAiLlmResponse(
        uint runId,
               IOracle.OpenAiResponse memory response,
        string memory errorMessage
    ) public onlyOracle {

         Tutorial storage tutorial = tutorials[runId];
        require(
            !tutorial.isFinished, "Tutorial is finished"
        );
          require(
            compareStrings(tutorial.messages[tutorial.messagesCount - 1].role, "user") || tutorial.messagesCount >= 2,
            "No message to respond to"
        );


        if (!compareStrings(errorMessage, "")) {
             Message memory assistantMessage;
            assistantMessage.content = "error";
            assistantMessage.role = "assistant";
            tutorial.messages.push(assistantMessage);
        } else {
             Message memory assistantMessage;
        assistantMessage.content = response.content;
        assistantMessage.role = "assistant";
        tutorial.messages.push(assistantMessage);
        }
        tutorial.messagesCount++;
        emit OracleResponsed(runId,block.timestamp);

    }

    function onOracleFunctionResponse(
        uint runId,
        string memory response,
        string memory errorMessage
    ) public onlyOracle {
        Tutorial storage tutorial = tutorials[runId];
        require(
            !tutorial.isFinished, "Tutorial is finished"
        );
        if (!compareStrings(errorMessage, "")) {
            Message memory assistantMessage;
            assistantMessage.content = "error";
            assistantMessage.role = "assistant";
            tutorial.messages.push(assistantMessage);
        
        } else {
             Message memory assistantMessage;
        assistantMessage.content = response;
        assistantMessage.role = "assistant";
        tutorial.messages.push(assistantMessage);
        }
        tutorial.messagesCount++;
        emit OracleResponsed(runId,block.timestamp);

    }

       function videoTutorials(string memory prompt,uint tutorialId) onlyStudent(tutorialId) public {
           IOracle(oracleAddress).createFunctionCall(
                tutorialId,
                "web_search",
                prompt
            );
       }



       function request(string memory prompt , uint tutorialId) onlyStudent(tutorialId) public {
       
          Tutorial storage tutorial = tutorials[tutorialId];
        require(
            !tutorial.isFinished, "Tutorial is finished"
        );
        require(
            compareStrings(tutorial.messages[tutorial.messagesCount - 1].role, "assistant"),
            "No Quiz to respond to"
        );

        Message memory userMessage;
        userMessage.role = "user";
        tutorial.messagesCount++;
        userMessage.content = prompt;
        tutorial.messages.push(userMessage);

        IOracle(oracleAddress).createOpenAiLlmCall(tutorialId, config);

       }


     function answerQuiz(uint8 choice, uint256 tutorialId) public {
         Tutorial storage  tutorial= tutorials[tutorialId];
        require(choice <= 3, "Choice must be 0-3");
        require(
            !tutorial.isFinished, "Tutorial is finished"
        );
        require(
            compareStrings(tutorial.messages[tutorial.messagesCount - 1].role, "assistant"),
            "No Quiz to respond to."
        );

        Message memory userMessage;
        userMessage.role = "user";
        if (choice == 0) {
            userMessage.content = "A";
        } else if (choice == 1) {
            userMessage.content = "B";
        } else if (choice == 2) {
            userMessage.content = "C";
        } else if (choice == 3) {
            userMessage.content = "D";
        }
        tutorial.messages.push(userMessage);
        tutorial.messagesCount++;

        IOracle(oracleAddress).createOpenAiLlmCall(tutorialId, config);
     }  

     function getTutorialMessages(uint tutorialId) public view returns (Message[] memory){
       
        Message[] memory  messages =     tutorials[tutorialId].messages;
        return messages;
     }


     function getMessageHistoryContents(uint tutorialId) public view returns (string[] memory) {
        string[] memory messages = new string[](tutorials[tutorialId].messages.length);
        for (uint i = 0; i < tutorials[tutorialId].messages.length; i++) {
            messages[i] = tutorials[tutorialId].messages[i].content;
        }
        return messages;
    }

    function getMessageHistoryRoles(uint tutorialId) public view returns (string[] memory) {
        string[] memory roles = new string[](tutorials[tutorialId].messages.length);
        for (uint i = 0; i < tutorials[tutorialId].messages.length; i++) {
            roles[i] = tutorials[tutorialId].messages[i].role;
        }
        return roles;
    }
    
    function getTutorial(uint tutorialId) public view onlyStudent(tutorialId) returns (address _student, string memory _schoolSystem,
        string memory _schoolYear,
        string memory _subject,bool _isFinished) {
            Tutorial memory tutorial = tutorials[tutorialId];
            return(tutorial.student,tutorial.schoolSystem,tutorial.schoolYear,tutorial.subject,tutorial.isFinished);
                  
        }

   function getMytutorials() public view returns   (MyTutorial[] memory) {
      uint  length = myTutorials[msg.sender].length;
      MyTutorial[] memory _tutorials = new MyTutorial[](length); // Initialize _tutorials array
          uint index;
          for (uint i = 0; i < myTutorials[msg.sender].length; i++) {
            index = myTutorials[msg.sender][i];
             _tutorials[i].student=tutorials[index].student;
          _tutorials[i].id = index;
        _tutorials[i].schoolSystem=tutorials[index].schoolSystem;
          _tutorials[i].schoolYear=tutorials[index].schoolYear;
          _tutorials[i].subject=tutorials[index].subject;
          _tutorials[i].messagesCount=tutorials[index].messagesCount;
          _tutorials[i].isFinished=tutorials[index].isFinished;
          } 
          return _tutorials;     
        }     


     function setProfile(string memory imageUrl,string memory name,string memory description ) public {
        profiles[msg.sender].imageUrl = imageUrl;
        profiles[msg.sender].name = name;
        profiles[msg.sender].description = description;
        profiles[msg.sender].isvalue = true; 
     }   

     function getProfile(address user) public view returns (Profile memory) {
        return profiles[user];
     }

     function compareStrings(string memory a, string memory b) private pure returns (bool) {
        return (keccak256(abi.encodePacked((a))) == keccak256(abi.encodePacked((b))));
    }

}