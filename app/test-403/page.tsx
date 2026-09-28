import { notFound } from "next/navigation";
import Forbidden from "../forbidden";

// QA-only route for manually exercising the 403 view. Hidden outside
// production builds so it isn't left publicly reachable after launch.
export default function Test403Page() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }
  return <Forbidden />;
}
