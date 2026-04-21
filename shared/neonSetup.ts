import { types as neonTypes } from "@neondatabase/serverless";
import { parseTextArray } from "./parseTextArray";

export function registerNeonTypeParsers() {
  neonTypes.setTypeParser(neonTypes.builtins.BOOL, (val: string) => val === "t" || val === "true" || val === (true as unknown as string));
  neonTypes.setTypeParser(neonTypes.builtins.TIMESTAMP, (val: string) => val == null ? null : new Date(val));
  neonTypes.setTypeParser(neonTypes.builtins.TIMESTAMPTZ, (val: string) => val == null ? null : new Date(val));
  neonTypes.setTypeParser(1009, (val: string) => parseTextArray(val));
}
