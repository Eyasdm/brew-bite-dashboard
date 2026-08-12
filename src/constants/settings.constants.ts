import type { TFunction } from "i18next";
import type { SelectOption } from "../types";

export const getLanguageOptions = (t: TFunction): SelectOption[] => [
  { value: "en", label: t("system.language.en") },
  { value: "id", label: t("system.language.id") },
];

export const getCurrencyOptions = (t: TFunction): SelectOption[] => [
  { value: "usd", label: t("system.currency.usd") },
  { value: "idr", label: t("system.currency.idr") },
];

export const getTimezoneOptions = (t: TFunction): SelectOption[] => [
  {
    value: "Asia/Jakarta",
    label: t("system.timezone.wib"),
  },
  {
    value: "Asia/Makassar",
    label: t("system.timezone.wita"),
  },
  {
    value: "Asia/Jayapura",
    label: t("system.timezone.wit"),
  },
];

export const getThemeOptions = (t: TFunction): SelectOption[] => [
  { value: "light", label: t("system.theme.light") },
  { value: "dark", label: t("system.theme.dark") },
  { value: "system", label: t("system.theme.system") },
];
