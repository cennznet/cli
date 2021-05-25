let controllers = [
    "5CkBjPtvJEHf3kNE9wWZEvcZoRHuj48UURXAhbSpoyCe3U83",
    "5HYh2nx41ViNRdCf1mWkVk4dTtGnDQwF2BFo6urRfCxhZYCs",
    "5DoZ3fwdTjvo8EZAVkZLPMkWAEwMpvDX7TUvYrohFUTbQpWN",
    "5FCdFHNPR62USs3xeA8Pnj2D87n4RLG1xRB2jS4tbcs7t19j",
    "5GZRKvW4jVZzx6Z2kvVhE8V81fj4yeLJFJtPvATGPfdVSJxm",
    "5FpNQ5NfhhRMyE1BMCy7fwPXHtd8ht6mME64AFr58y2ehesc",
    "5Cm8JHz75TZw5GAAwVV99qFJKPYtxXsP2hn811WpWLo4UDjG",
    "5CouA8pyo3d5g3rxCL3GxM3tbtMnoUkatxCDFtqmC9u8odgf",
    "5CFNYab6UKkZJ87WpW3WVbG8huwpKczvCYpZyrwH37uFj2QM",
    "5FH8TLGKiGKxrv94QcvcCarpUhRL8jjXWPntDScXiibeRg7u"
// "5EtMYS8K1scZHLyoCBsAPYtYZVsTLspNK9QHFAoDS2g3998N",
// "5DFM1ryjowiHdK5JYvrcn544u2F4nin6D3puFJS4YWfcf4Tn",
// "5DhWKuBBe6U4knnnBcthGr4hSC9FJ28UWAaUc1EuFc9VwK8U",
// "5CqT6XgpU6cHxjUZ5cSjm3eWajSFSMbwGMHLwoTfG9yPHbTB",
// "5DkCuJThfmv6kdRe5f2ua2s9orrcKs4goyAuhAxQ9z66uoHv",
// "5D7f7rDvTp9BeKqGJuwmXRbDU6Cubaa3RUvXGXZ9zer1RLPs",
// "5HZGPu42xmLgvUiZy4RnCxRUkkGCBV6GhmXDVuy5i54eaPCz",
// "5CCgsWqDyJ9nwrf8Pb6THGMLkuTKEun5XDsikT7zQF7JukC4",
// "5ERy9BPiSL3uPCEXoAKUBCC5hRyzVkU7vW1rWDjJK1SdJzjc",
// "5HYRK35zUMhtJcRrTvLgesRWhNSgoTUB3PSoNYuqMGhsh9TM"
];
let payee =  "5FGvAkJKEFwXdjiFtL8uatVKP4Lvzfn68BvZp4HHgT8KKpXc";
let payee_ = api.createType('RewardDestination', {'account': payee}).toHex();

let keys = controllers.reduce(function(map, controller) {
    console.log(controller);
    let key = api.query.staking.payee.key(controller);
    map[key] = payee_;
    return map
}, {});

console.log(keys);