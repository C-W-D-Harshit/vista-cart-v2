"use client";
import React from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import {
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";
import "./styles.css";
import { RiWomenFill } from "react-icons/ri";
import { BiFemale, BiMale } from "react-icons/bi";

const ToggleM = () => (
  <ToggleGroup.Root
    className="ToggleGroup"
    type="single"
    defaultValue="women"
    aria-label="Text alignment"
  >
    <ToggleGroup.Item
      className="ToggleGroupItem"
      value="women"
      aria-label="Left aligned"
    >
      <BiFemale style={{ fontSize: "2rem" }} />
      <p>Women</p>
    </ToggleGroup.Item>
    <ToggleGroup.Item
      className="ToggleGroupItem"
      value="men"
      aria-label="Right aligned"
    >
      <BiMale style={{ fontSize: "2rem" }} />
      <p>Men</p>
    </ToggleGroup.Item>
  </ToggleGroup.Root>
);

export default ToggleM;
