const gRPC = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./../proto/question.proto', {});
const gRPCObject = gRPC.loadPackageDefinition(packageDefinition);

const questionPackage = gRPCObject.question;

const question = [
{
  "_id": {
    "$oid": "665568f4ac3f6205c943a937"
  },
  "type": "ANAGRAM",
  "anagramType": "WORD",
  "blocks": [
    {
      "text": "T",
      "showInOption": true,
      "isAnswer": true
    },
    {
      "text": "O",
      "showInOption": true,
      "isAnswer": true
    },
    {
      "text": "Y",
      "showInOption": true,
      "isAnswer": true
    }
  ],
  "siblingId": {
    "$oid": "66555f1a3735a7caf45b6f09"
  },
  "solution": "TOY",
  "title": "Rearrange the letters to form a word"
},
{
  "_id": {
    "$oid": "6654d0bc8571bf23e1bef300"
  },
  "type": "ANAGRAM",
  "anagramType": "SENTENCE",
  "blocks": [
    {
      "text": "I started learning",
      "showInOption": true,
      "isAnswer": true
    },
    {
      "text": "to play the guitar",
      "showInOption": true,
      "isAnswer": true
    },
    {
      "text": "because",
      "showInOption": true,
      "isAnswer": true
    },
    {
      "text": "I dream of forming a band",
      "showInOption": true,
      "isAnswer": true
    },
    {
      "text": "and playing",
      "showInOption": true,
      "isAnswer": true
    },
    {
      "text": "in concerts.",
      "showInOption": true,
      "isAnswer": true
    }
  ],
  "siblingId": {
    "$oid": "6654bf1de7b8dd361ba05bf3"
  },
  "solution": "I started learning to play the guitar because I dream of forming a band and playing in concerts.",
  "title": "Rearrange the words to form a sentence"
},
{
  "_id": {
    "$oid": "6655b1c5d3d666003d3b1d83"
  },
  "type": "MCQ",
  "options": [
    {
      "text": "under",
      "isCorrectAnswer": true
    },
    {
      "text": "below",
      "isCorrectAnswer": false
    },
    {
      "text": "above",
      "isCorrectAnswer": false
    },
    {
      "text": "over",
      "isCorrectAnswer": false
    }
  ],
  "siblingId": {
    "$oid": "66554e47c59979a52d16b1e9"
  },
  "title": "In my previous job, I often had to complete tasks ______ tight deadlines."
},
{
  "_id": {
    "$oid": "6655b0fc33dd0fc2f6a62524"
  },
  "type": "MCQ",
  "options": [
    {
      "text": "esteemed",
      "isCorrectAnswer": true
    },
    {
      "text": "esteeming",
      "isCorrectAnswer": false
    },
    {
      "text": "esteem",
      "isCorrectAnswer": false
    },
    {
      "text": "esteems",
      "isCorrectAnswer": false
    }
  ],
  "siblingId": {
    "$oid": "66554dee76f0333f5986f5aa"
  },
  "title": "My commitment to journalistic integrity, combined with my proficiency in leveraging new media platforms, makes me a well-suited candidate to join your ______ team and contribute to your mission of delivering compelling news stories."
},
]

function GetAllQuestions(call, callback) {
    callback(null, { questions: question });
}

function GetQuestionByType(call, callback){
    const type = call.request.type;
    console.log("Type: ", type);
    const questionsByType = question.filter(q => q.type == type);
    callback(null, { questions: questionsByType });
}

function GetQuestionBySearchString(call, callback){
    const searchString = call.request.searchString;
    console.log("Search String: ", searchString);
    const questionsBySearchString = question.filter(q => q.title.includes(searchString));
    callback(null, { questions: questionsBySearchString });   
}

function GetQuestionByTypeAndSearchString(call, callback){
    const type = call.request.type;
    const searchString = call.request.searchString;
    console.log("Type: ", type);
    console.log("Search String: ", searchString);
    const questionsByTypeAndSearchString = question.filter(q => q.type == type && q.title.includes(searchString));
    callback(null, { questions: questionsByTypeAndSearchString });
}

const server = new gRPC.Server();
server.addService(questionPackage.QuestionService.service, {
    GetAllQuestions,
    GetQuestionByType,
    GetQuestionBySearchString,
    GetQuestionByTypeAndSearchString
});

server.bindAsync('localhost:4000', gRPC.ServerCredentials.createInsecure(), (error) => {
    if(error) {
        console.error(error);
        return;
    }
    console.log('Server is running on http://localhost:4000');
    server.start();
})