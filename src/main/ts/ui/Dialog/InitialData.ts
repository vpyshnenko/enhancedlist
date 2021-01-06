import { SugarElement, SelectorFind, Css } from "@ephox/sugar";
import { Optional, Arr, Fun } from "@ephox/katamari";
import { TargetType } from "../../core/Target";

interface InitialDataType {
  listStyleType?: string;
  indent?: string;
  target?: TargetType;
}

const getInitialData = (
  currentList: Optional<SugarElement<Element>>
): InitialDataType => {
  const listStyleType = currentList.map((elm) =>
    Css.get(elm, "list-style-type")
  );

  const indent = currentList
    .bind((elm) => SelectorFind.child(elm, "li[style*='padding-left']"))
    .map((elm) => Css.get(elm, "padding-left"));

  return Arr.foldl<
    { [key in keyof InitialDataType]: Optional<string> },
    InitialDataType
  >(
    [{ listStyleType }, { indent }],
    (acc, item) => {
      const [prop, opt] = Object.entries(item)[0];
      opt.map((v) => (acc[prop] = v));
      return acc;
    },
    {}
  );
};

export { InitialDataType, getInitialData };
