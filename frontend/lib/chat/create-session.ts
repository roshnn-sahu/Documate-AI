import { v4 as uuid } from "uuid";

export function createSession() {
  return {
    id: uuid(),
    createdAt: new Date().toISOString(),
  };
}
