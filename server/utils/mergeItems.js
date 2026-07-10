function mergeDuplicateItems(items) {
  const merged = {};

  for (const item of items) {
    const itemName = (item.itemName || "").trim();
    const unit = (item.unit || "piece").trim().toLowerCase();

    if (!itemName) continue;

    const key = `${itemName.toLowerCase()}-${unit}`;
    const quantity = Number(item.quantity || 1);

    if (!merged[key]) {
      merged[key] = {
        itemName,
        quantity: 0,
        unit
      };
    }

    merged[key].quantity += quantity;
  }

  return Object.values(merged);
}

module.exports = mergeDuplicateItems;