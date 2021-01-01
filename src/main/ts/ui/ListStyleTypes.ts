import { Arr } from "@ephox/katamari";

const ListSel = "ol,ul";

const bulletStyles: string[] = ["disc", "circle", "square"];

const numberStyles: string[] = [
  "decimal",
  "lower-alpha",
  "lower-greek",
  "lower-latin",
  "lower-roman",
  "upper-alpha",
  "upper-greek",
  "upper-latin",
  "upper-roman",
  "armenian",
  "cjk-ideographic",
  "decimal-leading-zero",
  "georgian",
  "hebrew",
  "hiragana",
  "hiragana-iroha",
  "katakana",
  "katakana-iroha",
];

const commonStyles: string[] = ["inherit", "none"];

const styleValueToText = (styleValue) => {
  return styleValue.replace(/\-/g, " ").replace(/\b\w/g, (chr) => {
    return chr.toUpperCase();
  });
};

const getListStyleTypeItems = (): Array<{
  value: string;
  text: string;
}> =>
  Arr.map([...bulletStyles, ...numberStyles, ...commonStyles], (value) => ({
    value,
    text: styleValueToText(value),
  }));

const isOrderedListType = (listStyleType: string): boolean =>
  Arr.contains(numberStyles, listStyleType);

export {
  ListSel,
  bulletStyles,
  numberStyles,
  commonStyles,
  styleValueToText,
  isOrderedListType,
  getListStyleTypeItems,
};
