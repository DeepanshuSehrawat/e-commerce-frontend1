import React, { useState, useEffect, useMemo } from 'react';
import { Search, ShoppingCart, Grid3X3, List, Star, Heart, Filter, CreditCard, Truck, Shield, User, Menu, X } from 'lucide-react';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 124,
    category: "Electronics",
    tags: ["wireless", "premium", "audio"],
    description: "High-quality wireless headphones with noise cancellation and premium sound quality.",
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 89,
    category: "Electronics",
    tags: ["fitness", "smart", "watch"],
    description: "Advanced fitness tracking with heart rate monitoring and GPS functionality.",
    inStock: true,
    featured: false
  },
  {
    id: 3,
    name: "Designer Leather Jacket",
    price: 449.99,
    originalPrice: 599.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 67,
    category: "Fashion",
    tags: ["leather", "designer", "jacket"],
    description: "Premium leather jacket with modern design and superior craftsmanship.",
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: "Organic Coffee Beans",
    price: 24.99,
    originalPrice: 29.99,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
    rating: 4.7,
    reviews: 156,
    category: "Food",
    tags: ["organic", "coffee", "premium"],
    description: "Single-origin organic coffee beans with rich flavor and aroma.",
    inStock: true,
    featured: false
  },
  {
    id: 5,
    name: "Minimalist Desk Lamp",
    price: 89.99,
    originalPrice: 119.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    rating: 4.5,
    reviews: 43,
    category: "Home",
    tags: ["minimalist", "desk", "lighting"],
    description: "Modern minimalist desk lamp with adjustable brightness and USB charging port.",
    inStock: false,
    featured: false
  },
  {
    id: 6,
    name: "Professional Camera Kit",
    price: 1299.99,
    originalPrice: 1499.99,
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop",
    rating: 4.9,
    reviews: 91,
    category: "Electronics",
    tags: ["camera", "professional", "photography"],
    description: "Complete professional camera kit with multiple lenses and accessories.",
    inStock: true,
    featured: true
  },
  {
    id: 7,
    name: "Luxury Skincare Set",
    price: 159.99,
    originalPrice: 199.99,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=300&fit=crop",
    rating: 4.6,
    reviews: 78,
    category: "Beauty",
    tags: ["skincare", "luxury", "organic"],
    description: "Premium skincare set with natural ingredients for radiant skin.",
    inStock: true,
    featured: false
  },
  {
    id: 8,
    name: "Ergonomic Office Chair",
    price: 349.99,
    originalPrice: 449.99,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
    rating: 4.8,
    reviews: 134,
    category: "Home",
    tags: ["ergonomic", "office", "furniture"],
    description: "Ergonomic office chair with lumbar support and adjustable height.",
    inStock: true,
    featured: false
  }
];

const categories = ["All", "Electronics", "Fashion", "Food", "Home", "Beauty"];

const EcommerceStore = () => {
  const [products] = useState(mockProducts);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Checkout form state
  const [checkoutForm, setCheckoutForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        filtered.sort((a, b) => b.featured - a.featured || b.rating - a.rating);
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Cart functions
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.id === productId 
        ? { ...item, quantity }
        : item
    ));
  };

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    alert('Order placed successfully! Thank you for your purchase.');
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
  };

  // Product Card Component
  const ProductCard = ({ product, isListView }) => (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
      isListView ? 'flex' : ''
    }`}>
      <div className={`relative ${isListView ? 'w-64 flex-shrink-0' : 'aspect-square'} overflow-hidden`}>
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product)}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isInWishlist(product.id) 
              ? 'bg-red-500 text-white' 
              : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart className="w-4 h-4" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
        </button>
      </div>
      
      <div className="p-4 flex-1">
        <h3 className="font-semibold text-lg mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4" fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">
            {product.rating} ({product.reviews} reviews)
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <button
          onClick={() => product.inStock && addToCart(product)}
          disabled={!product.inStock}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
            product.inStock
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ShopVibe
              </h1>
            </div>

            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>

            <div className="flex bg-white border border-gray-200 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-6'
        }>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              isListView={viewMode === 'list'}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-blue-600 font-semibold">${item.price}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              -
                            </button>
                            <span className="mx-2 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-red-500 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="border-t p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total: ${cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCheckout(false)} />
            <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-screen overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-2xl font-semibold">Checkout</h2>
                <button
                  onClick={() => setShowCheckout(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6 p-6">
                {/* Order Summary */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold">Order Summary</h3>
                  <div className="space-y-4">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                          <p className="font-semibold text-blue-600">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-semibold">Total: ${cartTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4" />
                      <span>Free shipping</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Secure payment</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Form */}
                <form onSubmit={handleCheckout} className="space-y-6">
                  <h3 className="text-lg font-semibold">Payment Information</h3>
                  
                  <div className="space-y-4">
                    <input
                      type="email"
                      placeholder="Email address"
                      value={checkoutForm.email}
                      onChange={(e) => setCheckoutForm({...checkoutForm, email: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First name"
                        value={checkoutForm.firstName}
                        onChange={(e) => setCheckoutForm({...checkoutForm, firstName: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={checkoutForm.lastName}
                        onChange={(e) => setCheckoutForm({...checkoutForm, lastName: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Address"
                      value={checkoutForm.address}
                      onChange={(e) => setCheckoutForm({...checkoutForm, address: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={checkoutForm.city}
                        onChange={(e) => setCheckoutForm({...checkoutForm, city: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        value={checkoutForm.country}
                        onChange={(e) => setCheckoutForm({...checkoutForm, country: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <input
                        type="text"
                        placeholder="ZIP Code"
                        value={checkoutForm.zipCode}
                        onChange={(e) => setCheckoutForm({...checkoutForm, zipCode: e.target.value})}
                        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="border-t pt-4 space-y-4">
                      <h4 className="font-medium flex items-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Card Information</span>
                      </h4>
                      
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={checkoutForm.cardNumber}
                        onChange={(e) => setCheckoutForm({...checkoutForm, cardNumber: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={checkoutForm.expiryDate}
                          onChange={(e) => setCheckoutForm({...checkoutForm, expiryDate: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={checkoutForm.cvv}
                          onChange={(e) => setCheckoutForm({...checkoutForm, cvv: e.target.value})}
                          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      
                      <input
                        type="text"
                        placeholder="Name on card"
                        value={checkoutForm.nameOnCard}
                        onChange={(e) => setCheckoutForm({...checkoutForm, nameOnCard: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Complete Order - ${cartTotal.toFixed(2)}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <nav className="space-y-4">
                <a href="#" className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Home</a>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Categories</a>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Deals</a>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100 rounded-lg">About</a>
                <a href="#" className="block py-2 px-4 hover:bg-gray-100 rounded-lg">Contact</a>
              </nav>

              <div className="mt-8 pt-8 border-t">
                <h3 className="font-medium mb-4">Wishlist ({wishlist.length})</h3>
                <div className="space-y-2">
                  {wishlist.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center space-x-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-blue-600">${item.price}</p>
                      </div>
                    </div>
                  ))}
                  {wishlist.length > 3 && (
                    <p className="text-sm text-gray-500">+{wishlist.length - 3} more items</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 space-y-2">
        <button
          onClick={() => setShowCart(true)}
          className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6" />
          {cartItemsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {cartItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-50">
        {/* Toast notifications would go here in a real implementation */}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                ShopVibe
              </h3>
              <p className="text-gray-300 mb-4">
                Your one-stop destination for premium products with exceptional quality and service.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 cursor-pointer transition-colors">
                  f
                </div>
                <div className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 cursor-pointer transition-colors">
                  @
                </div>
                <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-900 cursor-pointer transition-colors">
                  in
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">All Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Fashion</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Home & Living</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Beauty</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Size Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-300 mb-4">Subscribe to get updates on new products and offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-r-lg hover:from-blue-600 hover:to-purple-700 transition-all">
                  Subscribe
                </button>
              </div>
              
              <div className="mt-6">
                <h5 className="font-medium mb-2">Secure Payments</h5>
                <div className="flex space-x-2">
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">VISA</div>
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">MC</div>
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">AMEX</div>
                  <div className="px-3 py-1 bg-gray-800 rounded text-sm">PayPal</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ShopVibe. All rights reserved. Built with ❤️ for amazing shopping experiences.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceStore;