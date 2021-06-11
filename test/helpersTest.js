const chai = require('chai');
const {findUserEmail} = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = findUserEmail(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    const assertEqual = function(actual, expected) {
      if (actual === expected) {
        console.log(`✅✅✅ Assertion Passed: ${actual} === ${expected}`);
      } else if (actual !== expected) {
        console.log(`🛑🛑🛑 Assertion Failed: ${actual} !== ${expected}`);
      }
    };
    assertEqual(testUsers["userRandomID"].email, "user@example.com")
  });
});