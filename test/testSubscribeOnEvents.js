  
var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;

const {createEvent,deleteEvent} = require("../API/events.js");
const {create_user, delete_user} = require("../API/users.js");
const {add_user_to_event, remove_user_from_event} = require("../API/eventsubscribe.js");

const { Event } = require("../DTO/event.js");
const { User } = require("../DTO/user.js");
const { EventSubscription } = require("../DTO/eventsubscription.js");


//Run each test by executing "npm test" command in terminal


//Create a instance of User.
let testUser = new User("testFirstname","testLastname","testEmail@ehb.be","12");
let testEvent;



let eventID;
let UserID;
let subscriptionID;


describe('Subscribe a user to an event', function() {
    it('Should return the id of the subscription when no errors occur',  async () => {
      
    //Create a user
    userID = await create_user(testUser.firstname,testUser.lastname,testUser.email,"1");

    //Create an instance of a event with the userID.
    testEvent = new Event("testEvent","Event for Testing - description","1",userID);

    //Create a event
    eventID = await createEvent(testEvent);

  
    //ID of the subscription is returned after the user is subscribed to an event. 
    subscriptionID = await add_user_to_event(eventID,userID);
  
    
    assert.typeOf(subscriptionID,"number");
  
  
    })
  });
  
  
  describe('Subscribe a user to an event - 2', function() {
    it("Should return a 401 Http response because an event or user with this ID don't exists or the user is already subscribed",  async () => {
      
    
  
    assert.equal(await add_user_to_event(eventID,"5"),401)
    
  
    })
  });
  
  
  describe('Subscribe a user to an event - 3', function() {
    it("Should return a 404 Http response because the eventID and the userID don't exists ",  async () => {
      
    
  
    assert.equal(await add_user_to_event("-3","-5"),404)
    
  
    })
  });
  
  
  
  
  describe('Remove a user from an event', function() {
    it('Should return a 200 Http response when no errors occur',  async () => {
      
    
    let httpResponse = await remove_user_from_event(eventID,userID);

    //Delete User
    await delete_user(userID);

    //Delete Event
    await deleteEvent(testEvent);
  
  
    assert.equal(httpResponse,200);
  
  
    })
  });
   