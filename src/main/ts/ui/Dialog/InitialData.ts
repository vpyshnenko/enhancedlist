import { SugarElement, SelectorFind, Css } from "@ephox/sugar";
import { Optional, Fun, Arr } from "@ephox/katamari";

const getInitialData = (currentList: Optional<SugarElement<Element>>) => {
  //editor.dom.getStyle(currentList, "list-style-type", true)
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
      opt.fold(Fun.noop, (v) => (acc[prop] = v));
      return acc;
    },
    {}
  );
};

export { getInitialData };
