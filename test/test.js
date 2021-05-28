
var chai = require("chai");
var assert = chai.assert;

const {createEvent, updateEvent, deleteEvent} = require("../API/events.js");
const {create_user, update_user, delete_user} = require("../API/users.js");
const {add_user_to_event, remove_user_from_event} = require("../API/eventsubscribe.js");

const { Event } = require("../DTO/event.js");
const { User } = require("../DTO/user.js");
const { EventSubscription } = require("../DTO/eventsubscription.js");

//Create a instance of User.
let testUser = new User("testFirstname","testLastname","testEmail@ehb.be","12");


let eventID;
let UserID;
let subscriptionEvent;



describe('Create an event', function() {
      it('Should return the id of the event when no errors occur',  async () => {
        
      //Create an instance of a event.
      let testEvent = new Event("testEvent","Event for Testing - description","1","120");


      
      //ID of the event is returned after the event is created.
      eventID = await createEvent(testEvent);
      console.log(eventID);

      })
    });




describe('Create a user', function() {
  it('Should return the id of the user when no errors occur',  async () => {
    
  

  //ID of the User is returned after the user is created. 
  userID = await create_user(testUser.firstname,testUser.lastname,testUser.email);

  
  assert.typeOf(userID,"number");


  })
});


describe('Subscribe a user to an event', function() {
  it('Should return the id of the subscription when no errors occur',  async () => {
    
  

  //ID of the subscription is returned after the user is subscribed to an event. 
  subscriptionID = await add_user_to_event(eventID,userID);

  
  assert.typeOf(subscriptionID,"number");


  })
});


describe('remove a user from an event', function() {
  it('Should return the a true message when no errors occur',  async () => {
    
  

  //True is returned after the user is removed from an event. 
  let bool = await remove_user_from_event(eventID,userID);



  
  assert.equal(bool,true);


  })
});



describe('Update an event', function() {
  it('Should return the id of the event when no errors occur',  async () => {
    
  //Instance of Event with the id of the created Event.
  let testEvent = new Event("testEventUpdated","Event Updated - description",eventID,"120");

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
  it('Should return a "ok" message of the user when no errors occur',  async () => {
  


  //Status "ok" is returned by the delete function. 
  assert.equal(await delete_user(userID),"ok");


  })
});



   

    

