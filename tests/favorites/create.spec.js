var shell = require('shelljs');
var request = require("supertest");
var app = require('../../app');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../../knexfile')[environment];
const database = require('knex')(configuration);

describe("Test POST to favorites", () => {
  beforeEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  afterEach(async () => {
    await database.raw("TRUNCATE TABLE favorites CASCADE");
  });

  it("happy path", async () => {
    const body = {
      "id": 1,
      "title": "We Will Rock You",
      "artistName": "Queen",
      "genre": "Rock",
      "rating": 88
    }
    const res = await request(app).post("/api/v1/favorites", body)

    expect(res.statusCode).toBe(201)
  })
})