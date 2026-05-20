import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";

const BlogPost = lazy(() => import("./pages/BlogPost"));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center text-zinc-500 font-mono">
                  Loading...
                </div>
              }
            >
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/#home" element={<Home />} />
                  <Route path="/#blog/:slug" element={<BlogPost />} />
                </Routes>
              </AnimatePresence>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
