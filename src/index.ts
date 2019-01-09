import libpeer = require("libpeer");
import { Server } from "http";

libpeer.init({
  appId: "abcdefgh",
  masters: ["m1pubkey", "m2pubkey"]
});

libpeer
  .getResources(["/posts/latest", "/blogroll"])
  .then((locations: any) => {
    const results = locations
      .find((x: any) => x.id === "/posts/latest")
      .fetch();
    results.then((posts: any) => console.log(posts));
    results.then(libpeer.registerAsPeer("/posts/latest"));
  });

/* server */
Server.defineResources([
  { resource: "/posts/latest", cache: { maxAge: 600 }, handler: (req: any) => {} }
]);
libpeerserver.listen("/posts/latest", (req: any) => {
  req.respond("hello world");
});
