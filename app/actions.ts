import { Session } from "next-auth";

import { createUser, getUser } from "app/api/users/handlers";
import { camelCaseData } from "@/utils/globalHelpers";

export async function handleUserPostAuth(session: Session) {
  // !NOTE this shouldn't be possible
  const email = session.user?.email || '';
  let user = await getUser(email);
  if (!user) {
    // create user
    user = await createUser({
      email: session?.user?.email ?? '',
      name: session?.user?.name ?? '',
      image: session?.user?.image ?? '',
      isAdmin: false
    });
  }
  return camelCaseData(user);
}