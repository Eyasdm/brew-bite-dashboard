import { useTranslation } from "react-i18next";

function Empty({ resourceName }) {
  const { t } = useTranslation();

  return <p>{t("common.emptyResource", { resource: resourceName })}</p>;
}

export default Empty;
