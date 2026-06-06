import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

const readSavedCart = () => {
  const savedCart = localStorage.getItem('shopnova_cart');
  return savedCart ? JSON.parse(savedCart) : [];
};

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(readSavedCart);

  useEffect(() => {
    localStorage.setItem('shopnova_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems((items) => {
      const existing = items.find((item) => item._id === product._id);
      if (existing) {
        return items.map((item) =>
          item._id === product._id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...items, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((items) =>
      items.map((item) => (item._id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    setCartItems((items) => items.filter((item) => item._id !== productId));
  };

  const clearCart = () => setCartItems([]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => {
    const price = item.discountPrice && item.discountPrice < item.price ? item.discountPrice : item.price;
    return sum + price * item.quantity;
  }, 0);

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }),
    [cartItems, cartCount, cartTotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
