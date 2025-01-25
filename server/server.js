const gRPC = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('./../proto/question.proto', {});
const gRPCObject = gRPC.loadPackageDefinition(packageDefinition);

const questionPackage = gRPCObject.question;

const Question = require('./model');

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://vipindev665:bX0opTBpHPF9Qtz6@cluster0.jnbgy.mongodb.net').then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error(error);
} );


async function GetAllQuestions(call, callback) {
  try {
    const questions = await Question.find({}).limit(20);
    callback(null, { questions });
  } catch (err) {
    callback(err, null);
  }

}

async function GetQuestionByType(call, callback){
  try{
    const type = call.request.type;
    const questionByType = await Question.find({ type: type }).limit(20);
    callback(null, { questions: questionByType });
  }
  catch(err){
    callback(err, null);
  }
}

async function GetQuestionBySearchString(call, callback){
  try{
    const searchString = call.request.searchString;
    const questionBySearchString = await Question.find({ title: { $regex: searchString, $options: 'i' } }).limit(20);
    callback(null, { questions: questionBySearchString });
  }catch(err){
    callback(err, null);
  }
}

async function GetQuestionByTypeAndSearchString(call, callback){
  try{
    const type = call.request.type;
    const searchString = call.request.searchString;
    const questionByTypeAndSearchString = await Question.find({ type: type, title: { $regex: searchString, $options: 'i' } }).limit(20);
    callback(null, { questions: questionByTypeAndSearchString });
  } catch(err){
    callback(err, null);
  }
}

const server = new gRPC.Server();
server.addService(questionPackage.QuestionService.service, {
    GetAllQuestions,
    GetQuestionByType,
    GetQuestionBySearchString,
    GetQuestionByTypeAndSearchString
});

server.bindAsync('0.0.0.0:9090', gRPC.ServerCredentials.createInsecure(), (error) => {
    if(error) {
        console.error(error);
        return;
    }
    console.log('Server is running on http://0.0.0.0:9090');
    server.start();
})