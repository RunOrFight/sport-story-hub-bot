import { Button } from "antd";
import { Link } from "react-router-dom";

const BackButton = () => {
  return (
    <Link to={".."} relative={"path"}>
      <Button>{"Back"}</Button>
    </Link>
  );
};
export { BackButton };
