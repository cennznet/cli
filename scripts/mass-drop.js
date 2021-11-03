//create collection
//edit fields in data/collection.json

let keys = new keyring.Keyring({ type: "sr25519" });
let sudoKey = keys.addFromUri("//YourSudoKey");

let rawData = fs.readFileSync("./data/collection.json");
const collectionData = JSON.parse(rawData);

await api.tx.nft
  .createCollection(
    collectionData.name,
    collectionData.metadata_base_uri,
    collectionData.royalties_schedule
  )
  .signAndSend(sudoKey);

//mass drop
//edit fields in data/mint-series.json and data/mass-drop.json

rawData = fs.readFileSync("./data/mint-series.json");
const mintSeriesData = JSON.parse(rawData);

rawData = fs.readFileSync("./data/mass-drop.json");
const massDropData = JSON.parse(rawData);

await api.tx.nft
  .mintSeries(
    mintSeriesData.collection_id,
    mintSeriesData.quantity,
    mintSeriesData.owner_address,
    mintSeriesData.attributes,
    mintSeriesData.metadata_path,
    mintSeriesData.royalties_schedule,
    { ...massDropData }
  )
  .signAndSend(sudoKey);
