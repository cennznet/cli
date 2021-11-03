const keys = new keyring.Keyring({ type: "sr25519" });
const sudoKey = keys.addFromUri("//YourSudoKey");

// Create collection
// Edit fields in data/collection.json
let rawData = fs.readFileSync("./data/collection.json");
const collectionData = JSON.parse(rawData);

await api.tx.nft
  .createCollection(
    collectionData.name,
    collectionData.metadata_base_uri,
    collectionData.royalties_schedule
  )
  .signAndSend(sudoKey);

// Mass drop
// Edit fields in data/mint-series.json and data/mass-drop.json
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
