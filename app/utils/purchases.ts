export const getProductInfo = (productId: string) => {
  switch (productId) {
    case "com.smarticus.10coins":
      return {
        title: "1000 Coins",
        coins: 1000,
        formattedValue: "1000",
        discount: 0,
      };
    case "com.smarticus.50coins":
      return {
        title: "5000 Coins",
        coins: 5000,
        formattedValue: "5000",
        discount: 10,
      };
    case "com.smarticus.100coins_v2":
      return {
        title: "10000 Coins",
        coins: 10000,
        formattedValue: "10,000",
        discount: 20,
      };
    case "com.smarticus.500coins":
      return {
        title: "50000 Coins",
        coins: 50000,
        formattedValue: "50,000",
        discount: 30,
      };
    case "com.smarticus.1000coins":
      return {
        title: "100000 Coins",
        coins: 100000,
        formattedValue: "100,000",
        discount: 40,
      };
    default:
      return { title: "", coins: 0, formattedValue: "", discount: 0 };
  }
};
