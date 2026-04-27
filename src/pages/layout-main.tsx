import { Outlet } from "react-router";
import Text from "../components/text";

export default function LayoutMain() {
  return <>
    <Text variant="heading-large">Layout Main</Text>
    <Outlet />
  </>
}