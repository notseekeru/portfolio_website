import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, ViewTransition } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";
import ErrorBoundary from "./components/ErrorBoundary";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const BlogPost = lazy(() => import("./pages/BlogPost"));

export default function App() {
    return (
        <ErrorBoundary>
            <LazyMotion features={domAnimation} strict>
                <MotionConfig reducedMotion="user">
                    <BrowserRouter>
                        <div className="relative isolate min-h-screen flex flex-col">
                            <div aria-hidden="true" className="dot-field -z-10" />
                            <Navbar />
                            <main className="flex-1">
                                <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-muted font-mono">Loading...</div>}>
                                    <ViewTransition enter="page" update="page" default="none">
                                        <Routes>
                                            <Route path="/" element={<Home />} />
                                            <Route path="/blog/:slug" element={<BlogPost />} />
                                            <Route path="*" element={<NotFound />} />
                                        </Routes>
                                    </ViewTransition>
                                </Suspense>
                            </main>
                            <Footer />
                        </div>
                    </BrowserRouter>
                </MotionConfig>
            </LazyMotion>
        </ErrorBoundary>
    );
}
