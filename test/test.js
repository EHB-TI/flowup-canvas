
var chai = require("chai");
var assert = chai.assert;
var expect = chai.expect;

const {createEvent, updateEvent, deleteEvent} = require("../API/events.js");
const {create_user, update_user, delete_user} = require("../API/users.js");
const {add_user_to_event, remove_user_from_event} = require("../API/eventsubscribe.js");

const { Event } = require("../DTO/event.js");
const { User } = require("../DTO/user.js");
const { EventSubscription } = require("../DTO/eventsubscription.js");


//Run each test by executing "npm test" command in terminal


//Create a instance of User.
let testUser = new User("testFirstname","testLastname","testEmail@ehb.be","12");


let eventID;
let UserID;
let subscriptionEvent;


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

/*

describe('Create an event', function() {
      it('Should return the id of the event when no errors occur',  async () => {
        
      //Create an instance of a event.
      let testEvent = new Event("testEvent","Event for Testing - description","1",userID);


      
      //ID of the event is returned after the event is created.
      eventID = await createEvent(testEvent);
      console.log(eventID);

      })
    });



describe('Subscribe a user to an event', function() {
  it('Should return the id of the subscription when no errors occur',  async () => {
    
  

  //ID of the subscription is returned after the user is subscribed to an event. 
  subscriptionID = await add_user_to_event(eventID,userID);

  
  assert.typeOf(subscriptionID,"number");


  })
});


describe('Subscribe a user to an event - 2', function() {
  it("Should return a 401 Http response because an event or user with this ID don't exists",  async () => {
    
  

  assert.equal(await add_user_to_event(eventID,"5"),401)
  

  })
});


describe('Subscribe a user to an event - 3', function() {
  it("Should return a 404 Http response because the eventID and the userID don't exists ",  async () => {
    
  

  assert.equal(await add_user_to_event("3","5"),404)
  

  })
});




describe('Remove a user from an event', function() {
  it('Should return a 200 Http response when no errors occur',  async () => {
    
  
  let httpResponse = await remove_user_from_event(eventID,userID);


  assert.equal(httpResponse,200);


  })
});


describe('Remove a user from an event - 2', function() {
  it("Should return a 404 Http response because the eventID and the userID don't exists",  async () => {
    
  

  //HttpResponse status is returned because the user an error is thrown. 
  let httpResponse = await remove_user_from_event(eventID,userID);



  
  assert.equal(httpResponse,404);


  })
});



describe('Update an event', function() {
  it('Should return the id of the event when no errors occur',  async () => {
    
  //Instance of Event with the id of the created Event.
  let testEvent = new Event("testEventUpdated","Event Updated - description",eventID,userID);

  //ID of the event is returned after updating.
  assert.typeOf(await updateEvent(testEvent),"number");


  })
});



describe('Delete an event', function() {
it('Should return the id of the event when no errors occur',  async () => {

//Instance of Event with the id of the created Event.
let testEvent = new Event("testEvent","Event for Testing - description",eventID,"120");

//ID of the event is returned after deleting.
assert.typeOf(await deleteEvent(testEvent),"number");


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



*/




   

    

