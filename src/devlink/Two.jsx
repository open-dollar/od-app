import React from "react";
import * as _Builtin from "./_Builtin";
import * as _interactions from "./interactions";
import { DepositCollateralInput } from "./DepositCollateralInput";
import * as _utils from "./utils";
import _styles from "./Two.module.css";

const _interactionsData = JSON.parse(
  '{"events":{"e":{"id":"e","name":"","animationType":"custom","eventTypeId":"MOUSE_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a","affectedElements":{},"playInReverse":false,"autoStopEventId":"e-2"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"0a40dfc2-38d8-f364-3969-0e893aa534ac","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"0a40dfc2-38d8-f364-3969-0e893aa534ac","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1689716621006},"e-2":{"id":"e-2","name":"","animationType":"custom","eventTypeId":"MOUSE_SECOND_CLICK","action":{"id":"","actionTypeId":"GENERAL_START_ACTION","config":{"delay":0,"easing":"","duration":0,"actionListId":"a-2","affectedElements":{},"playInReverse":false,"autoStopEventId":"e"}},"mediaQueries":["main","medium","small","tiny"],"target":{"id":"0a40dfc2-38d8-f364-3969-0e893aa534ac","appliesTo":"ELEMENT","styleBlockIds":[]},"targets":[{"id":"0a40dfc2-38d8-f364-3969-0e893aa534ac","appliesTo":"ELEMENT","styleBlockIds":[]}],"config":{"loop":false,"playInReverse":false,"scrollOffsetValue":null,"scrollOffsetUnit":null,"delay":null,"direction":null,"effectIn":null},"createdOn":1689716621006}},"actionLists":{"a":{"id":"a","title":"Vault Details Open","actionItemGroups":[{"actionItems":[{"id":"a-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".vaultdetails","selectorGuids":["dc37fb23-4793-19de-816e-f6af71460fd5"]},"value":"none"}}]},{"actionItems":[{"id":"a-n-2","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".vaultdetails","selectorGuids":["dc37fb23-4793-19de-816e-f6af71460fd5"]},"value":"flex"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1689716626943},"a-2":{"id":"a-2","title":"Vault Details Close","actionItemGroups":[{"actionItems":[{"id":"a-2-n","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".vaultdetails","selectorGuids":["dc37fb23-4793-19de-816e-f6af71460fd5"]},"value":"flex"}}]},{"actionItems":[{"id":"a-2-n-2","actionTypeId":"GENERAL_DISPLAY","config":{"delay":0,"easing":"","duration":0,"target":{"selector":".vaultdetails","selectorGuids":["dc37fb23-4793-19de-816e-f6af71460fd5"]},"value":"none"}}]}],"useFirstGroupAsInitialState":true,"createdOn":1689716781194}},"site":{"mediaQueries":[{"key":"main","min":992,"max":10000},{"key":"medium","min":768,"max":991},{"key":"small","min":480,"max":767},{"key":"tiny","min":0,"max":479}]}}'
);

export function Two({ as: _Component = _Builtin.Block }) {
  _interactions.useInteractions(_interactionsData, _styles);

  return (
    <_Component className={_utils.cx(_styles, "vault")} tag="div">
      <_Builtin.Block className={_utils.cx(_styles, "vaultoverview")} tag="div">
        <_Builtin.Block className={_utils.cx(_styles, "col")} tag="div">
          <_Builtin.Block className={_utils.cx(_styles, "label-2")} tag="div">
            {"Name"}
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "vaultname")} tag="div">
            <_Builtin.Block className={_utils.cx(_styles, "text-lg")} tag="div">
              {"Safe 01"}
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block className={_utils.cx(_styles, "table")} tag="div">
          <_Builtin.Block className={_utils.cx(_styles, "col-2")} tag="div">
            <_Builtin.Block className={_utils.cx(_styles, "label-2")} tag="div">
              {"Collateral"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "text-lg")}
              tag="div"
            >
              {"0.00 WETH"}
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "", "col-2")} tag="div">
            <_Builtin.Block
              className={_utils.cx(_styles, "", "label-2")}
              tag="div"
            >
              {"Borrowed"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "heading-h3-lg-bold-2")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(
                  _styles,
                  "heading-h3-lg-bold-2",
                  "heading-h3-lg-bold-2"
                )}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "", "text-lg")}
                  tag="span"
                >
                  {"250.00 OPN"}
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "", "col-2")} tag="div">
            <_Builtin.Block
              className={_utils.cx(_styles, "", "label-2")}
              tag="div"
            >
              {"Collateral Ratio"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "text-lg")}
              tag="div"
            >
              {"200.00%"}
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "", "col-2")} tag="div">
            <_Builtin.Block
              className={_utils.cx(_styles, "", "label-2")}
              tag="div"
            >
              {"Liquidation Price"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "text-lg")}
              tag="div"
            >
              {"$1354.47"}
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "", "col-2")} tag="div">
            <_Builtin.Block
              className={_utils.cx(_styles, "", "label-2")}
              tag="div"
            >
              {"Current Price"}
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "text-lg")}
              tag="div"
            >
              {"$1229.22"}
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block className={_utils.cx(_styles, "col-3")} tag="div">
          <_Builtin.Block
            className={_utils.cx(_styles, "", "label-2")}
            tag="div"
          >
            {"Risk"}
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "risk")} tag="div">
            <_Builtin.Image
              className={_utils.cx(_styles, "risk-indicator")}
              loading="lazy"
              width={10}
              height={10}
              src="https://uploads-ssl.webflow.com/64ac4f0e4fd899bd9c0009aa/64b6eb046060034055dad56c_Vectors-Wrapper.svg"
            />
            <_Builtin.Block
              className={_utils.cx(_styles, "heading-h3-lg")}
              tag="div"
            >
              {"High"}
            </_Builtin.Block>
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
      <_Builtin.Block className={_utils.cx(_styles, "vaultdetails")} tag="div">
        <_Builtin.FormWrapper className={_utils.cx(_styles, "form-wrapper")}>
          <_Builtin.FormForm
            className={_utils.cx(_styles, "form")}
            name="email-form"
            data-name="Email Form"
            method="get"
            id="email-form"
          >
            <_Builtin.Block className={_utils.cx(_styles, "deposit")} tag="div">
              <_Builtin.Block
                className={_utils.cx(_styles, "", "text-lg")}
                tag="div"
              >
                {"Deposit Collateral"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "token-details")}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "", "col-2")}
                  tag="div"
                >
                  <_Builtin.DropdownWrapper
                    className={_utils.cx(_styles, "dropdown-2")}
                    tag="div"
                    delay={0}
                    hover={false}
                  >
                    <_Builtin.DropdownToggle
                      className={_utils.cx(_styles, "dropdown")}
                      tag="div"
                    >
                      <_Builtin.Icon
                        className={_utils.cx(_styles, "icon")}
                        widget={{
                          type: "icon",
                          icon: "dropdown-toggle",
                        }}
                      />
                      <_Builtin.Block
                        className={_utils.cx(_styles, "token-icon")}
                        tag="div"
                      >
                        <_Builtin.Image
                          className={_utils.cx(_styles, "vectors-wrapper-2")}
                          loading="lazy"
                          width={16}
                          height={16}
                          src="https://uploads-ssl.webflow.com/64ac4f0e4fd899bd9c0009aa/64b6eb049cdd706cd8993c13_Vectors-Wrapper.svg"
                        />
                      </_Builtin.Block>
                      <_Builtin.Block
                        className={_utils.cx(_styles, "text")}
                        tag="div"
                      >
                        {"WETH"}
                      </_Builtin.Block>
                      <_Builtin.Image
                        className={_utils.cx(_styles, "vectors-wrapper-3")}
                        loading="lazy"
                        width={14.000000953674316}
                        height={7.999998569488525}
                        src="https://uploads-ssl.webflow.com/64ac4f0e4fd899bd9c0009aa/64b6eb05c85c8667fe73d434_Vectors-Wrapper.svg"
                      />
                    </_Builtin.DropdownToggle>
                    <_Builtin.DropdownList tag="nav">
                      <_Builtin.DropdownLink
                        options={{
                          href: "#",
                        }}
                      >
                        {"Link 1"}
                      </_Builtin.DropdownLink>
                      <_Builtin.DropdownLink
                        options={{
                          href: "#",
                        }}
                      >
                        {"Link 2"}
                      </_Builtin.DropdownLink>
                      <_Builtin.DropdownLink
                        options={{
                          href: "#",
                        }}
                      >
                        {"Link 3"}
                      </_Builtin.DropdownLink>
                    </_Builtin.DropdownList>
                  </_Builtin.DropdownWrapper>
                  <_Builtin.Block
                    className={_utils.cx(_styles, "balance")}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "body-sm")}
                      tag="div"
                    >
                      {"Balance: "}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "body-sm")}
                      tag="div"
                    >
                      {"0.00 WETH"}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "body-sm")}
                      tag="div"
                    >
                      {"~$0.00"}
                    </_Builtin.Block>
                  </_Builtin.Block>
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "input-wrapper")}
                  tag="div"
                >
                  <DepositCollateralInput />
                  <_Builtin.Block
                    className={_utils.cx(_styles, "", "balance")}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "body-sm")}
                      tag="div"
                    >
                      {"~$0.00"}
                    </_Builtin.Block>
                  </_Builtin.Block>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block className={_utils.cx(_styles, "borrow")} tag="div">
              <_Builtin.Block
                className={_utils.cx(_styles, "", "text-lg")}
                tag="div"
              >
                {"Borrow Stable Coin"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "", "token-details")}
                tag="div"
              >
                <_Builtin.Block
                  className={_utils.cx(_styles, "", "col-2")}
                  tag="div"
                >
                  <_Builtin.Block
                    className={_utils.cx(_styles, "", "dropdown")}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "token-icon-2")}
                      tag="div"
                    />
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "text")}
                      tag="div"
                    >
                      {"OPN"}
                    </_Builtin.Block>
                  </_Builtin.Block>
                  <_Builtin.Block
                    className={_utils.cx(_styles, "", "balance")}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "body-sm")}
                      tag="div"
                    >
                      {"Borrow: "}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "body-sm")}
                      tag="div"
                    >
                      {"620 STABLE"}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "body-sm")}
                      tag="div"
                    >
                      {"~$620.80"}
                    </_Builtin.Block>
                  </_Builtin.Block>
                </_Builtin.Block>
                <_Builtin.Block
                  className={_utils.cx(_styles, "", "input-wrapper")}
                  tag="div"
                >
                  <_Builtin.Block
                    className={_utils.cx(_styles, "", "dropdown")}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "text-2")}
                      tag="div"
                    >
                      {"Max"}
                    </_Builtin.Block>
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "text-3")}
                      tag="div"
                    >
                      {"250"}
                    </_Builtin.Block>
                  </_Builtin.Block>
                  <_Builtin.Block
                    className={_utils.cx(_styles, "", "balance")}
                    tag="div"
                  >
                    <_Builtin.Block
                      className={_utils.cx(_styles, "", "body-sm")}
                      tag="div"
                    >
                      {"~$248.50"}
                    </_Builtin.Block>
                  </_Builtin.Block>
                </_Builtin.Block>
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.FormButton
              className={_utils.cx(_styles, "form-button")}
              type="submit"
              value="Create, Deposit & Borrow"
              data-wait="Please wait..."
            />
          </_Builtin.FormForm>
          <_Builtin.FormSuccessMessage>
            <_Builtin.Block tag="div">
              {"Thank you! Your submission has been received!"}
            </_Builtin.Block>
          </_Builtin.FormSuccessMessage>
          <_Builtin.FormErrorMessage>
            <_Builtin.Block tag="div">
              {"Oops! Something went wrong while submitting the form."}
            </_Builtin.Block>
          </_Builtin.FormErrorMessage>
        </_Builtin.FormWrapper>
        <_Builtin.Block className={_utils.cx(_styles, "info")} tag="div">
          <_Builtin.Block className={_utils.cx(_styles, "text-5")} tag="div">
            {"Details"}
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "", "col")} tag="div">
            <_Builtin.Block
              className={_utils.cx(_styles, "info-row")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "body-sm-2")}
                tag="div"
              >
                {"Collateral Ratio"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "body-sm-3")}
                tag="div"
              >
                {"Low Risk"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "body-sm-4")}
                tag="div"
              >
                {"200.00%"}
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "info-row")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-2")}
                tag="div"
              >
                {"WETH Price (OSM)"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-4")}
                tag="div"
              >
                {"$1879.20"}
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "info-row")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-2")}
                tag="div"
              >
                {"WETH Liquidation Price"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-4")}
                tag="div"
              >
                {"$1354.47"}
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "info-row")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-2")}
                tag="div"
              >
                {"Total Liquidation Penalty"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-4")}
                tag="div"
              >
                {"18-20%"}
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "info-row")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-2")}
                tag="div"
              >
                {"OPN Redemption Price"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-4")}
                tag="div"
              >
                {"$1.00"}
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "section-2")} tag="div">
            <_Builtin.Block
              className={_utils.cx(_styles, "", "info-row")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-2")}
                tag="div"
              >
                {"Stability Fee"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-4")}
                tag="div"
              >
                {"0.0%"}
              </_Builtin.Block>
            </_Builtin.Block>
            <_Builtin.Block
              className={_utils.cx(_styles, "", "info-row")}
              tag="div"
            >
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-2")}
                tag="div"
              >
                {"Annual Redemption Rate"}
              </_Builtin.Block>
              <_Builtin.Block
                className={_utils.cx(_styles, "", "body-sm-4")}
                tag="div"
              >
                {"5.0%"}
              </_Builtin.Block>
            </_Builtin.Block>
          </_Builtin.Block>
          <_Builtin.Block className={_utils.cx(_styles, "slotdiv")} tag="div">
            <_Builtin.Link
              button={false}
              options={{
                href: "#",
              }}
            >
              {"SlotLink"}
            </_Builtin.Link>
          </_Builtin.Block>
        </_Builtin.Block>
      </_Builtin.Block>
    </_Component>
  );
}
