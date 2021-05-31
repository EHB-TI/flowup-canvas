var chai = require("chai");
var assert = chai.assert;

const {create_user, update_user, delete_user} = require("../API/users.js");
const {User} = require("../DTO/user.js");

describe('Users Crud Test', function(){

  let userID;
  let testUser = new User("test","test2","test@ehb.be",undefined);


  // before hook that will run before all of the tests are run to create a user
  before(async () => {
    userID = await create_user(testUser.firstname,testUser.lastname,testUser.email);
    testUser.id = userID;
  });

  describe('Create a user', function() {
    it('Should return the id of the user when no errors occur',  async () => {
      
    assert.typeOf(userID,"number");

    })

    it('Should return a "400" Http response because a user with this email already exists',  async () => {
      
      let status = await create_user(testUser.firstname,testUser.lastname,testUser.email);
      assert.equal(status,400)
      
      })
  });

  describe('Update a user', function() {
    it('Should return the id of the user when no errors occur',  async () => {
    
    //ID of the User is returned after the user is updated. 
    userID = await update_user(testUser.firstname,testUser.lastname,testUser.email,testUser.id);
  
     
    assert.typeOf(userID,"number");
  
  
    })

    it('Should return a 404 http response when we try to update a user that does not exist',  async () => {
    
      //Error code 
      let response = await update_user(testUser.firstname,testUser.lastname,testUser.email,-1);
    
       
      assert.equal(response,404);
    
      })
  });
  
  
  describe('Delete a user', function() {

    it('Should return a 200 Http response message when no errors occur',  async () => {
    
      let status = await delete_user(userID);
      assert.equal(status,200);
  
  
    })

    it("Should return a 404 Http response because the userID doesn't exist",  async () => {
    
      let status = await delete_user(-1);
    
      assert.equal(status,404);
    
    
      })
  });
})

  