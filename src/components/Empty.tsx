import { useTranslation } from "react-i18next";

interface EmptyProps {
  resourceName: string;
}

function Empty({ resourceName }: EmptyProps) {
  const { t } = useTranslation();

  return <p>{t("common.emptyResource", { resource: resourceName })}</p>;
}

export default Empty;
