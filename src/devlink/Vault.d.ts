import * as React from "react";
import * as Types from "./types";

declare function Vault(props: {
  as?: React.ElementType;
  collateralAmount?: React.ReactNode;
  createVaultFormButton?: Types.Devlink.RuntimeProps;
  balanceToken?: React.ReactNode;
  balanceTokenUsd?: React.ReactNode;
  depositCollateralUsd?: React.ReactNode;
  slotTest?: Types.Devlink.Slot;
  borrowed?: React.ReactNode;
  collateralRatio?: React.ReactNode;
}): React.JSX.Element;
