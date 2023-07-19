import React from "react";
import * as _Builtin from "./_Builtin";
import { Test } from "./Test";
import * as _utils from "./utils";
import _styles from "./TestComponent.module.css";

export function TestComponent({
  as: _Component = _Builtin.Block,
  assetNameTwo = "This is the default text value",
  assetMameThree,
  text = "This is the default text value",
}) {
  return (
    <_Component
      className={_utils.cx(_styles, "test-component")}
      tag="figure"
      id={assetMameThree}
    >
      <_Builtin.Image
        className={_utils.cx(_styles, "image")}
        loading="lazy"
        width="auto"
        height="auto"
        src="https://uploads-ssl.webflow.com/64ac4f0e4fd899bd9c0009aa/64ac4f90e1362303c87b7a99_Token%20Icon.svg"
      />
      <Test assetName={assetNameTwo} />
      <_Builtin.Block className={_utils.cx(_styles, "left-text")} tag="div">
        {"Ethereum"}
      </_Builtin.Block>
    </_Component>
  );
}
