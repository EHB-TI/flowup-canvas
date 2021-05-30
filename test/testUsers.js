  
var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;


const {create_user, update_user, delete_user} = require("../API/users.js");
const { User } = require("../DTO/user.js");

//Create a instance of User.
let testUser = new User("testFirstname","testLastname","testEmail@ehb.be","12");

let UserID;

describe('Create a user', function() {
    it('Should return the id of the user when no errors occur',  async () => {
      
    
  
    //ID of the User is returned after the user is created. 
    userID = await create_user(testUser.firstname,testUser.lastname,testUser.email,"1");
  
    
    assert.typeOf(userID,"number");
  
  
    })
  });
  
  
  
  describe('Create a user - 2', function() {
    it('Should return a "400" Http response because a user with this email already exists',  async () => {
      
    
    assert.equal(await create_user(testUser.firstname,testUser.lastname,testUser.email),400)
    
    })
  });


  describe('Update a user', function() {
    it('Should return the id of the user when no errors occur',  async () => {
    
    //ID of the User is returned after the user is updated. 
    userID = await update_user(testUser.firstname,testUser.lastname,testUser.email,userID);
  
     
    assert.typeOf(userID,"number");
  
  
    })
  });
  
  
  describe('Delete a user', function() {
    it('Should return a 200 Http response message when no errors occur',  async () => {
    
  
    assert.equal(await delete_user(userID),200);
  
  
    })
  });
  
  
  describe('Delete a user - 2', function() {
    it("Should return a 404 Http response because the userID don't exists",  async () => {
    
  
    assert.equal(await delete_user(-1),404);
  
  
    })
  });
  
  