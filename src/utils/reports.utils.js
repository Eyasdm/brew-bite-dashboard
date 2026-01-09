export function getRangeStart(range) {
  const now = new Date();

  switch (range) {
    case "week": {
      const d = new Date(now);
      d.setDate(now.getDate() - 6);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }

    case "month":
      return new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    case "year":
      return new Date(now.getFullYear(), 0, 1).getTime();

    case "all":
      return null;

    default:
      return null;
  }
}
