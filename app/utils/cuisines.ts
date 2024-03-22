import { Cuisine, Cuisines } from "delivfree";

export const getCuisineTitle = (cuisine: Cuisine) => {
  return data.find((c) => c.cuisine === cuisine)?.title;
};

export const getCuisineImage = (cuisine: Cuisine) => {
  return data.find((c) => c.cuisine === cuisine)?.image;
};

export const data: { cuisine: Cuisine; image: number; title: string }[] = [
  {
    cuisine: Cuisines.Burgers,
    image: require("../../assets/images/cuisines/burger.jpg"),
    title: "Burgers",
  },
  {
    cuisine: Cuisines.Pizza,
    image: require("../../assets/images/cuisines/pizza.jpg"),
    title: "Pizza",
  },
  {
    cuisine: Cuisines.Chinese,
    image: require("../../assets/images/cuisines/chinese.jpg"),
    title: "Chinese",
  },
  {
    cuisine: Cuisines.Sushi,
    image: require("../../assets/images/cuisines/sushi.jpg"),
    title: "Sushi",
  },
  {
    cuisine: Cuisines.Vietnamese,
    image: require("../../assets/images/cuisines/breakfast.jpg"),
    title: "Vietnamese",
  },
  {
    cuisine: Cuisines.Italian,
    image: require("../../assets/images/cuisines/italian.jpg"),
    title: "Italian",
  },
  {
    cuisine: Cuisines.Indian,
    image: require("../../assets/images/cuisines/indian.jpg"),
    title: "Indian",
  },
  {
    cuisine: Cuisines.Mexican,
    image: require("../../assets/images/cuisines/mexican.jpg"),
    title: "Mexican",
  },
  {
    cuisine: Cuisines.Mediterranean,
    image: require("../../assets/images/cuisines/greek.jpg"),
    title: "Greek",
  },
  {
    cuisine: Cuisines.MiddleEastern,
    image: require("../../assets/images/cuisines/middle-eastern.jpg"),
    title: "Middle Eastern",
  },
  {
    cuisine: Cuisines.Seafood,
    image: require("../../assets/images/cuisines/seafood.jpg"),
    title: "Seafood",
  },
  {
    cuisine: Cuisines.VegetarianVegan,
    image: require("../../assets/images/cuisines/vegetarian.jpg"),
    title: "Vegetarian",
  },
  {
    cuisine: Cuisines.BreakfastBrunch,
    image: require("../../assets/images/cuisines/breakfast.jpg"),
    title: "Breakfast & Brunch",
  },
  {
    cuisine: Cuisines.CoffeeShopsCafes,
    image: require("../../assets/images/cuisines/coffee.jpg"),
    title: "Coffee Shops",
  },
  {
    cuisine: Cuisines.DessertsSweets,
    image: require("../../assets/images/cuisines/dessert.jpg"),
    title: "Desserts",
  },
];
