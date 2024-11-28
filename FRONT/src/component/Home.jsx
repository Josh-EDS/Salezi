import React, { useState, useEffect, createContext, useContext } from 'react';
import Bande_fnac from "../assets/Bande_fnac.png";

const CartContext = createContext();

const CATEGORY_MAP = {
  1: "Smartphones",
  2: "Télévisions",
  3: "Autres"
};

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-2 pl-4 pr-10 rounded border border-gray-300 focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200"
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              onSearch('');
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

const CartIcon = () => {
  const { cart } = useContext(CartContext);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsCartOpen(!isCartOpen)} 
        className="relative p-2"
      >
        <span className="relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="lucide lucide-shopping-cart text-gray-700 hover:text-yellow-500 transition-colors"
          >
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {itemCount}
            </span>
          )}
        </span>
      </button>
      
      {isCartOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Votre Panier</h3>
            <CartSummary onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existingProduct = cart.find(item => item.id === product.documentId);
    
    if (existingProduct) {
      setCart(cart.map(item => 
        item.id === product.documentId 
          ? {...item, quantity: item.quantity + 1} 
          : item
      ));
    } else {
      setCart([...cart, {...product, quantity: 1}]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

const CartSummary = ({ onClose }) => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const totalPrice = cart.reduce((total, item) => 
    total + (item.price * item.quantity), 0
  );

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        Votre panier est vide
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cart.map(item => (
        <div key={item.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-4">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
            )}
            <div>
              <h4 className="font-medium">{item.name}</h4>
              <p className="text-sm text-gray-500">
                Quantité: {item.quantity} × {item.price.toFixed(2)} €
              </p>
            </div>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500 hover:text-red-700 px-2 py-1"
          >
            ×
          </button>
        </div>
      ))}
      
      <div className="mt-6 space-y-4">
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>{totalPrice.toFixed(2)} €</span>
        </div>
        
        <div className="space-y-2">
          <button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
            onClick={() => {
              console.log('Proceeding to checkout...');
            }}
          >
            Passer la commande
          </button>
          <button
            className="w-full border border-gray-300 hover:bg-gray-100 py-2 px-4 rounded"
            onClick={() => {
              clearCart();
              onClose();
            }}
          >
            Vider le panier
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, name, price, image, description, category }) => {
  const { addToCart } = useContext(CartContext);
  const categoryName = CATEGORY_MAP[category] || 'Autres';

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden border">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4 text-center">
        <h4 className="text-lg font-semibold mb-2">{name}</h4>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm bg-gray-200 px-2 py-1 rounded">
            Catégorie: {categoryName}
          </span>
          <span className="text-sm text-gray-500">ID: {category}</span>
        </div>
        <p className="text-xl font-bold text-black mb-4">{price}</p>
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product);
          }}
          className="bg-black text-yellow-400 px-4 py-2 rounded hover:bg-gray-800"
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
};

const MenuItem = ({ href, ariaControls, children }) => (
  <li className="border-b border-gray-200 last:border-b-0">
    <a
      className="block px-6 py-4 hover:bg-gray-200 transition-colors text-gray-700 hover:text-black"
      aria-expanded="false"
      aria-controls={ariaControls}
      href={href}
    >
      {children}
    </a>
  </li>
);

const SideNavPanel = () => {
  return (
    <div className="sticky top-0">
      <nav>
        <ul className="space-y-1 text-lg">
          <MenuItem
            href="#"
            ariaControls="panel-a4efb37e-e719-4038-9aa9-d044a300d121"
          >
            Télévisions
          </MenuItem>
          <MenuItem
            href="#"
            ariaControls="panel-9092f0c9-5dd1-4001-851d-ce5e6abdd938"
          >
            Smartphones
          </MenuItem>
          <MenuItem
            href="#"
            ariaControls="panel-2420dbe2-fb69-4f64-a15d-6646e8fae3ea"
          >
            Musique, CD, Vinyles
          </MenuItem>
          <MenuItem
            href="#"
            ariaControls="panel-00db150a-6617-48e4-889c-6fe4cb740c9f"
          >
            Jeux vidéo, Consoles
          </MenuItem>
          <MenuItem
            href="#"
            ariaControls="panel-3613543d-e69e-4107-891a-0a2eb04056d5"
          >
            Films, Séries TV, DVD, Blu-ray
          </MenuItem>
          <MenuItem
            href="#"
            ariaControls="panel-77be84e7-8518-4c5c-9ce6-3e686e2adc4c"
          >
            Autres
          </MenuItem>
        </ul>
      </nav>
    </div>
  );
};


const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data.data);
        setFilteredProducts(data.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);


  
  // SUPPRESSION DES DRAFTS
  setTimeout(() => {
  const productLinks = document.querySelectorAll('a[href^="/product/"]');
  productLinks.forEach(link => {
    const productTitle = link.querySelector('h4') ? link.querySelector('h4').textContent : '';
    if (productTitle.includes('-- Draft')) {
      link.style.display = 'none';
    }
  });
  }, 200);

// CATéGORIES
  document.querySelectorAll('a[aria-expanded="false"]').forEach(link => {
    link.addEventListener('click', () => {
      const category = link.textContent.trim();
      document.querySelectorAll('.bg-white.shadow-md.rounded-lg.overflow-hidden.border').forEach(card => {
        card.style.display = '';
      });
      document.querySelectorAll('.bg-white.shadow-md.rounded-lg.overflow-hidden.border').forEach(card => {
        const productCategory = card.querySelector('.text-sm.bg-gray-200.px-2.py-1.rounded').textContent.trim();
        if (!productCategory.includes(category)) {
          card.style.display = 'none';
        }
      });
    });
  });

  if (window.innerWidth <= 768) document.querySelector('.w-80.bg-gray-100.shrink-0.min-h-screen')?.remove();

  const handleSearch = (term) => {
    setSearchTerm(term);
    const results = products.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.description.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredProducts(results);
  };

  return (
    <CartProvider>
      <div className="flex min-h-screen">
        <aside className="w-80 bg-gray-100 shrink-0 min-h-screen">
          <SideNavPanel />
        </aside>

        <main className="flex-grow">
          <div className="p-4 bg-gray-100 flex items-center justify-between">
            <div className="flex-grow mr-4">
              <SearchBar onSearch={handleSearch} />
            </div>
            <CartIcon />
          </div>

          <a href="/product/vdpf1coff7w9x8nav5z04gmo">
            <img 
              src={Bande_fnac} 
              alt="Bande Fnac" 
              className="w-full h-auto object-cover"
            />
          
          <div className="bg-black text-center py-12">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Les meilleures offres du moment
            </h2>
            <button className="bg-yellow-500 text-white px-6 py-3 rounded hover:bg-gray-800">
              Voir les promotions
            </button>
          </div>
          </a>

          <section className="py-12 px-6">
            <h3 className="text-xl font-bold mb-6">Nos produits populaires</h3>
            {isLoading ? (
              <div className="text-center text-xl">Chargement des produits...</div>
            ) : error ? (
              <div className="text-center text-red-500">Erreur : {error}</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-xl">Aucun produit trouvé</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <a href={`/product/${product.documentId}`} key={product.documentId}>
                    <ProductCard
                      product={product}
                      name={product.name}
                      price={`${product.price.toFixed(2)} €`}
                      image={product.image_url}
                      description={product.description}
                      category={product.category_id}
                    />
                  </a>
                ))}
              </div>
            )}
          </section>

          <footer className="bg-black text-white text-center py-4">
            &copy; 2024 Fnao. Tous droits réservés.
          </footer>
        </main>
      </div>
    </CartProvider>
  );
};

export default App;