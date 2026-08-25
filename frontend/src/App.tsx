import { BrowserRouter, Routes, Route } from "react-router-dom";
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
							<Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted font-mono">Loading...</div>}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/blog/:slug" element={<BlogPost />} />
                            </Routes>
                        </Suspense>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </ErrorBoundary>
    );
}
