const MNEMONIC = 'sample split bamboo west visual approve brain fox arch impact relief smile';
let k = new keyring.Keyring({ type: 'sr25519' });
k.setSS58Format(64);
console.log(k.createFromUri(MNEMONIC).address);
for(i = 0; i < 1000; i++) {
  let m = hashing.mnemonicGenerate();
  console.log(k.createFromUri(m).address);
}

