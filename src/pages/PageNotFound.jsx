import { useTranslation } from "react-i18next";

function PageNotFound() {
  const { t } = useTranslation();

  return <div>{t("errors.pageNotFound")}</div>;
}

export default PageNotFound;
