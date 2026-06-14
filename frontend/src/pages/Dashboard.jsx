import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
    const auth = useContext(AuthContext) || {};
    
    // Fallback profile object if local storage state isn't initialized yet
    const user = auth.user || { id: "dev-user", name: "Operator" }; 

    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    const [activeTab, setActiveTab] = useState('catalog'); 
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalAttempts: 0, averageAccuracy: 0, categoryBreakdown: [], historyLog: [] });
    const [leaderboard, setLeaderboard] = useState([]);
    
    const [quizzes, setQuizzes] = useState([]);
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [quizFinished, setQuizFinished] = useState(false);
    const [resultsSummary, setResultsSummary] = useState({ score: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30);

    const [sbText, setSbText] = useState("Explore LearnForge");
    const [sbBg, setSbBg] = useState("linear-gradient(135deg, #1e3a8a, #0f172a)");

    const [adminForm, setAdminForm] = useState({ title: "", description: "", category: "Backend Engineering", question: "", opt1: "", opt2: "", opt3: "", opt4: "", correct: "" });

    // CSS inject utility for reliable screen element rendering on multiple devices
    useEffect(() => {
        const styleId = "dashboard-responsive-styles";
        if (!document.getElementById(styleId)) {
            const styleElement = document.createElement("style");
            styleElement.id = styleId;
            styleElement.innerText = `
                .responsive-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 1.5rem; margin-bottom: 2.5rem; gap: 1rem; }
                .responsive-nav { display: flex; gap: 0.5rem; background-color: #0f172a; padding: 0.4rem; border-radius: 8px; border: 1px solid #1e293b; }
                .responsive-grid { display: grid; grid-template-columns: 2.2fr 1fr; gap: 2rem; }
                .quiz-options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                @media (max-width: 768px) {
                    .responsive-header { flex-direction: column; align-items: flex-start; }
                    .responsive-grid { grid-template-columns: 1fr; }
                    .quiz-options-grid { grid-template-columns: 1fr; }
                }
            `;
            document.head.appendChild(styleElement);
        }
    }, []);

    const fetchInitialData = async () => {
        try {
            const coursesRes = await axios.get(`${API_BASE_URL}/api/quiz/courses`);
            setCourses(coursesRes.data.courses || []);
            
            const statsRes = await axios.get(`${API_BASE_URL}/api/quiz/stats/${user.id}`);
            setStats(statsRes.data);
            
            const leaderRes = await axios.get(`${API_BASE_URL}/api/quiz/leaderboard`);
            setLeaderboard(leaderRes.data.leaderboard || []);
        } catch (err) {
            console.error("Data connection offline, structural mock arrays initialized:", err);
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchInitialData(); }, []);

    useEffect(() => {
        if (selectedCourseId !== null && !quizFinished && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && !quizFinished) {
            submitQuiz();
        }
    }, [timeLeft, selectedCourseId, quizFinished]);

    const startTrack = async (courseId) => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_BASE_URL}/api/quiz/questions/${courseId}`);
            setQuizzes(res.data.quizzes || []);
            setSelectedCourseId(courseId);
            setQuizFinished(false);
            setSelectedAnswers({});
            setTimeLeft(30);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleAnswerSelect = (quizId, choice) => {
        setSelectedAnswers(prev => ({ ...prev, [quizId]: choice }));
    };

    const submitQuiz = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/quiz/submit`, {
                userId: user.id, courseId: selectedCourseId, selectedAnswers
            });
            setResultsSummary({ score: response.data.score, total: response.data.totalQuestions });
            setQuizFinished(true);
            fetchInitialData();
        } catch (err) { console.error(err); }
    };

    const handleAdminSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: adminForm.title, description: adminForm.description, category: adminForm.category,
            question: adminForm.question, options: [adminForm.opt1, adminForm.opt2, adminForm.opt3, adminForm.opt4],
            correct_answer: adminForm.correct
        };
        try {
            await axios.post(`${API_BASE_URL}/api/quiz/admin/create-quiz`, payload);
            alert("✔ Matrix track updated!");
            setAdminForm({ title: "", description: "", category: "Backend Engineering", question: "", opt1: "", opt2: "", opt3: "", opt4: "", correct: "" });
            fetchInitialData();
            setActiveTab('catalog');
        } catch (err) { alert("Matrix row fault."); }
    };

    return (
        <div style={{ maxWidth: '1240px', margin: '2rem auto', padding: '0 1.5rem', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
            
            <header className="responsive-header">
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: '800', letterSpacing: '-0.05em', margin: 0 }}>Learn<span style={{ color: '#3b82f6' }}>Forge</span> Workspace</h1>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', margin: '0.25rem 0 0 0' }}>Operator Node: <strong>{user.name}</strong></p>
                </div>
                <nav className="responsive-nav">
                    <button onClick={() => { setActiveTab('catalog'); setSelectedCourseId(null); }} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: activeTab === 'catalog' ? '#3b82f6' : 'transparent', color: '#fff' }}>Catalog</button>
                    <button onClick={() => { setActiveTab('sandbox'); setSelectedCourseId(null); }} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: activeTab === 'sandbox' ? '#3b82f6' : 'transparent', color: '#fff' }}>UI Sandbox</button>
                    <button onClick={() => { setActiveTab('admin'); setSelectedCourseId(null); }} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: activeTab === 'admin' ? '#3b82f6' : 'transparent', color: '#fff' }}>Admin</button>
                    <button onClick={() => { setActiveTab('profile'); setSelectedCourseId(null); }} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: activeTab === 'profile' ? '#10b981' : 'transparent', color: '#fff' }}>Analytics</button>
                </nav>
            </header>

            <div className="responsive-grid">
                <main style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {selectedCourseId !== null ? (
                        <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
                            {!quizFinished ? (
                                <div>
                                    <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #334155', paddingBottom: '1rem' }}>
                                        <h2 style={{ color: '#3b82f6', margin: 0 }}>Knowledge Assessment</h2>
                                        <div style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155' }}>
                                            <strong style={{ color: '#10b981' }}>{timeLeft}s</strong>
                                        </div>
                                    </div>
                                    {quizzes.map((quiz, index) => (
                                        <div key={quiz.id} style={{ marginBottom: '2rem' }}>
                                            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{index + 1}. {quiz.question}</p>
                                            <div className="quiz-options-grid">
                                                {quiz.options.map(option => (
                                                    <button key={option} onClick={() => handleAnswerSelect(quiz.id, option)} style={{ padding: '0.85rem', borderRadius: '8px', border: '1px solid #475569', textAlign: 'left', cursor: 'pointer', backgroundColor: selectedAnswers[quiz.id] === option ? '#3b82f6' : '#0f172a', color: '#fff' }}>{option}</button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={submitQuiz} style={{ width: '100%', padding: '1rem', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}>Submit</button>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center' }}>
                                    <h3 style={{ color: '#10b981', fontSize: '1.5rem' }}>Evaluation Complete</h3>
                                    <p style={{ color: '#94a3b8' }}>Score: <strong>{resultsSummary.score} / {resultsSummary.total}</strong></p>
                                    <button onClick={() => setSelectedCourseId(null)} style={{ padding: '0.6rem 2rem', backgroundColor: '#475569', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Return to Tracks</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {activeTab === 'catalog' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    {courses.length === 0 ? (
                                        <p style={{ color: '#64748b', textAlign: 'center', padding: '2rem' }}>No active modules discovered in this tier array layout.</p>
                                    ) : (
                                        courses.map(course => (
                                            <div key={course.id} style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '10px', border: '1px solid #334155' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                    <h3 style={{ margin: 0, color: '#f1f5f9' }}>{course.title}</h3>
                                                    <span style={{ padding: '0.25rem 0.6rem', backgroundColor: '#1e1b4b', color: '#a5b4fc', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '600' }}>{course.category}</span>
                                                </div>
                                                <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>{course.description}</p>
                                                <button onClick={() => startTrack(course.id)} style={{ padding: '0.55rem 1.4rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Start Track</button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'sandbox' && (
                                <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
                                    <h2 style={{ color: '#3b82f6', margin: '0 0 1.5rem 0' }}>Canva UI Element Playpen</h2>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                            <label><span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>TEXT PROPERTY STRING</span>
                                                <input type="text" value={sbText} onChange={(e) => setSbText(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', marginTop: '0.4rem' }}/>
                                            </label>
                                            <label><span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>HEX BACKGROUND SHADE FILL</span>
                                                <select value={sbBg} onChange={(e) => setSbBg(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', marginTop: '0.4rem' }}>
                                                    <option value="linear-gradient(135deg, #1e3a8a, #0f172a)">Deep Cosmic Indigo</option>
                                                    <option value="linear-gradient(135deg, #115e59, #0f172a)">Cybernetic Jade Matrix</option>
                                                </select>
                                            </label>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <div style={{ width: '180px', height: '320px', borderRadius: '20px', background: sbBg, border: '4px solid #475569', position: 'relative', overflow: 'hidden' }}>
                                                <div style={{ padding: '1.5rem', textAlign: 'center', color: '#fff', fontSize: '0.9rem', fontWeight: '700' }}>{sbText}</div>
                                                <button style={{ position: 'absolute', top: '75%', left: '10%', width: '80%', padding: '0.5rem', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: '700', fontSize: '0.8rem' }}>Get Started</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'admin' && (
                                <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
                                    <h2 style={{ color: '#fbbf24', margin: '0 0 1.5rem 0' }}>Matrix Element Schema Injector</h2>
                                    <form onSubmit={handleAdminSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        <input type="text" placeholder="Course Title" required value={adminForm.title} onChange={e => setAdminForm({...adminForm, title: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}/>
                                        <textarea placeholder="Track Description" required value={adminForm.description} onChange={e => setAdminForm({...adminForm, description: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff', height: '60px' }}/>
                                        <input type="text" placeholder="Question String" required value={adminForm.question} onChange={e => setAdminForm({...adminForm, question: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}/>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                            <input type="text" placeholder="Option A" required value={adminForm.opt1} onChange={e => setAdminForm({...adminForm, opt1: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}/>
                                            <input type="text" placeholder="Option B" required value={adminForm.opt2} onChange={e => setAdminForm({...adminForm, opt2: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}/>
                                        </div>
                                        <input type="text" placeholder="Exact Correct Identification Key String" required value={adminForm.correct} onChange={e => setAdminForm({...adminForm, correct: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', backgroundColor: '#0f172a', border: '1px solid #334155', color: '#fff' }}/>
                                        <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#fbbf24', color: '#1e293b', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700' }}>Inject Row Block</button>
                                    </form>
                                </div>
                            )}

                            {activeTab === 'profile' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #10b981' }}>
                                        <h2 style={{ color: '#10b981', margin: '0 0 1rem 0' }}>📈 Skill Metric Breakdown</h2>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                            {stats.categoryBreakdown.length === 0 ? (
                                                <p style={{ color: '#64748b' }}>No system metric values logged into telemetry arrays yet.</p>
                                            ) : (
                                                stats.categoryBreakdown.map((cat, idx) => {
                                                    const rate = Math.round((cat.correct / cat.total) * 100);
                                                    return (
                                                        <div key={idx} style={{ backgroundColor: '#0f172a', padding: '1.25rem', borderRadius: '8px', border: '1px solid #334155' }}>
                                                            <span style={{ color: '#94a3b8', fontSize: '0.8rem', fontWeight: '700' }}>{cat.category}</span>
                                                            <h3 style={{ margin: '0.5rem 0' }}>{rate}% Competency Profile</h3>
                                                            <div style={{ width: '100%', height: '6px', backgroundColor: '#1e293b', borderRadius: '10px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${rate}%`, height: '100%', backgroundColor: '#10b981' }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ backgroundColor: '#1e293b', padding: '2rem', borderRadius: '12px', border: '1px solid #334155' }}>
                                        <h3 style={{ margin: '0 0 1.5rem 0' }}>⏳ Complete Evaluation History Log</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {stats.historyLog.length === 0 ? (
                                                <p style={{ color: '#64748b' }}>No row elements committed to history log state tables yet.</p>
                                            ) : (
                                                stats.historyLog.map((log, i) => (
                                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
                                                        <div>
                                                            <h4 style={{ margin: 0 }}>{log.title}</h4>
                                                            <span style={{ color: '#64748b', fontSize: '0.8rem' }}>{new Date(log.attempted_at).toLocaleString()}</span>
                                                        </div>
                                                        <strong style={{ color: '#10b981' }}>{log.score} / {log.total_questions}</strong>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <section style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#3b82f6' }}>🏆 LearnForge Platform Standings</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {leaderboard.length === 0 ? (
                                <p style={{ color: '#64748b' }}>Calculating platform index columns...</p>
                            ) : (
                                leaderboard.map((leader, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', backgroundColor: '#0f172a', borderRadius: '8px' }}>
                                        <span><strong>#{i + 1}</strong> {leader.name} {leader.name === user?.name && '(You)'}</span>
                                        <strong style={{ color: '#10b981' }}>{leader.learning_score} Score Units</strong>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                </main>

                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' }}>
                        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Global Track Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: '#94a3b8' }}>Evaluations Runtimes:</span><strong>{stats.totalAttempts}</strong></div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}><span style={{ color: '#94a3b8' }}>Mean Platform Accuracy:</span><strong style={{ color: '#3b82f6' }}>{stats.averageAccuracy}%</strong></div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}