'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { Playfair_Display } from 'next/font/google'

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
})

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const currentYear = new Date().getFullYear();

    useEffect(() => {
        // 1. Create the validation function
        const validateSession = () => {
            const auth = localStorage.getItem("isAuthenticated");
            const loginTime = localStorage.getItem("loginTimestamp");

            if (auth === 'true' && loginTime) {
                const currentTime = new Date().getTime();
                const expiryTime = 12 * 60 * 60 * 1000;

                if (currentTime - parseInt(loginTime) > expiryTime) {
                    // SESSION EXPIRED
                    localStorage.clear();
                    sessionStorage.clear();
                    setError("Your 1-minute session has expired.");
                    router.replace('/admin/login');
                } else {
                    // SESSION STILL VALID - Move to dashboard
                    router.replace('/admin/dashboard');
                }
            }
        };
        // 2. Run immediately on load
        validateSession();
        // 3. HEARTBEAT: Run every 1 second to catch the exact moment of expiry
        const interval = setInterval(validateSession, 1000);

        // 4. Cleanup interval on unmount
        return () => clearInterval(interval);
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (email === "divesh@gmail.com" && password === "Divesh@123") {
            const now = new Date().getTime();
            localStorage.setItem("isAuthenticated", 'true');
            localStorage.setItem("loginTimestamp", now.toString());
            router.replace('/admin/dashboard');
        } else {
            setError("Access Denied: Invalid Credentials");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f5f0] px-6 relative overflow-hidden">

            {/* Background Text */}
            {/* --- NEW HIGH-END BACKGROUND DESIGN --- */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {/* Large Stroked Text */}
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center leading-none ${playfair.className}`}>
                    <span className="text-[18vw] font-black text-transparent stroke-black/[0.04] uppercase tracking-tighter"
                        style={{ WebkitTextStroke: '1px rgba(0,0,0,0.05)' }}>
                        Kanya
                    </span>
                    <span className="text-[14vw] font-black text-black/[0.02] uppercase tracking-[-0.05em] -mt-[5vw]">
                        Studio 
                    </span>
                </div>

                {/* Subtle Decorative Elements */}
                <div className="absolute top-10 left-10 text-[10px] uppercase tracking-[1em] text-black/10 vertical-text">
                    Est. 2020
                </div>
                <div className="absolute bottom-10 right-10 text-[10px] uppercase tracking-[1em] text-black/10">
                    Internal Access
                </div>
            </div>

            <div className="w-full max-w-md bg-white/60 backdrop-blur-2xl rounded-[2rem] shadow-xl p-10 border border-white/40 relative z-10">
                <div className="flex flex-col items-center mb-12">
                    <img src="/logo.png" alt="Logo" className='w-40 mb-8' />
                    <h2 className={`${playfair.className} text-4xl font-medium text-gray-900`}>
                        Admin <span className="italic font-normal">Login</span>
                    </h2>
                    {/* UI text updated to show 1 Min for testing */}
                    <p className="text-[9px] uppercase tracking-[0.4em] text-[#c26e00] font-bold mt-4 bg-amber-50 px-3 py-1 rounded-full">
                        Secure 12-HR Session
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group relative">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 group-focus-within:text-[#c26e00]">
                            Account Email
                        </label>
                        <input
                            type="email"
                            placeholder="admin@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-[#c26e00] focus:outline-none text-gray-800"
                        />
                    </div>

                    <div className="group relative">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 group-focus-within:text-[#c26e00]">
                            Password Key
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-gray-100 py-3 focus:border-[#c26e00] focus:outline-none text-gray-800"
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-[10px] uppercase tracking-widest text-center font-bold">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-[#1a1a1a] text-white py-5 rounded-2xl text-[11px] uppercase tracking-[0.5em] font-bold hover:bg-[#c26e00] transition-all duration-500 shadow-lg"
                    >
                        Sign IN
                    </button>
                </form>

                <div className="mt-12 text-center">
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition-colors underline underline-offset-8"
                    >
                        Return to Gallery
                    </button>
                </div>
            </div>

            <div className="absolute bottom-10 flex flex-col items-center gap-2">
                <div className="h-12 w-[1px] bg-gradient-to-b from-transparent to-gray-300"></div>
                <p className="text-[10px] uppercase tracking-[0.6em] text-gray-400 font-light">
                    Kanya Studio &copy; {currentYear}
                </p>
            </div>
        </div>
    )
}

export default Login;