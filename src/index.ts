import libpeer = require("libpeer");

libpeer.init({
  appId: "abcdefgh",
  masters: ["m1pubkey", "m2pubkey"]
});

const apiLocations = libpeer.getAPILocations("/posts/latest");


