import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./DepositCollateralInput.module.css";

export function DepositCollateralInput({
  as: _Component = _Builtin.FormTextInput,
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "formfield")}
      autoFocus={false}
      maxLength={256}
      name="DepositCollateralInput"
      data-name="DepositCollateralInput"
      placeholder="0.00 stETH"
      type="number"
      disabled={false}
      required={false}
      id="DepositCollateralInput-2"
    />
  );
}
