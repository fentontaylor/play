var app = require('../../app');

describe("MusixService", ()=> {
  it("can initialize", ()=> {
    let service = new MusixService("We Will Rock You", "Queen");
    expect(service).toBeInstanceOf(MusixService);
  })
})
