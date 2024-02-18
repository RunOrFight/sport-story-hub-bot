import { ComponentType, createElement } from "react";

const withProps =
  <T extends Record<string, any>>(componentType: ComponentType<T>) =>
  (props: T) =>
  () =>
    createElement(componentType, props);

export { withProps };
