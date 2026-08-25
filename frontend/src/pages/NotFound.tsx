import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center">
                <p className="font-mono text-xs tracking-widest text-muted">404 / NOT FOUND</p>
                <h1 className="font-display text-6xl lg:text-8xl text-white mt-4 mb-4">404</h1>
                <p className="text-muted max-w-md mx-auto mb-10">That page doesn't exist. It may have moved, or the address has a typo.</p>
                <Link to="/" className="glow-white glow-white-hover inline-block px-6 py-3.5 bg-accent text-ink font-semibold text-sm hover:bg-accent/90 transition-colors">
                    Back to home
                </Link>
            </div>
        </div>
    );
}
