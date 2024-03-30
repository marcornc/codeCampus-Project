import { test, expect /*, afterAll, teardown */ } from "vitest";
import supertest from "supertest";
import { resetAllTables } from "../db/helpers.js";
import app from "../app.js";
import { data } from "../db/data.js";

// Testing GET all events
test("GET /events", async () => {
  //reset database and pass in data
  await resetAllTables(data);
  const response = await supertest(app).get("/events");
  // Response body	{ success: true, payload: an array of events objects }
  const responseBody = response.body;
  console.log(responseBody);
  // check body is success an dia an array
  expect(responseBody.success).toBeTruthy();
  expect(Array.isArray(responseBody.payload)).toBeTruthy;
  //console.log(responseBody.payload);
  //Response status	200
  const responseStatusCode = response.statusCode;
  expect(responseStatusCode).toBe(200);
  //Response header	Content-Type header should contain application/json
  const responseType = response.type;
  expect(responseType).toBe("application/json");
});


// Testing sorting order of GET /events
test("GET /events - sorting order", async () => {
  // Reset database, send get request, check response status is success and body is array
  await resetAllTables(data);
  const response = await supertest(app).get("/events");
  const responseBody = response.body;
  console.log(responseBody.payload);
  expect(responseBody.success).toBeTruthy();
  expect(Array.isArray(responseBody.payload)).toBeTruthy();
  // Creating empty array to store extracted dates for test
  const eventDates = [];
//console.log(responseBody.payload)
  // for loop to extract date from each event and add to array
  const eventArray = responseBody.payload;
  //console.log(eventArray);
  for (const event of eventArray) {
    eventDates.push(event.date); // This line is adding the date property of event object to the event array
  }

  // for loop to check the dates are in ascending order
  // Because we are comparing the current event with previous event, we start with i = 1. If we used 0, this would lead us into a negative index when i reaches the last element and so we would have to write code to handle that
  for (let i = 1; i < eventDates.length; i++) {
    const previousDate = new Date(eventDates[i -1]); // new keyword is creating a date object so we can compare the dates
    const currentDate = new Date(Date.parse(eventDates[i])); // originally just had eventDates[i] in parameters but test kept failing. Console.logging revealed that previousDate was being intepreted as a date, but test was failing on first currentDate and returning 'invalid date'. In the console there seemed to be nothing wrong with the format, however .parse method is used to convert date into valid format and test now passes.
    console.log("Previous Date:", previousDate, "Current Date:", currentDate);
    expect(currentDate >= previousDate).toBeTruthy()
  }

  expect(response.statusCode).toBe(200);
  expect(response.type).toBe("application/json");
})


// Testing /events/social endpoint

test("GET /events/social", async () => {
  // Reset database so possible changes won't effect test results
  await resetAllTables(data);
  // Send GET request to social endpoint, store in response variable
  const response = await supertest(app).get("/events/social");
  // Response body should contain success and payload array
  const responseBody = response.body;
  expect(responseBody.success).toBeTruthy();
  expect(Array.isArray(responseBody.payload)).toBeTruthy();
  // Check that all events are of type 'Social'
  const socialEvents = responseBody.payload;
  for (const event of socialEvents) {
    expect(event.event_type).toBe("Social");
  }
  // Check statuscode and header
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe("application/json");
    });

// Test /events/tech endpoint

test("GET /events/tech", async () => {
  await resetAllTables(data);
  const response = await supertest(app).get("/events/tech");
  const responseBody = response.body;
  expect(responseBody.success).toBeTruthy();
  expect(Array.isArray(responseBody.payload)).toBeTruthy();
  const techEvents = responseBody.payload;
  for (const event of techEvents) {
    expect(event.event_type).toBe("Tech");
  }
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json")
  });


  // Test /events/online endpoint

  // Test /events/tech endpoint

test("GET /events/online", async () => {
  await resetAllTables(data);
  const response = await supertest(app).get("/events/online");
  const responseBody = response.body;
  expect(responseBody.success).toBeTruthy();
  expect(Array.isArray(responseBody.payload)).toBeTruthy();
  const techEvents = responseBody.payload;
  for (const event of techEvents) {
    expect(event.event_type).toBe("Online");
  }
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe("application/json")
  });
