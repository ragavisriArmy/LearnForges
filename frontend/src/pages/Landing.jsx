import React from 'react';

export default function Landing({ onEnterApp }) {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', overflowX: 'hidden' }}>
            
            {/* Nav Bar */}
            <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 4rem', borderBottom: '1px solid #1e293b', backdropFilter: 'blur(12px)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', letterSpacing: '-0.05em' }}>
                    Learn<span style={{ color: '#3b82f6' }}>Forge</span>
                </div>
                <button onClick={onEnterApp} style={{ padding: '0.6rem 1.25rem', backgroundColor: '#1e293b', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                    Launch Console
                </button>
            </nav>

            {/* Hero Segment */}
            <header style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }}></div>
                
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ display: 'inline-block', padding: '0.35rem 1rem', backgroundColor: '#1e1b4b', color: '#a5b4fc', borderRadius: '9999px', fontSize: '0.85rem', fontWeight: '600', marginBottom: '1.5rem', border: '1px solid #3730a3' }}>
                        v2.0 System Architecture Live
                    </span>
                    <h1 style={{ fontSize: '4rem', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(to right, #ffffff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        The Adaptive Full-Stack<br />Engineering Ecosystem
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#94a3b8', maxWidth: '700px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
                        An interactive deployment sandbox integrating relational SQLite databases, dynamic canvas UI evaluation architectures, and deep statistical intelligence metrics.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button onClick={onEnterApp} style={{ padding: '1rem 2rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '700', cursor: 'pointer', boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)' }}>
                            Get Started Instantly
                        </button>
                    </div>
                </div>
            </header>

            {/* Live Counter Info Ticker */}
            <section style={{ backgroundColor: '#0f172a', borderTop: '1px solid #1e293b', borderBottom: '1px solid #1e293b', padding: '2rem 0' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', margin: '0 0 0.25rem 0' }}>100%</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Database Integrity</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', margin: '0 0 0.25rem 0' }}>&lt; 40ms</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>API Pipeline Latency</p>
                    </div>
                    <div>
                        <h3 style={{ fontSize: '2rem', fontWeight: '800', color: '#fbbf24', margin: '0 0 0.25rem 0' }}>3 Core</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>Deployed Production Tracks</p>
                    </div>
                </div>
            </section>
        </div>
    );
}