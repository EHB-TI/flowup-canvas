var chai = require("chai");
var assert = chai.assert;

const { createEvent,updateEvent, deleteEvent} = require("../API/events.js");
const { create_user, delete_user } = require("../API/users.js");
const { Event} = require("../DTO/event.js");
const {User} = require("../DTO/user.js");

describe('Events crud', function () {

  //Create a instance of User.
  let testUser = new User("testFirstname", "testLastname", "testEmail@ehb.be", undefined);
  let testEvent;

  let userID, eventID;

  // before hook that will run before all of the tests are run 
  before(async () => {

    //Create a user
    userID = await create_user(testUser.firstname, testUser.lastname, testUser.email);
    testUser.id = userID;

    //Create an instance of a event with the userID.
    testEvent = new Event("testEvent", "Event for Testing - description",undefined, testUser.id);

    //ID of the event is returned after the event is created.
    eventID = await createEvent(testEvent);

    // set the id of the object after creation
    testEvent.id = eventID;

  })


  describe('Create an event', function () {
    it('Should return the id of the event when no errors occur', () => {
      assert.typeOf(eventID, "number");
    })
  });


  describe('Update an event', function () {
    it('Should return the id of the event when no errors occur', async () => {


      let id = await updateEvent(testEvent);
      //ID of the event is returned after updating.
      assert.typeOf(id, "number");
    })

    it("Should return a 404 Http response because the EventID doesn't exist", async () => {

      //Instance of Event with a non-existing ID.
      let fakeEvent = new Event("testEventUpdated", "Event Updated - description", -1, testUser.id);

      // the test will fail so we will get the status back
      let status = await updateEvent(fakeEvent);

      assert.equal(status, 404);

    })

  });

  describe('Delete an event', function () {
    it('Should return a 200 Http response when no errors occur', async () => {

      let response = await deleteEvent(testEvent)
      //DELETE our testevent which was defined in the before hook
      assert.equal(response, 200);

    })

    it('Should return a 404 Http response when a non existing event is passed', async () => {

      let fakeEvent = new Event("fakeEvent", "This is a fake event", -1, testUser.id);
      let response = await deleteEvent(fakeEvent)
      //DELETE our testevent which was defined in the before hook
      assert.equal(response, 404);

    })
  });

  // hook that will be executed after all of the tests are executed
  after(async () => {

    // delete the user
    await delete_user(testUser.id);
  })
})