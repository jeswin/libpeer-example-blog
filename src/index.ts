import libpeer = require("libpeer");

const Cache = libpeer.Cache;
const MasterNode = libpeer.MasterNode;

async function readFeedFromDatabase() {
  return await ssb.readStream(id);
}

async function getFeed(id: string) {
  const peers = await cache.getFeed({ id });
  return peers.length ? peers : await readFeedFromDatabase(id);
}

async function readLatestFromDatabase(id: string, count: number) {
  return [];
}

async function getLatest(id: string, count: number) {
  const peersWithLatest = await cache.getLatest({ id, count });
  return peersWithLatest.length > 2
    ? peersWithLatest
    : await (async function() {
        const peersWithFullFeed = await cache.getFeed({ id });
        return peersWithLatest.length + peersWithFullFeed.length > 2
          ? peersWithLatest.concat(peersWithFullFeed)
          : await readLatestFromDatabase(id, count);
      })();
}

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
