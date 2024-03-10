import { Button } from "antd";
import { Link } from "react-router-dom";
import { FC } from "react";

interface IBackButton {
  path?: string;
}

const BackButton: FC<IBackButton> = ({ path }) => {
  return (
    <Link
      to={path ?? ".."}
      relative={"path"}
      style={{ display: "flex", justifyContent: "flex-end" }}
    >
      <Button>{"Back"}</Button>
    </Link>
  );
};
export { BackButton };
