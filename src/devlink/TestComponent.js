import React from "react";
import * as _Builtin from "./_Builtin";
import * as _utils from "./utils";
import _styles from "./TestComponent.module.css";

export function TestComponent({ as: _Component = _Builtin.Block }) {
  return (
    <_Component className={_utils.cx(_styles, "test-component")} tag="div">
      <_Builtin.Image
        className={_utils.cx(_styles, "image")}
        loading="lazy"
        width="auto"
        height="auto"
        src="https://uploads-ssl.webflow.com/64ac4f0e4fd899bd9c0009aa/64ac4f90e1362303c87b7a99_Token%20Icon.svg"
      />
      <_Builtin.Block className={_utils.cx(_styles, "text-block")} tag="div">
        {"Ethereum"}
      </_Builtin.Block>
      <_Builtin.Block className={_utils.cx(_styles, "left-text")} tag="div">
        {"Ethereum"}
      </_Builtin.Block>
    </_Component>
  );
}
