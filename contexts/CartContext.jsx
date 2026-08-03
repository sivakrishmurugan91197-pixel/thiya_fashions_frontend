import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const storedCart = localStorage.getItem('thiya_cart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Error parsing cart storage:", e);
            }
        }
    }, []);

    useEffect(() => {
        if (isMounted) {
            localStorage.setItem('thiya_cart', JSON.stringify(cart));
        }
    }, [cart, isMounted]);

    const addToCart = (product, size, color, quantity = 1) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex(
                (item) => item.productId === product.id && item.size === size && item.color === color
            );

            const unitPrice = parseFloat(product.price) - parseFloat(product.discount_amount || 0);
            const image = product.images?.find(img => img.color === color)?.url || product.images?.[0]?.url || '';

            if (existingIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += quantity;
                return newCart;
            } else {
                return [...prevCart, {
                    id: `${product.id}-${size}-${color}`,
                    productId: product.id,
                    title: product.title,
                    price: unitPrice,
                    originalPrice: parseFloat(product.price),
                    discount_amount: parseFloat(product.discount_amount || 0),
                    size: size || 'Standard',
                    color: color || 'Default',
                    quantity,
                    image
                }];
            }
        });
        setIsCartOpen(true); // Open drawer automatically on add
    };

    const removeFromCart = (productId, size, color) => {
        setCart((prevCart) => prevCart.filter(
            (item) => !(item.productId === productId && item.size === size && item.color === color)
        ));
    };

    const updateQuantity = (productId, size, color, quantity) => {
        if (quantity < 1) return;
        setCart((prevCart) => prevCart.map(
            (item) => (item.productId === productId && item.size === size && item.color === color)
                ? { ...item, quantity }
                : item
        ));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartCount,
            cartTotal,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
