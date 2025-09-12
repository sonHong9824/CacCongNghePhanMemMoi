import React, { createContext, useContext, useReducer } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  qty: number;
  meta?: Record<string, any>;
};

type State = { items: CartItem[] };

type Action =
  | { type: "ADD"; item: CartItem }
  | { type: "UPDATE"; id: string; patch: Partial<CartItem> }
  | { type: "REMOVE"; id: string }
  | { type: "CLEAR" };

const initial: State = { items: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD": {
      const exists = state.items.find((i) => i.id === action.item.id);
      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === action.item.id
              ? { ...i, qty: i.qty + action.item.qty }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case "UPDATE":
      return {
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, ...action.patch } : i
        ),
      };
    case "REMOVE":
      return { items: state.items.filter((i) => i.id !== action.id) };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<{
  state: State;
  add: (item: CartItem) => void;
  update: (id: string, patch: Partial<CartItem>) => void;
  remove: (id: string) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);

  const add = (item: CartItem) => dispatch({ type: "ADD", item });
  const update = (id: string, patch: Partial<CartItem>) =>
    dispatch({ type: "UPDATE", id, patch });
  const remove = (id: string) => dispatch({ type: "REMOVE", id });
  const clear = () => dispatch({ type: "CLEAR" });

  return (
    <CartContext.Provider value={{ state, add, update, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
