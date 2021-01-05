import { SugarElement, SelectorFind, Css } from "@ephox/sugar";
import { Optional, Arr } from "@ephox/katamari";

interface InitialDataType {
  listStyleType?: string;
  indent?: string;
  target?: string;
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

  return Arr.foldl(
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
