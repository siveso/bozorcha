import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/cart-context";
import { WishlistProvider } from "@/components/wishlist-context";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import Product from "@/pages/product";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Profile from "@/pages/profile";
import Cart from "@/pages/cart";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      <Route path="/product/:id" component={Product} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/contact" component={Contact} />
      <Route path="/profile" component={Profile} />
      <Route path="/cart" component={Cart} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default App;
