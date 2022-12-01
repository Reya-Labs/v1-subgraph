export const getProtocolPrefix = (protocolId: number): string => {
  switch (protocolId) {
    case 1: {
      return 'Aave';
    }
    case 2: {
      return 'Compound';
    }
    case 3: {
      return 'Lido';
    }
    case 4: {
      return 'Rocket';
    }
    case 5: {
      return 'Aave borrow';
    }
    case 6: {
      return 'Compound borrow';
    }
    default: {
      return '-';
    }
  }
};
