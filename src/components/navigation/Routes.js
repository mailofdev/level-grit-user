// routes.js
import { getDecryptedUser } from "../common/CommonFunctions";

export const getRoutes = () => {
  const user = getDecryptedUser();

  if (!user) return [];

  return [
          ...(user?.role === "Client"
      ? [
          {
            label: "Dashboard",
            href: "/client-dashboard",
            icon: "bi-speedometer2",
            showIn: ["sidebar", "topbar"],
          }
        ]
      : []),
  ];
};
