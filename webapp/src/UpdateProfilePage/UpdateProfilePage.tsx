import { generatePath, Navigate, useParams } from "react-router-dom";
import { webappRoutes } from "../../../src/constants/webappRoutes.ts";
import { useSelector } from "react-redux";
import { userInfoUsernameNotNilSelector } from "../Store/User/UserSelectors.ts";

const UpdateProfilePage = () => {
  const { username: usernameFromParams } = useParams();
  const clientUsername = useSelector(userInfoUsernameNotNilSelector);

  if (clientUsername !== usernameFromParams) {
    return (
      <Navigate
        to={generatePath(webappRoutes.updateProfileRoute, {
          username: clientUsername,
        })}
      />
    );
  }

  return "Hello";
};

export { UpdateProfilePage };
