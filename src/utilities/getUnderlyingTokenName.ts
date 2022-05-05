const getUnderlyingTokenName = (address: string): string => {
  // Aave
  if (address.toLowerCase().includes('0x016750ac630f711882812f24dba6c95b9d35856d'.toLowerCase())) {
    return 'TUSD';
  }
  if (address.toLowerCase().includes('0x075a36ba8846c6b6f53644fdd3bf17e5151789dc'.toLowerCase())) {
    return 'UNI';
  }
  if (address.toLowerCase().includes('0x13512979ade267ab5100878e2e0f485b568328a4'.toLowerCase())) {
    return 'USDT';
  }
  if (address.toLowerCase().includes('0x2d12186fbb9f9a8c28b3ffdd4c42920f8539d738'.toLowerCase())) {
    return 'BAT';
  }
  if (address.toLowerCase().includes('0x3e0437898a5667a4769b1ca5a34aab1ae7e81377'.toLowerCase())) {
    return 'AMPL';
  }
  if (address.toLowerCase().includes('0x3f80c39c0b96a0945f9f0e9f55d8a8891c5671a8'.toLowerCase())) {
    return 'KNC';
  }
  if (address.toLowerCase().includes('0x4c6e1efc12fdfd568186b7baec0a43fffb4bcccf'.toLowerCase())) {
    return 'BUSD';
  }
  if (address.toLowerCase().includes('0x5eebf65a6746eed38042353ba84c8e37ed58ac6f'.toLowerCase())) {
    return 'REN';
  }
  if (address.toLowerCase().includes('0x61e4cae3da7fd189e52a4879c7b8067d7c2cc0fa'.toLowerCase())) {
    return 'MKR';
  }
  if (address.toLowerCase().includes('0x738dc6380157429e957d223e6333dc385c85fec7'.toLowerCase())) {
    return 'MANA';
  }
  if (address.toLowerCase().includes('0x7fdb81b0b8a010dd4ffc57c3fecbf145ba8bd947'.toLowerCase())) {
    return 'SNX';
  }
  if (address.toLowerCase().includes('0x99b267b9d96616f906d53c26decf3c5672401282'.toLowerCase())) {
    return 'sUSD';
  }
  if (address.toLowerCase().includes('0xad5ce863ae3e4e9394ab43d4ba0d80f419f61789'.toLowerCase())) {
    return 'LINK';
  }
  if (address.toLowerCase().includes('0xb597cd8d3217ea6477232f9217fa70837ff667af'.toLowerCase())) {
    return 'AAVE';
  }
  if (address.toLowerCase().includes('0xb7c325266ec274feb1354021d27fa3e3379d840d'.toLowerCase())) {
    return 'YFI';
  }
  if (address.toLowerCase().includes('0xc64f90cd7b564d3ab580eb20a102a8238e218be2'.toLowerCase())) {
    return 'ENJ';
  }
  if (address.toLowerCase().includes('0xd0a1e359811322d97991e03f863a0c30c2cf029c'.toLowerCase())) {
    return 'WETH';
  }
  if (address.toLowerCase().includes('0xd0d76886cf8d952ca26177eb7cfdf83bad08c00c'.toLowerCase())) {
    return 'ZRX';
  }
  if (address.toLowerCase().includes('0xd1b98b6607330172f1d991521145a22bce793277'.toLowerCase())) {
    return 'WBTC';
  }
  if (address.toLowerCase().includes('0xe22da380ee6b445bb8273c81944adeb6e8450422'.toLowerCase())) {
    return 'USDC';
  }
  if (address.toLowerCase().includes('0xff795577d9ac8bd7d90ee22b6c1703490b6512fd'.toLowerCase())) {
    return 'DAI';
  }

  // Compound
  if (address.toLowerCase().includes('0xb7a4F3E9097C08dA09517b5aB877F7a917224ede'.toLowerCase())) {
    return 'USDC';
  }
  if (address.toLowerCase().includes('0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'.toLowerCase())) {
    return 'DAI';
  }
  if (address.toLowerCase().includes('0x482dC9bB08111CB875109B075A40881E48aE02Cd'.toLowerCase())) {
    return 'BAT';
  }
  if (address.toLowerCase().includes('0x07de306ff27a2b630b1141956844eb1552b956b5'.toLowerCase())) {
    return 'TUSD';
  }
  if (address.toLowerCase().includes('0x162c44e53097e7B5aaE939b297ffFD6Bf90D1EE3'.toLowerCase())) {
    return 'ZRX';
  }

  return 'UNKNOWN';
};

export default getUnderlyingTokenName;
