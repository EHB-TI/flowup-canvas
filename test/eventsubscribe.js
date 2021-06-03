var chai = require("chai");
var assert = chai.assert;
const {createEvent,deleteEvent} = require("../API/events.js");
const {create_user, delete_user} = require("../API/users.js");
const {add_user_to_event, remove_user_from_event} = require("../API/eventsubscribe.js");

const { Event } = require("../DTO/event.js");
const { User } = require("../DTO/user.js");


describe("Evensubscribe Tests", function(){

  //Create a instance of User.
  let testUser = new User("testF","testL","testf.testl.@ehb.be",undefined);
  let testEvent, eventID, userID, subscriptionID;

before(async() => {

  
   //Create a user
   userID = await create_user(testUser.firstname,testUser.lastname,testUser.email);
   testUser.id = userID;

   //Create an instance of a event with the userID.
   testEvent = new Event("testEvent",["Event for Testing - description", "2021-05-25 23:00:00", "2021-05-27 02:00:00"],undefined,userID);

   //Create a event
   eventID = await createEvent(testEvent);

   //set the id of the event
   testEvent.id = eventID

   //ID of the subscription is returned after the user is subscribed to an event. 
   subscriptionID = await add_user_to_event(testEvent.id,testUser.id);
  
})


describe('Subscribe a user to an event', function() {
    it('Should return the id of the subscription when no errors occur',  async () => {
      assert.typeOf(subscriptionID,"number");
    })

    it("Should return a 404 Http response because the eventID and the userID don't exist ",  async () => {
      
      let httpResponse = await add_user_to_event("-3","-5");
      assert.equal(httpResponse,404);
  
      })
  });
  
  describe('Remove a user from an event', function() {
    it('Should return a 200 Http response when no errors occur',  async () => {
    
    let httpResponse = await remove_user_from_event(testEvent.id,testUser.id);  
    assert.equal(httpResponse,200);
    })

    it('Should return a 404 Http response when we try to remove a user from an event that does not exist',  async () => {
    
      let httpResponse = await remove_user_from_event(-1,testUser.id);  
      assert.equal(httpResponse,404);
      })
  });

  // hook that will be executed after all of the tests are executed
  after(async() => { 

    //Delete User
    await delete_user(userID);

    //Delete Event
    await deleteEvent(testEvent);
  });
  
});