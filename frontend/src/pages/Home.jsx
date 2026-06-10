import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div style={{ maxWidth: '800px', margin: '6rem auto', padding: '0 2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
                Master New Skills with <span style={{ color: 'var(--accent-blue)' }}>Adaptive AI</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '2.5rem' }}>
                LearnForge continuously evaluates your real-time quiz performance to construct a completely customized engineering path built for your specific pace.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                <Link to="/register" className="btn-forge">Get Started Free</Link>
                <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', marginTop: '0.75rem' }}>Sign In &rarr;</Link>
            </div>
        </div>
    );
}