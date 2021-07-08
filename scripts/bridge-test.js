    let claim = {
         address: "0x1215b4ec8161b7959a115805bf980e57a085c3e5",
         amount: "1234",
         beneficiary: "0xacd6118e217e552ba801f7aa8a934ea6a300a5b394e7c3f42cd9d6dd9a457c10"
    };
    let result = await api.tx.ethBridge.depositClaim('0x18d8416388a673afec2b0b8b56f2bd47d155b1cd0a4287414a823bfeb58a6b77', claim).signAndSend(toyKeyring.alice);
