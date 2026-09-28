import { notFound } from "next/navigation";
import Unauthorized from "../unauthorized";

// QA-only route for manually exercising the 401 view. Hidden outside
// production builds so it isn't left publicly reachable after launch.
export default function Test401Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <Unauthorized />;
}
