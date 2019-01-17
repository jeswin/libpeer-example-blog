import masterNode = require("libpeer-masternode");
import cacheHandler = require("libpeer-peernode-cache-handler");

const instance = masterNode.createInstance();

/*
  This is the method called by clients to register itself
  as a cache provider to other peers.

  Peers will pass two parameters:
    1. Name of the caching bucket. eg: "latest-posts"
    2. Any relevant parameters. eg: 100
    The example above means that the peer can service latest-posts for say user-id 100.
*/
masterNode.registerRoute(instance, "/cache", cacheHandler);

/* 
  Routes 
  
  Define all the routes for the application.
*/

/* Return feed for a user */
async function readFeedFromDatabase() {
  return await ssb.readStream(id);
}

async function getFeed(id: string) {
  const peers = await cacheGetFeed(id);
  return peers.length ? peers : await readFeedFromDatabase(id);
}

async function cacheGetFeed(id: string) {
  return peerCache.getBucket("getFeed").filter((x: any) => x.id === id);
}

masterNode.registerRoute(instance, "/feed", getFeed);
masterNode.registerRoute(instance, "/cache/get-feed", cacheGetFeed);

/* Get latest posts for a user */

async function readLatestFromDatabase(id: string, count: number) {
  return [];
}

async function getLatest(id: string, count: number) {
  const peersWithLatest = await cacheGetLatest(id, count);
  return peersWithLatest.length > 2
    ? peersWithLatest
    : await (async function() {
        const peersWithFullFeed = await cacheGetFeed(id);
        return peersWithLatest.length + peersWithFullFeed.length > 2
          ? peersWithLatest.concat(peersWithFullFeed)
          : await readLatestFromDatabase(id, count);
      })();
}

async function cacheGetLatest(id: string, count: number) {
  return peerCache
    .buckets("getLatest")
    .filter((x: any) => x.id === id && x.count === count);
}

masterNode.registerRoute(instance, "/latest", getLatest);

const handlers = [homepageHandler];

function homepageHandler(id: string, params: any) {
  const findResource;
}

function homepageCache(): boolean {
  return false;
}

server.onRequest([]);

libpeer.init({
  appId: "abcdefgh",
  masters: ["m1pubkey", "m2pubkey"]
});

libpeer.getResources(["/posts/latest", "/blogroll"]).then((locations: any) => {
  const results = locations.find((x: any) => x.id === "/posts/latest").fetch();
  results.then((posts: any) => console.log(posts));
  results.then(libpeer.registerAsPeer("/posts/latest"));
});

/* server */
Server.defineResources([
  {
    resource: "/posts/latest",
    cache: { maxAge: 600 },
    handler: (req: any) => {}
  }
]);

libpeerserver.listen("/posts/latest", (req: any) => {
  req.respond("hello world");
});
