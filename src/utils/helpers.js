import numeral from 'numeral';

export function formatNumberAlphabetical(number, decimals = 0) {
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;

  const parsedNumber = parseFloat(number); // Parse the string to a number

  if (Math.abs(parsedNumber) >= billion) {
    return (parsedNumber / billion).toFixed(decimals) + 'B';
  } else if (Math.abs(parsedNumber) >= million) {
    return (parsedNumber / million).toFixed(decimals) + 'M';
  } else if (Math.abs(parsedNumber) >= thousand) {
    return (parsedNumber / thousand).toFixed(decimals) + 'K';
  }

  return parsedNumber.toFixed(decimals);
}

export function getLTVRatio(
  totalCollateral,
  collateralPrice,
  totalDebt,
  debtPrice
) {
  const collateralValue = totalCollateral * collateralPrice;
  const debtValue = totalDebt * debtPrice;

  const ltvRatio = (debtValue / collateralValue) * 100;

  if (isNaN(ltvRatio)) return 0;
  return parseFloat(ltvRatio.toFixed(2));
}

export const getAccountString = (account) => {
  const len = account.length;
  return `0x${account.substr(2, 3).toUpperCase()}...${account
    .substr(len - 3, len - 1)
    .toUpperCase()}`;
};

export const formatNumber = (value, digits = 4, round = false) => {
  const nOfDigits = Array.from(Array(digits), (_) => 0).join('');
  if (!value) {
    return '0';
  }
  const n = Number(value);
  if (n < 0) return value;
  if (Number.isInteger(n) || value.length < 5) {
    return n;
  }
  let val;
  if (round) {
    val = numeral(n).format(`0.${nOfDigits}`);
  } else {
    val = numeral(n).format(`0.${nOfDigits}`, Math.floor);
  }

  return isNaN(Number(val)) ? value : val;
};

export const getCollateralRatio = (
  totalCollateral,
  totalDebt,
  liquidationPrice,
  liquidationCRatio
) => {
  if (Number(totalCollateral) === 0) {
    return '0';
  } else if (Number(totalDebt) === 0) {
    return '∞';
  }
  const denominator = numeral(totalDebt).value();

  const numerator = numeral(totalCollateral)
    .multiply(liquidationPrice)
    .multiply(liquidationCRatio);

  const value = numerator.divide(denominator).multiply(100);

  return formatNumber(value.value().toString(), 2, true);
};

export const getLiquidationPrice = (
  totalCollateral,
  totalDebt,
  liquidationCRatio,
  currentRedemptionPrice
) => {
  if (Number(totalCollateral) === 0) {
    return '0';
  } else if (Number(totalDebt) === 0) {
    return '0';
  }

  const numerator = numeral(totalDebt)
    .multiply(liquidationCRatio)
    .multiply(currentRedemptionPrice)
    .divide(totalCollateral);

  return formatNumber(numerator.value().toString(), 2);
};

export const getActivityName = (debt, collateral) => {
  if (debt != 0 && collateral != 0) {
    if (Math.sign(debt) == 1) {
      return Math.sign(collateral) == 1
        ? 'Mint RAI & Deposit ETH'
        : 'Mint RAI & Withdraw ETH';
    } else {
      return Math.sign(collateral) == 1
        ? 'Burn RAI & Deposit ETH'
        : 'Burn RAI & Withdraw ETH';
    }
  } else if (debt != 0) {
    return Math.sign(debt) == 1 ? 'Mint RAI' : 'Burn RAI';
  } else if (collateral != 0) {
    return Math.sign(collateral) == 1 ? 'Deposit ETH' : 'Withdraw ETH';
  } else {
    return 'No change';
  }
};

export const getActivityBool = (debt, collateral) => {
  if (Math.sign(debt) == -1 && collateral == 0) {
    return 'increase';
  } else if (Math.sign(debt) == 1 && collateral == 0) {
    return 'decrease';
  } else if (Math.sign(debt) == -1 && Math.sign(collateral) == -1) {
    return 'none';
  } else if (Math.sign(collateral) == -1 && debt == 0) {
    return 'decrease';
  } else if (Math.sign(collateral) == 1 && debt == 0) {
    return 'increase';
  } else {
    return 'none';
  }
};

export const getFormattedTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDate = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  return formattedDate;
};
