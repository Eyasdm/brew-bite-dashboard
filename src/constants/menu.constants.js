export function getCategoryOptions(t) {
  return [
    { value: "all", label: t("menu.categories.all") },
    { value: "drink", label: t("menu.categories.drink") },
    { value: "dessert", label: t("menu.categories.dessert") },
  ];
}

export function getAvailabiityOptions(t) {
  return [
    { value: "all", label: t("menu.availability.all") },
    { value: "available", label: t("menu.availability.available") },
    { value: "unavailable", label: t("menu.availability.unavailable") },
  ];
}

export function getAddDrinkCategoryOptions(t) {
  return [
    { value: "", label: t("menu.addDrink.selectCategory") },
    { value: "drink", label: t("menu.categories.drink") },
    { value: "dessert", label: t("menu.categories.dessert") },
  ];
}
