export const TEST_ORDERS = [
  {
    total: "18.20",
    tip: "2.00",
    subtotal: "14.46",
    tax: "1.74",
    status: "complete",
    driver: "0cf24264350c13eea265652ece253b86f1e5",
    customer: "HJvR6aEt84dqeLnBkihDTvDjh462",
    checkoutItems: [
      {
        id: "item001",
        item: {
          id: "burger001",
          image: "burger.jpg",
          name: "Classic Burger",
          description:
            "A delicious classic burger with lettuce, tomato, and cheese.",
          categories: ["burger"],
          price: "8.00",
          energy: { cals: "500", kj: "2092" },
          attributes: ["gluten-free"],
          vendor: "Best Burgers",
          order: { burger: 1 },
        },
        quantity: 1,
        customizations: [
          {
            customization: "Add-ons",
            choice: { id: "addon001", name: "Bacon", price: "1.50" },
            quantity: 1,
            text: "Extra crispy",
          },
        ],
      },
      {
        id: "item002",
        item: {
          id: "fries001",
          image: "fries.jpg",
          name: "French Fries",
          description: "Crispy golden french fries.",
          categories: ["side"],
          price: "3.00",
          energy: { cals: "300", kj: "1255" },
          attributes: ["vegan"],
          vendor: "Best Burgers",
          order: { side: 1 },
        },
        quantity: 1,
        customizations: [],
      },
    ],
  },
  {
    total: "12.30",
    tip: "1.50",
    status: "complete",
    driver: "0cf24264350c13eea265652ece253b86f1e5",
    checkoutItems: [
      {
        id: "item003",
        item: {
          id: "burger002",
          image: "veggie_burger.jpg",
          name: "Veggie Burger",
          description: "A healthy veggie burger with avocado and sprouts.",
          categories: ["burger", "vegetarian"],
          price: "7.00",
          energy: { cals: "400", kj: "1674" },
          attributes: ["vegetarian"],
          vendor: "Burger Haven",
          order: { burger: 1 },
        },
        quantity: 1,
        customizations: [
          {
            customization: "Sauce",
            choice: { id: "sauce001", name: "Mayo", price: "0.50" },
            quantity: 1,
            text: "Extra mayo",
          },
        ],
      },
      {
        id: "item004",
        item: {
          id: "drink001",
          image: "soda.jpg",
          name: "Soda",
          description: "Chilled soda to quench your thirst.",
          categories: ["drink"],
          price: "2.00",
          energy: { cals: "150", kj: "628" },
          attributes: [],
          vendor: "Burger Haven",
          order: { drink: 1 },
        },
        quantity: 1,
        customizations: [],
      },
    ],
  },
  {
    total: "14.96",
    tip: "2.00",
    status: "complete",
    driver: "0cf24264350c13eea265652ece253b86f1e5",
    checkoutItems: [
      {
        id: "item005",
        item: {
          id: "chicken001",
          image: "chicken_burger.jpg",
          name: "Chicken Burger",
          description: "Juicy chicken burger with lettuce and mayo.",
          categories: ["burger"],
          price: "9.00",
          energy: { cals: "600", kj: "2510" },
          attributes: [],
          vendor: "Burger Joint",
          order: { burger: 1 },
        },
        quantity: 1,
        customizations: [
          {
            customization: "Cheese",
            choice: { id: "cheese001", name: "Cheddar", price: "1.00" },
            quantity: 1,
            text: "",
          },
        ],
      },
      {
        id: "item006",
        item: {
          id: "shake001",
          image: "shake.jpg",
          name: "Milkshake",
          description: "Creamy vanilla milkshake.",
          categories: ["drink"],
          price: "3.00",
          energy: { cals: "400", kj: "1674" },
          attributes: ["gluten-free"],
          vendor: "Burger Joint",
          order: { drink: 1 },
        },
        quantity: 1,
        customizations: [],
      },
    ],
  },
  {
    total: "17.62",
    tip: "2.50",
    status: "complete",
    driver: "0cf24264350c13eea265652ece253b86f1e5",
    checkoutItems: [
      {
        id: "item007",
        item: {
          id: "double_burger001",
          image: "double_burger.jpg",
          name: "Double Burger",
          description: "Double patty burger with cheese and bacon.",
          categories: ["burger"],
          price: "10.00",
          energy: { cals: "800", kj: "3348" },
          attributes: [],
          vendor: "Grill Master",
          order: { burger: 1 },
        },
        quantity: 1,
        customizations: [
          {
            customization: "Bacon",
            choice: { id: "bacon001", name: "Extra Bacon", price: "2.00" },
            quantity: 1,
            text: "Extra crispy",
          },
        ],
      },
      {
        id: "item008",
        item: {
          id: "salad001",
          image: "salad.jpg",
          name: "Garden Salad",
          description: "Fresh garden salad with mixed greens.",
          categories: ["side"],
          price: "4.00",
          energy: { cals: "150", kj: "628" },
          attributes: ["vegan"],
          vendor: "Grill Master",
          order: { side: 1 },
        },
        quantity: 1,
        customizations: [],
      },
    ],
  },
  {
    total: "20.28",
    tip: "3.00",
    status: "complete",
    driver: "0cf24264350c13eea265652ece253b86f1e5",
    checkoutItems: [
      {
        id: "item009",
        item: {
          id: "bacon_burger001",
          image: "bacon_burger.jpg",
          name: "Bacon Burger",
          description: "Burger with bacon, cheese, and BBQ sauce.",
          categories: ["burger"],
          price: "9.00",
          energy: { cals: "650", kj: "2720" },
          attributes: [],
          vendor: "Burger Palace",
          order: { burger: 1 },
        },
        quantity: 1,
        customizations: [
          {
            customization: "Sauce",
            choice: { id: "sauce002", name: "BBQ Sauce", price: "0.50" },
            quantity: 1,
            text: "Extra sauce",
          },
        ],
      },
      {
        id: "item010",
        item: {
          id: "onion_rings001",
          image: "onion_rings.jpg",
          name: "Onion Rings",
          description: "Crispy onion rings with dipping sauce.",
          categories: ["side"],
          price: "4.00",
          energy: { cals: "350", kj: "1464" },
          attributes: ["vegan"],
          vendor: "Burger Palace",
          order: { side: 1 },
        },
        quantity: 1,
        customizations: [],
      },
      {
        id: "item011",
        item: {
          id: "drink002",
          image: "iced_tea.jpg",
          name: "Iced Tea",
          description: "Refreshing iced tea.",
          categories: ["drink"],
          price: "3.00",
          energy: { cals: "120", kj: "502" },
          attributes: [],
          vendor: "Burger Palace",
          order: { drink: 1 },
        },
        quantity: 1,
        customizations: [],
      },
    ],
  },
  {
    total: "13.88",
    tip: "2.00",
    status: "complete",
    driver: "0cf24264350c13eea265652ece253b86f1e5",
    checkoutItems: [
      {
        id: "item012",
        item: {
          id: "spicy_burger001",
          image: "spicy_burger.jpg",
          name: "Spicy Burger",
          description: "Spicy burger with jalapeños and pepper jack cheese.",
          categories: ["burger"],
          price: "8.00",
          energy: { cals: "550", kj: "2301" },
          attributes: [],
          vendor: "Urban Burger",
          order: { burger: 1 },
        },
        quantity: 1,
        customizations: [
          {
            customization: "Spice Level",
            choice: { id: "spice001", name: "Extra Spicy", price: "0.50" },
            quantity: 1,
            text: "Add extra jalapeños",
          },
        ],
      },
      {
        id: "item013",
        item: {
          id: "shake002",
          image: "chocolate_shake.jpg",
          name: "Chocolate Milkshake",
          description: "Rich and creamy chocolate milkshake.",
          categories: ["drink"],
          price: "3.00",
          energy: { cals: "450", kj: "1883" },
          attributes: ["gluten-free"],
          vendor: "Urban Burger",
          order: { drink: 1 },
        },
        quantity: 1,
        customizations: [],
      },
    ],
  },
].map((o, i) =>
  i === 0
    ? o
    : {
        ...o,
        checkoutItems: new Array(Math.floor(Math.random() * 4) + 2).fill(0),
      }
);
