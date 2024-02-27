import { useSelector } from "react-redux";
import { type RootState } from "../Store/App/AppStore.ts";

const useAppSelector = useSelector.withTypes<RootState>();

export { useAppSelector };
