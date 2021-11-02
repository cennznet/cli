//create collection
//edit fields in data/collection.json

let keys = new keyring.Keyring({ type: "sr25519" });
let sudoKey = keys.addFromUri("//Alice");

let rawData = fs.readFileSync("./data/collection.json");
const collectionData = JSON.parse(rawData);

let createCollection = api.tx.nft.createCollection(
  collectionData.name,
  collectionData.metadata_base_uri,
  collectionData.royalties_schedule
);

await api.tx.sudo.sudo(createCollection).signAndSend(sudoKey);

//mass drop
//edit fields in data/mint-series.json and data/mass-drop.json

rawData = fs.readFileSync("./data/mint-series.json");
const mintSeriesData = JSON.parse(rawData);
console.log(mintSeriesData);

rawData = fs.readFileSync("./data/mass-drop.json");
const massDropData = JSON.parse(rawData);
console.log(massDropData);

const massDrop = await api.tx.nft.mintSeries(
  mintSeriesData.collection_id,
  mintSeriesData.quantity,
  mintSeriesData.ownerAddress,
  mintSeriesData.attributes,
  mintSeriesData.metadata_path,
  mintSeriesData.royalties_schedule,
  { ...massDropData }
);

await api.tx.sudo.sudo(massDrop).signAndSend(sudoKey);
