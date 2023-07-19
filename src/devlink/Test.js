import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./Test.module.css";

export function Test({
  as: _Component = _Builtin.Block,
  assetName = "This is the default text value",
  asset,
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "text-block")}
      tag="div"
      id={asset}
    >
      {assetName}
    </_Component>
  );
}
