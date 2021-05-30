var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;

const {createEvent, updateEvent, deleteEvent} = require("../API/events.js");
const {create_user, delete_user} = require("../API/users.js");


const { Event } = require("../DTO/event.js");
const { User } = require("../DTO/user.js");



//Run each test by executing "npm test" command in terminal


//Create a instance of User.
let testUser = new User("testFirstname","testLastname","testEmail@ehb.be","12");
let testEvent;

let userID,eventID;



describe('Create an event', function() {
    it('Should return the id of the event when no errors occur',  async () => {

    //Create a user
    userID = await create_user(testUser.firstname,testUser.lastname,testUser.email,"1");
      
    //Create an instance of a event with the userID.
    testEvent = new Event("testEvent","Event for Testing - description","1",userID);

    
    //ID of the event is returned after the event is created.
    eventID = await createEvent(testEvent);


    assert.typeOf(await updateEvent(testEvent),"number");
    

    })
  });


  describe('Update an event', function() {
    it('Should return the id of the event when no errors occur',  async () => {
      
    //Instance of Event with the ID of the created Event.
    testEvent = new Event("testEventUpdated","Event Updated - description",eventID,userID);
  
    //ID of the event is returned after updating.
    assert.typeOf(await updateEvent(testEvent),"number");
  
  
    })
  });


  describe('Update an event - 2', function() {
    it("Should return a 404 Http response because the userID don't exists",  async () => {
      
    //Instance of Event with a non-existing ID.
    let testEvent = new Event("testEventUpdated","Event Updated - description",-1,userID);

  
    assert.equal(await updateEvent(testEvent),404);
  
  
    })
  });
  
  
  
  describe('Delete an event', function() {
  it('Should return a 200 Http response when no errors occur',  async () => {
  
  //Instance of Event with the ID of the created Event.
  let testEvent = new Event("testEvent","Event for Testing - description",eventID,userID);

  //Delete the user for other tests
  await delete_user(userID);
  
  //ID of the event is returned after deleting.
  assert.equal(await deleteEvent(testEvent),200);
  
  
  })
  });
  
  