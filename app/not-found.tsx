import { ROUTES } from "@/routes";
import { RedirectType, redirect } from "next/navigation";

const NotFoundPage = () => {
  redirect(ROUTES.home.root(), RedirectType.replace);
};

export default NotFoundPage;
