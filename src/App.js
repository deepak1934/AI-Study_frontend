import { useState, useEffect, useRef } from "react";

// const API_BASE = "http://localhost:5000/api";
// If this prints "undefined/api" — your env var isn't loading
const API_BASE = process.env.REACT_APP_BACKEND_BASEURL
  ? `${process.env.REACT_APP_BACKEND_BASEURL}/api`
  : "http://localhost:5000/api";


const fonts = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');`;

const styles = `
  ${fonts}
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #1a1a24;
    --surface3: #22222f;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #f0eff8;
    --text2: #9998b0;
    --text3: #5c5b72;
    --accent: #7c6dfa;
    --accent2: #5b4de0;
    --accent3: #a99bfc;
    --gold: #f5c542;
    --green: #3fcf8e;
    --red: #f56565;
    --pink: #f06292;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --r: 14px;
    --r2: 20px;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }

  @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(124,109,250,0.3); } 50% { box-shadow: 0 0 40px rgba(124,109,250,0.6); } }
  @keyframes slideIn { from { transform:translateX(-10px); opacity:0; } to { transform:translateX(0); opacity:1; } }
  @keyframes countUp { from { opacity:0; transform:scale(0.8); } to { opacity:1; transform:scale(1); } }
  @keyframes timerPulse { 0%,100% { color: var(--text); } 50% { color: var(--gold); } }
  @keyframes timerGlow { 0%,100% { box-shadow: 0 0 30px rgba(124,109,250,0.2); } 50% { box-shadow: 0 0 60px rgba(124,109,250,0.5); } }
  @keyframes taskSlide { from { opacity:0; transform:translateX(-16px); } to { opacity:1; transform:translateX(0); } }
  @keyframes cardFlip { from { transform: rotateY(90deg); opacity:0; } to { transform: rotateY(0); opacity:1; } }

  .app { display:flex; min-height:100vh; }

  /* Sidebar */
  .sidebar {
    width: 240px; min-height:100vh; background: var(--surface);
    border-right: 1px solid var(--border); display:flex; flex-direction:column;
    position: fixed; left:0; top:0; bottom:0; z-index:100;
    animation: fadeIn 0.4s ease;
  }
  .logo {
    padding: 28px 24px 20px; font-family: var(--font-head); font-size:20px; font-weight:800;
    letter-spacing: -0.5px; display:flex; align-items:center; gap:10px;
  }
  .logo-icon {
    width:34px; height:34px; border-radius:10px; background: linear-gradient(135deg, var(--accent), var(--pink));
    display:flex; align-items:center; justify-content:center; font-size:16px;
    animation: glow 3s ease infinite;
  }
  .nav { flex:1; padding: 8px 12px; display:flex; flex-direction:column; gap:2px; }
  .nav-item {
    display:flex; align-items:center; gap:12px; padding:11px 14px; border-radius:10px;
    cursor:pointer; font-size:14px; font-weight:500; color: var(--text2); transition: all 0.2s;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(124,109,250,0.15); color: var(--accent3); border-color: rgba(124,109,250,0.2); }
  .nav-icon { font-size:17px; width:20px; text-align:center; }
  .nav-label { font-family: var(--font-body); }

  .user-section {
    padding: 16px 12px; border-top: 1px solid var(--border);
  }
  .user-card {
    display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:10px;
    background: var(--surface2);
  }
  .avatar {
    width:34px; height:34px; border-radius:50%; background: linear-gradient(135deg, var(--accent), var(--pink));
    display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:700; color:#fff; flex-shrink:0;
  }
  .user-name { font-size:13px; font-weight:500; }
  .user-email { font-size:11px; color: var(--text3); margin-top:1px; }
  .logout-btn {
    margin-left:auto; background:none; border:none; color: var(--text3); cursor:pointer; font-size:16px; padding:4px;
    border-radius:6px; transition: color 0.2s;
  }
  .logout-btn:hover { color: var(--red); }

  /* Main content */
  .main { margin-left: 240px; flex:1; min-height:100vh; }
  .page { padding: 36px 40px; animation: fadeUp 0.4s ease; }
  .page-title { font-family: var(--font-head); font-size:28px; font-weight:800; margin-bottom:6px; }
  .page-sub { color: var(--text2); font-size:14px; margin-bottom:32px; }

  /* Auth */
  .auth-wrapper {
    min-height:100vh; display:flex; align-items:center; justify-content:center;
    background: var(--bg); position:relative; overflow:hidden;
  }
  .auth-bg {
    position:absolute; inset:0; pointer-events:none;
    background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(124,109,250,0.12) 0%, transparent 70%);
  }
  .auth-card {
    background: var(--surface); border: 1px solid var(--border2); border-radius:24px;
    padding: 44px 40px; width:400px; position:relative; z-index:1;
    animation: fadeUp 0.5s ease;
    box-shadow: 0 0 60px rgba(0,0,0,0.5);
  }
  .auth-logo { font-family: var(--font-head); font-size:24px; font-weight:800; text-align:center; margin-bottom:8px; }
  .auth-sub { color: var(--text2); text-align:center; font-size:14px; margin-bottom:32px; }
  .auth-tab { display:flex; background: var(--surface2); border-radius:10px; padding:4px; margin-bottom:28px; }
  .auth-tab-btn {
    flex:1; padding:9px; border-radius:8px; border:none; background:none; color: var(--text2);
    font-family: var(--font-body); font-size:14px; font-weight:500; cursor:pointer; transition: all 0.2s;
  }
  .auth-tab-btn.active { background: var(--surface3); color: var(--text); }
  .form-group { margin-bottom:16px; }
  .form-label { display:block; font-size:13px; font-weight:500; color: var(--text2); margin-bottom:8px; }
  .form-input {
    width:100%; padding:12px 16px; background: var(--surface2); border:1px solid var(--border2);
    border-radius:10px; color: var(--text); font-family: var(--font-body); font-size:14px;
    transition: border-color 0.2s, box-shadow 0.2s; outline:none;
  }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(124,109,250,0.15); }
  .btn {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    padding:12px 22px; border-radius:10px; border:none; cursor:pointer;
    font-family: var(--font-body); font-size:14px; font-weight:500; transition: all 0.2s;
  }
  .btn-primary {
    background: linear-gradient(135deg, var(--accent), var(--accent2)); color:#fff; width:100%;
    box-shadow: 0 4px 15px rgba(124,109,250,0.35);
  }
  .btn-primary:hover { transform:translateY(-1px); box-shadow: 0 6px 20px rgba(124,109,250,0.45); }
  .btn-primary:active { transform:translateY(0); }
  .btn-primary:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  .btn-ghost { background: var(--surface2); color: var(--text2); border:1px solid var(--border); }
  .btn-ghost:hover { background: var(--surface3); color: var(--text); }
  .btn-danger { background: rgba(245,101,101,0.15); color: var(--red); border:1px solid rgba(245,101,101,0.2); }
  .btn-danger:hover { background: rgba(245,101,101,0.25); }
  .btn-green { background: rgba(63,207,142,0.15); color: var(--green); border:1px solid rgba(63,207,142,0.2); }
  .btn-green:hover { background: rgba(63,207,142,0.25); }
  .err-msg { color: var(--red); font-size:13px; margin-top:12px; text-align:center; }

  /* Cards */
  .card {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    overflow:hidden; transition: border-color 0.2s, transform 0.2s;
  }
  .card:hover { border-color: var(--border2); }

  /* Stats row */
  .stats-row { display:grid; grid-template-columns: repeat(4,1fr); gap:16px; margin-bottom:32px; }
  .stat-card {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    padding: 22px 24px; animation: fadeUp 0.4s ease both;
  }
  .stat-card:nth-child(1) { animation-delay:0.05s; }
  .stat-card:nth-child(2) { animation-delay:0.1s; }
  .stat-card:nth-child(3) { animation-delay:0.15s; }
  .stat-card:nth-child(4) { animation-delay:0.2s; }
  .stat-icon { font-size:22px; margin-bottom:12px; }
  .stat-val { font-family: var(--font-head); font-size:32px; font-weight:800; line-height:1; animation: countUp 0.5s ease; }
  .stat-label { color: var(--text2); font-size:13px; margin-top:6px; }

  /* Upload zone */
  .upload-zone {
    border: 2px dashed var(--border2); border-radius: var(--r2); padding:48px 32px;
    text-align:center; cursor:pointer; transition: all 0.25s; background: var(--surface);
  }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(124,109,250,0.05); }
  .upload-icon { font-size:48px; margin-bottom:16px; }
  .upload-title { font-family: var(--font-head); font-size:18px; font-weight:700; margin-bottom:8px; }
  .upload-sub { color: var(--text2); font-size:14px; }
  .upload-form { display:flex; flex-direction:column; gap:16px; }
  .progress-bar { height:4px; background: var(--surface2); border-radius:2px; overflow:hidden; margin-top:8px; }
  .progress-fill { height:100%; background: linear-gradient(90deg, var(--accent), var(--pink)); border-radius:2px; transition: width 0.3s; background-size:200% 100%; animation: shimmer 1.5s infinite; }

  /* Notes grid */
  .notes-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap:20px; }
  .note-card {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    padding:24px; cursor:pointer; transition: all 0.25s; animation: fadeUp 0.4s ease both;
    position:relative; overflow:hidden;
  }
  .note-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background: linear-gradient(90deg, var(--accent), var(--pink)); opacity:0; transition: opacity 0.25s;
  }
  .note-card:hover { border-color: var(--border2); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
  .note-card:hover::before { opacity:1; }
  .note-title { font-family: var(--font-head); font-size:16px; font-weight:700; margin-bottom:8px; }
  .note-meta { color: var(--text3); font-size:12px; display:flex; gap:12px; align-items:center; }
  .note-tag { display:inline-flex; align-items:center; gap:4px; background: rgba(124,109,250,0.12); color: var(--accent3); padding:3px 10px; border-radius:20px; font-size:11px; font-weight:500; }
  .note-summary { color: var(--text2); font-size:13px; line-height:1.6; margin:12px 0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
  .note-actions { display:flex; gap:8px; margin-top:16px; }

  /* Note detail */
  .note-detail { animation: fadeIn 0.3s ease; }
  .back-btn { display:inline-flex; align-items:center; gap:8px; color: var(--text2); cursor:pointer; font-size:14px; margin-bottom:24px; transition: color 0.2s; }
  .back-btn:hover { color: var(--text); }
  .section-title { font-family: var(--font-head); font-size:16px; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .summary-box { background: var(--surface2); border-radius: var(--r); padding:20px; color: var(--text2); font-size:14px; line-height:1.8; white-space:pre-wrap; }
  .flashcard-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(240px,1fr)); gap:12px; }
  .flashcard {
    background: var(--surface2); border:1px solid var(--border); border-radius: var(--r);
    padding:18px; cursor:pointer; transition: all 0.25s; perspective: 600px; min-height:100px;
  }
  .flashcard.flipped .fc-front { display:none; }
  .flashcard:not(.flipped) .fc-back { display:none; }
  .fc-q { font-size:13px; font-weight:500; margin-bottom:8px; }
  .fc-a { font-size:13px; color: var(--green); }
  .fc-hint { font-size:11px; color: var(--text3); margin-top:8px; }
  .flashcard:hover { border-color: var(--border2); transform: scale(1.02); }

  /* Quiz */
  .quiz-wrapper { max-width:700px; margin:0 auto; }
  .quiz-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:28px; }
  .quiz-progress-wrap { flex:1; max-width:200px; }
  .quiz-q { font-family: var(--font-head); font-size:11px; font-weight:700; color: var(--text3); text-transform:uppercase; letter-spacing:1px; margin-bottom:6px; }
  .quiz-progress { height:4px; background: var(--surface2); border-radius:2px; overflow:hidden; }
  .quiz-progress-fill { height:100%; background: linear-gradient(90deg, var(--accent), var(--green)); border-radius:2px; transition: width 0.4s ease; }
  .timer {
    font-family: var(--font-head); font-size:22px; font-weight:800; color: var(--gold);
    background: rgba(245,197,66,0.1); padding:8px 18px; border-radius:10px;
    border:1px solid rgba(245,197,66,0.2);
  }
  .timer.urgent { animation: timerPulse 0.5s ease infinite; color: var(--red); background: rgba(245,101,101,0.1); border-color: rgba(245,101,101,0.2); }
  .question-card { background: var(--surface); border:1px solid var(--border); border-radius:20px; padding:32px; margin-bottom:20px; animation: slideIn 0.3s ease; }
  .question-text { font-family: var(--font-head); font-size:20px; font-weight:700; line-height:1.4; margin-bottom:28px; }
  .option {
    display:flex; align-items:center; gap:14px; padding:14px 18px; border-radius:12px;
    border:1px solid var(--border); background: var(--surface2); cursor:pointer;
    transition: all 0.2s; margin-bottom:10px; font-size:14px; font-weight:500;
  }
  .option:hover:not(.selected):not(.correct):not(.wrong) { border-color: var(--accent); background: rgba(124,109,250,0.1); }
  .option.selected { border-color: var(--accent); background: rgba(124,109,250,0.15); color: var(--accent3); }
  .option.correct { border-color: var(--green); background: rgba(63,207,142,0.12); color: var(--green); }
  .option.wrong { border-color: var(--red); background: rgba(245,101,101,0.12); color: var(--red); }
  .opt-letter { width:30px; height:30px; border-radius:50%; background: var(--surface3); display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
  .quiz-nav { display:flex; justify-content:flex-end; gap:12px; }

  /* Results */
  .result-card { background: var(--surface); border:1px solid var(--border); border-radius:24px; padding:48px; text-align:center; max-width:560px; margin:0 auto; animation: fadeUp 0.5s ease; }
  .result-score { font-family: var(--font-head); font-size:80px; font-weight:800; background: linear-gradient(135deg, var(--accent), var(--green)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation: countUp 0.6s ease; }
  .result-label { font-size:16px; color: var(--text2); margin-bottom:24px; }
  .result-emoji { font-size:60px; margin-bottom:16px; }

  /* History */
  .history-list { display:flex; flex-direction:column; gap:12px; }
  .history-item {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    padding:20px 24px; display:flex; align-items:center; gap:20px; animation: fadeUp 0.3s ease both;
  }
  .history-score { font-family: var(--font-head); font-size:28px; font-weight:800; }
  .history-score.good { color: var(--green); }
  .history-score.ok { color: var(--gold); }
  .history-score.bad { color: var(--red); }
  .score-bar-wrap { flex:1; }
  .score-bar { height:6px; background: var(--surface2); border-radius:3px; overflow:hidden; margin-top:8px; }
  .score-bar-fill { height:100%; border-radius:3px; transition: width 0.8s ease; }

  /* Loading spinner */
  .spinner { width:20px; height:20px; border:2px solid rgba(255,255,255,0.2); border-top-color:#fff; border-radius:50%; animation: spin 0.7s linear infinite; }

  /* Empty */
  .empty { text-align:center; padding:64px 32px; color: var(--text2); }
  .empty-icon { font-size:48px; margin-bottom:16px; }
  .empty-title { font-family: var(--font-head); font-size:18px; font-weight:700; color: var(--text); margin-bottom:8px; }

  /* Tabs */
  .tabs { display:flex; gap:4px; background: var(--surface2); border-radius:10px; padding:4px; margin-bottom:28px; }
  .tab-btn { flex:1; padding:8px 16px; border-radius:8px; border:none; background:none; color: var(--text2); font-family: var(--font-body); font-size:13px; font-weight:500; cursor:pointer; transition: all 0.2s; }
  .tab-btn.active { background: var(--surface); color: var(--text); }

  /* Badge */
  .badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; }
  .badge-accent { background: rgba(124,109,250,0.15); color: var(--accent3); }
  .badge-green { background: rgba(63,207,142,0.15); color: var(--green); }
  .badge-gold { background: rgba(245,197,66,0.15); color: var(--gold); }

  /* Notification */
  .notif {
    position:fixed; bottom:24px; right:24px; background: var(--surface); border:1px solid var(--border2);
    border-radius:12px; padding:14px 20px; font-size:14px; z-index:1000; animation: fadeUp 0.3s ease;
    display:flex; align-items:center; gap:10px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .notif.success { border-color: rgba(63,207,142,0.3); }
  .notif.error { border-color: rgba(245,101,101,0.3); }

  /* ── Focus Room ─────────────────────────────────────────────────────────── */
  .focus-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 24px;
    align-items: start;
  }

  /* Left panel */
  .focus-left { display:flex; flex-direction:column; gap:20px; }

  /* Timer card */
  .focus-timer-card {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    padding: 28px 24px; text-align:center;
    animation: fadeUp 0.4s ease both;
  }
  .focus-timer-mode { display:flex; gap:4px; background: var(--surface2); border-radius:10px; padding:4px; margin-bottom:24px; }
  .focus-mode-btn {
    flex:1; padding:7px 10px; border-radius:7px; border:none; background:none;
    color: var(--text3); font-family: var(--font-body); font-size:12px; font-weight:600;
    cursor:pointer; transition: all 0.2s; letter-spacing:0.3px;
  }
  .focus-mode-btn.active { background: var(--surface3); color: var(--accent3); }
  .focus-clock {
    font-family: var(--font-head); font-size:64px; font-weight:800; letter-spacing:-2px;
    color: var(--text); line-height:1; margin-bottom:8px;
    animation: timerGlow 4s ease infinite;
    text-shadow: 0 0 40px rgba(124,109,250,0.3);
  }
  .focus-clock.running { color: var(--accent3); }
  .focus-clock.urgent { color: var(--red); animation: timerPulse 0.6s ease infinite; }
  .focus-session-label { font-size:12px; color: var(--text3); margin-bottom:20px; font-weight:500; letter-spacing:0.5px; }
  .focus-timer-controls { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }
  .focus-ctrl-btn {
    padding:10px 22px; border-radius:10px; border:none; cursor:pointer; font-family: var(--font-body);
    font-size:13px; font-weight:600; transition: all 0.2s; display:inline-flex; align-items:center; gap:7px;
  }
  .focus-ctrl-start {
    background: linear-gradient(135deg, var(--accent), var(--accent2)); color:#fff;
    box-shadow: 0 4px 14px rgba(124,109,250,0.4);
  }
  .focus-ctrl-start:hover { transform:translateY(-1px); box-shadow: 0 6px 18px rgba(124,109,250,0.5); }
  .focus-ctrl-pause { background: rgba(245,197,66,0.12); color: var(--gold); border:1px solid rgba(245,197,66,0.25); }
  .focus-ctrl-pause:hover { background: rgba(245,197,66,0.2); }
  .focus-ctrl-reset { background: var(--surface2); color: var(--text3); border:1px solid var(--border); }
  .focus-ctrl-reset:hover { color: var(--text2); background: var(--surface3); }
  .pomodoro-dots { display:flex; gap:6px; justify-content:center; margin-top:16px; }
  .pomo-dot { width:8px; height:8px; border-radius:50%; background: var(--surface3); transition: all 0.3s; }
  .pomo-dot.done { background: var(--accent); }
  .pomo-dot.current { background: var(--green); box-shadow: 0 0 8px rgba(63,207,142,0.6); }
  .countdown-inputs { display:flex; gap:8px; align-items:center; justify-content:center; margin-bottom:16px; }
  .time-input {
    width:60px; text-align:center; padding:8px; background: var(--surface2); border:1px solid var(--border2);
    border-radius:8px; color: var(--text); font-family: var(--font-head); font-size:20px; font-weight:700; outline:none;
  }
  .time-input:focus { border-color: var(--accent); }
  .time-sep { font-family: var(--font-head); font-size:22px; font-weight:800; color: var(--text3); }

  /* Tasks card */
  .focus-tasks-card {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    padding:22px 20px; animation: fadeUp 0.4s ease 0.1s both;
  }
  .tasks-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:16px; }
  .tasks-title { font-family: var(--font-head); font-size:15px; font-weight:700; display:flex; align-items:center; gap:8px; }
  .tasks-count { font-size:12px; color: var(--text3); background: var(--surface2); padding:2px 8px; border-radius:20px; font-weight:600; }
  .task-add-row { display:flex; gap:8px; margin-bottom:14px; }
  .task-input {
    flex:1; padding:9px 14px; background: var(--surface2); border:1px solid var(--border);
    border-radius:9px; color: var(--text); font-family: var(--font-body); font-size:13px; outline:none; transition: border-color 0.2s;
  }
  .task-input:focus { border-color: var(--accent); }
  .task-add-btn {
    padding:9px 14px; border-radius:9px; border:none; background: var(--accent); color:#fff;
    cursor:pointer; font-size:18px; font-weight:700; line-height:1; transition: all 0.2s;
  }
  .task-add-btn:hover { background: var(--accent2); transform:scale(1.05); }
  .task-list { display:flex; flex-direction:column; gap:6px; max-height:260px; overflow-y:auto; }
  .task-list::-webkit-scrollbar { width:4px; }
  .task-list::-webkit-scrollbar-track { background:transparent; }
  .task-list::-webkit-scrollbar-thumb { background: var(--border2); border-radius:4px; }
  .task-item {
    display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:9px;
    background: var(--surface2); border:1px solid var(--border); animation: taskSlide 0.25s ease both;
    transition: opacity 0.2s;
  }
  .task-item.done { opacity:0.5; }
  .task-check {
    width:18px; height:18px; border-radius:5px; border:2px solid var(--border2); background:none;
    cursor:pointer; flex-shrink:0; display:flex; align-items:center; justify-content:center;
    transition: all 0.2s;
  }
  .task-check.checked { background: var(--green); border-color: var(--green); }
  .task-check.checked::after { content:'✓'; font-size:11px; color:#fff; font-weight:700; }
  .task-text { flex:1; font-size:13px; font-weight:500; transition: all 0.2s; }
  .task-item.done .task-text { text-decoration:line-through; color: var(--text3); }
  .task-del { background:none; border:none; color: var(--text3); cursor:pointer; font-size:14px; padding:2px 4px; border-radius:4px; transition: color 0.2s; opacity:0; }
  .task-item:hover .task-del { opacity:1; }
  .task-del:hover { color: var(--red); }
  .tasks-progress { margin-top:12px; }
  .tasks-progress-bar { height:3px; background: var(--surface3); border-radius:2px; overflow:hidden; margin-top:6px; }
  .tasks-progress-fill { height:100%; background: linear-gradient(90deg, var(--green), var(--accent)); border-radius:2px; transition: width 0.5s ease; }
  .tasks-progress-label { font-size:11px; color: var(--text3); font-weight:600; }

  /* Right panel — PDF + Questions */
  .focus-right { display:flex; flex-direction:column; gap:20px; animation: fadeUp 0.4s ease 0.15s both; }
  .focus-pdf-card {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    padding:24px;
  }
  .focus-pdf-header { font-family: var(--font-head); font-size:15px; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px; }
  .focus-upload-mini {
    border:2px dashed var(--border2); border-radius: var(--r); padding:28px 20px;
    text-align:center; cursor:pointer; transition: all 0.25s;
  }
  .focus-upload-mini:hover, .focus-upload-mini.drag { border-color: var(--accent); background: rgba(124,109,250,0.04); }
  .focus-upload-mini-icon { font-size:32px; margin-bottom:10px; }
  .focus-upload-mini-text { font-size:14px; font-weight:600; color: var(--text2); margin-bottom:4px; }
  .focus-upload-mini-sub { font-size:12px; color: var(--text3); }
  .focus-file-selected { display:flex; align-items:center; gap:12px; padding:12px 16px; background: var(--surface2); border-radius: var(--r); border:1px solid var(--border2); }
  .focus-file-icon { font-size:24px; }
  .focus-file-name { font-size:13px; font-weight:500; flex:1; }
  .focus-file-size { font-size:11px; color: var(--text3); }
  .focus-gen-btn {
    width:100%; margin-top:14px; padding:12px; border-radius:10px; border:none;
    background: linear-gradient(135deg, var(--accent), var(--accent2)); color:#fff;
    font-family: var(--font-body); font-size:14px; font-weight:600; cursor:pointer; transition: all 0.2s;
    display:flex; align-items:center; justify-content:center; gap:8px;
    box-shadow: 0 4px 14px rgba(124,109,250,0.3);
  }
  .focus-gen-btn:hover { transform:translateY(-1px); box-shadow: 0 6px 18px rgba(124,109,250,0.45); }
  .focus-gen-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }

  /* Questions flashcard view */
  .focus-questions-card {
    background: var(--surface); border:1px solid var(--border); border-radius: var(--r2);
    padding:24px; flex:1;
  }
  .fq-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
  .fq-title { font-family: var(--font-head); font-size:15px; font-weight:700; display:flex; align-items:center; gap:8px; }
  .fq-counter { font-size:12px; color: var(--text3); background: var(--surface2); padding:3px 10px; border-radius:20px; font-weight:600; }
  .fq-card {
    background: var(--surface2); border:1px solid var(--border2); border-radius: var(--r2);
    padding:28px 24px; min-height:160px; display:flex; flex-direction:column; justify-content:space-between;
    animation: cardFlip 0.35s ease both; cursor:pointer; transition: border-color 0.25s;
    position:relative; overflow:hidden;
  }
  .fq-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, var(--accent), var(--pink));
  }
  .fq-card:hover { border-color: var(--accent); }
  .fq-card.revealed { border-color: rgba(63,207,142,0.4); background: rgba(63,207,142,0.04); }
  .fq-label { font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color: var(--text3); margin-bottom:12px; }
  .fq-label.answer { color: var(--green); }
  .fq-text { font-family: var(--font-head); font-size:17px; font-weight:700; line-height:1.5; flex:1; }
  .fq-answer-text { font-size:14px; color: var(--green); line-height:1.7; }
  .fq-hint { font-size:12px; color: var(--text3); margin-top:14px; text-align:center; }
  .fq-options-list { display:flex; flex-direction:column; gap:8px; margin-top:16px; }
  .fq-option {
    padding:10px 14px; border-radius:9px; border:1px solid var(--border); background: var(--surface3);
    font-size:13px; cursor:pointer; transition: all 0.2s; font-weight:500;
  }
  .fq-option:hover { border-color: var(--accent); background: rgba(124,109,250,0.1); }
  .fq-option.correct { border-color: var(--green); background: rgba(63,207,142,0.1); color: var(--green); }
  .fq-option.wrong { border-color: var(--red); background: rgba(245,101,101,0.1); color: var(--red); }
  .fq-nav { display:flex; gap:10px; align-items:center; justify-content:space-between; margin-top:16px; }
  .fq-dots { display:flex; gap:5px; }
  .fq-dot { width:6px; height:6px; border-radius:50%; background: var(--surface3); transition: all 0.2s; cursor:pointer; }
  .fq-dot.active { background: var(--accent); width:18px; border-radius:3px; }
  .fq-dot.answered { background: var(--green); }
  .fq-nav-btn {
    padding:8px 16px; border-radius:9px; border:none; cursor:pointer; font-family: var(--font-body);
    font-size:13px; font-weight:600; background: var(--surface2); color: var(--text2); border:1px solid var(--border); transition: all 0.2s;
    display:inline-flex; align-items:center; gap:6px;
  }
  .fq-nav-btn:hover { background: var(--surface3); color: var(--text); }
  .fq-nav-btn:disabled { opacity:0.3; cursor:not-allowed; }
  .fq-score-mini {
    text-align:center; padding:20px; background: rgba(63,207,142,0.06); border-radius: var(--r2);
    border:1px solid rgba(63,207,142,0.2); margin-top:16px; animation: fadeUp 0.3s ease;
  }
  .fq-score-val { font-family: var(--font-head); font-size:40px; font-weight:800; color: var(--green); }
  .fq-score-label { font-size:13px; color: var(--text2); margin-top:4px; }

  /* Session summary banner */
  .focus-summary-banner {
    background: linear-gradient(135deg, rgba(124,109,250,0.12), rgba(63,207,142,0.08));
    border:1px solid rgba(124,109,250,0.2); border-radius: var(--r2);
    padding:20px 24px; display:flex; align-items:center; gap:24px; flex-wrap:wrap;
    animation: fadeUp 0.4s ease;
  }
  .fsb-stat { text-align:center; }
  .fsb-val { font-family: var(--font-head); font-size:24px; font-weight:800; }
  .fsb-label { font-size:11px; color: var(--text3); font-weight:600; letter-spacing:0.5px; margin-top:2px; }

  @media (max-width: 1100px) {
    .focus-layout { grid-template-columns: 300px 1fr; }
  }
  @media (max-width: 900px) {
    .stats-row { grid-template-columns: repeat(2,1fr); }
    .sidebar { width:200px; }
    .main { margin-left:200px; }
    .page { padding: 24px 20px; }
    .focus-layout { grid-template-columns: 1fr; }
  }
`;

// ─── Utilities ────────────────────────────────────────────────────────────────
const token = () => localStorage.getItem("token");
const apiFetch = async (path, opts = {}) => {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}`, ...opts.headers },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

const initials = (n = "") => n.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};
const fmt2 = (n) => String(n).padStart(2, "0");

// ─── Notification ──────────────────────────────────────────────────────────────
function Notification({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`notif ${type}`}>
      <span>{type === "success" ? "✓" : "✕"}</span>
      {msg}
    </div>
  );
}

// ─── Auth Page ─────────────────────────────────────────────────────────────────
function AuthPage({ onAuth }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const path = tab === "login" ? "/auth/login" : "/auth/register";
      const body = tab === "login" ? { email: form.email, password: form.password } : form;
      const data = await apiFetch(path, { method: "POST", body: JSON.stringify(body) });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
      onAuth({ name: data.name, email: data.email });
    } catch (e) { setErr(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">✦ StudyAI</div>
        <div className="auth-sub">Your AI-powered study companion</div>
        <div className="auth-tab">
          <button className={`auth-tab-btn ${tab === "login" ? "active" : ""}`} onClick={() => setTab("login")}>Sign In</button>
          <button className={`auth-tab-btn ${tab === "register" ? "active" : ""}`} onClick={() => setTab("register")}>Create Account</button>
        </div>
        {tab === "register" && (
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" placeholder="Alex Johnson" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@university.edu" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
            onKeyDown={e => e.key === "Enter" && submit()} />
        </div>
        <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ marginTop: 8 }}>
          {loading ? <span className="spinner" /> : tab === "login" ? "Sign In" : "Create Account"}
        </button>
        {err && <div className="err-msg">{err}</div>}
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ notes, quizHistory }) {
  const attempted = quizHistory.filter(q => q.score !== undefined && q.score !== null);
  const avgScore = attempted.length ? Math.round(attempted.reduce((a, q) => a + (q.score / q.totalQuestions) * 100, 0) / attempted.length) : 0;
  const perfect = attempted.filter(q => q.score === q.totalQuestions).length;

  const stats = [
    { icon: "📚", val: notes.length, label: "Notes Uploaded", color: "#7c6dfa" },
    { icon: "🧠", val: quizHistory.length, label: "Quizzes Taken", color: "#3fcf8e" },
    { icon: "⚡", val: `${avgScore}%`, label: "Avg Score", color: "#f5c542" },
    { icon: "🏆", val: perfect, label: "Perfect Scores", color: "#f06292" },
  ];

  return (
    <div className="page">
      <div className="page-title">Good to see you! ✦</div>
      <div className="page-sub">Here's your study progress at a glance</div>
      <div className="stats-row">
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {notes.length > 0 && (
        <>
          <div className="section-title">Recent Notes</div>
          <div className="notes-grid">
            {notes.slice(0, 3).map((n, i) => (
              <div key={n._id} className="note-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="note-title">{n.title}</div>
                <div className="note-meta">
                  <span className="note-tag">📄 PDF</span>
                  <span>{timeAgo(n.createdAt)}</span>
                </div>
                <div className="note-summary">{n.summary?.replace(/•/g, "").slice(0, 120)}...</div>
              </div>
            ))}
          </div>
        </>
      )}

      {quizHistory.length > 0 && (
        <>
          <div className="section-title" style={{ marginTop: 32 }}>Recent Quiz Results</div>
          <div className="history-list">
            {quizHistory.slice(0, 3).map((q, i) => {
              const pct = Math.round((q.score / q.totalQuestions) * 100);
              const cls = pct >= 80 ? "good" : pct >= 50 ? "ok" : "bad";
              return (
                <div key={q._id} className="history-item" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className={`history-score ${cls}`}>{pct}%</div>
                  <div className="score-bar-wrap">
                    <div style={{ fontWeight: 500, fontSize: 14 }}>{q.noteId?.title || "Untitled"}</div>
                    <div style={{ color: "var(--text3)", fontSize: 12, marginTop: 2 }}>{q.score}/{q.totalQuestions} correct · {timeAgo(q.attemptedAt)}</div>
                    <div className="score-bar">
                      <div className="score-bar-fill" style={{ width: `${pct}%`, background: pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--gold)" : "var(--red)" }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {notes.length === 0 && (
        <div className="empty" style={{ marginTop: 40 }}>
          <div className="empty-icon">🚀</div>
          <div className="empty-title">Ready to start studying?</div>
          <div>Upload your first PDF note to get started</div>
        </div>
      )}
    </div>
  );
}

// ─── Notes Page ─────────────────────────────────────────────────────────────────
function NotesPage({ notes, onRefresh, onGenerateQuiz, notify }) {
  const [view, setView] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [flip, setFlip] = useState({});
  const [tab, setTab] = useState("summary");
  const fileRef = useRef();

  const upload = async () => {
    if (!file || !title) return notify("Please add a title and select a PDF", "error");
    setUploading(true); setProgress(30);
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      fd.append("title", title);
      setProgress(60);
      const res = await fetch(API_BASE + "/notes/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProgress(100);
      setTimeout(() => { setProgress(0); setFile(null); setTitle(""); onRefresh(); notify("Note uploaded & processed!", "success"); }, 500);
    } catch (e) { notify(e.message, "error"); setProgress(0); }
    finally { setUploading(false); }
  };

  const deleteNote = async (id) => {
    try { await apiFetch(`/notes/${id}`, { method: "DELETE" }); onRefresh(); notify("Note deleted", "success"); }
    catch (e) { notify(e.message, "error"); }
  };

  if (view) return (
    <div className="page note-detail">
      <div className="back-btn" onClick={() => setView(null)}>← Back to Notes</div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="page-title">{view.title}</div>
          <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 4 }}>
            {view.originalFileName} · {timeAgo(view.createdAt)}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => { onGenerateQuiz(view._id, view.title); setView(null); }}>
            ⚡ Generate Quiz
          </button>
          <button className="btn btn-danger" onClick={() => { deleteNote(view._id); setView(null); }}>Delete</button>
        </div>
      </div>
      <div className="tabs">
        <button className={`tab-btn ${tab === "summary" ? "active" : ""}`} onClick={() => setTab("summary")}>📋 Summary</button>
        <button className={`tab-btn ${tab === "flashcards" ? "active" : ""}`} onClick={() => setTab("flashcards")}>🃏 Flashcards ({view.flashcards?.length || 0})</button>
      </div>
      {tab === "summary" && (
        <>
          <div className="section-title">✦ AI Summary</div>
          <div className="summary-box">{view.summary}</div>
        </>
      )}
      {tab === "flashcards" && (
        <>
          <div className="section-title">🃏 Flashcards <span style={{ color: "var(--text3)", fontWeight: 400, fontSize: 13 }}>— click to flip</span></div>
          <div className="flashcard-grid">
            {view.flashcards?.map((fc, i) => (
              <div key={i} className={`flashcard ${flip[i] ? "flipped" : ""}`} onClick={() => setFlip(f => ({ ...f, [i]: !f[i] }))}>
                <div className="fc-front">
                  <div className="fc-q">Q{i + 1}</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{fc.question}</div>
                  <div className="fc-hint">Tap to reveal answer</div>
                </div>
                <div className="fc-back">
                  <div className="fc-q" style={{ color: "var(--green)" }}>Answer</div>
                  <div className="fc-a">{fc.answer}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="page">
      <div className="page-title">My Notes</div>
      <div className="page-sub">Upload PDFs and get AI summaries instantly</div>

      <div className="card" style={{ marginBottom: 32, padding: 28 }}>
        <div className="section-title">Upload New PDF</div>
        <div className="upload-form">
          <input className="form-input" placeholder="Note title (e.g. Organic Chemistry Ch.5)" value={title} onChange={e => setTitle(e.target.value)} />
          <div className={`upload-zone ${drag ? "drag" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={e => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); }}>
            <div className="upload-icon">📄</div>
            <div className="upload-title">{file ? file.name : "Drop your PDF here"}</div>
            <div className="upload-sub">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "or click to browse · Max 10MB"}</div>
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => setFile(e.target.files[0])} />
          </div>
          {progress > 0 && (
            <div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 6 }}>🤖 AI is processing your PDF…</div>
              <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
            </div>
          )}
          <button className="btn btn-primary" onClick={upload} disabled={uploading} style={{ alignSelf: "flex-start", paddingLeft: 32, paddingRight: 32 }}>
            {uploading ? <><span className="spinner" /> Processing…</> : "✦ Upload & Analyze"}
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="empty"><div className="empty-icon">📚</div><div className="empty-title">No notes yet</div><div>Upload your first PDF to begin</div></div>
      ) : (
        <div className="notes-grid">
          {notes.map((n, i) => (
            <div key={n._id} className="note-card" style={{ animationDelay: `${i * 0.07}s` }} onClick={() => setView(n)}>
              <div className="note-title">{n.title}</div>
              <div className="note-meta" style={{ marginBottom: 10 }}>
                <span className="note-tag">📄 PDF</span>
                <span>{timeAgo(n.createdAt)}</span>
                <span>{n.flashcards?.length || 0} flashcards</span>
              </div>
              <div className="note-summary">{n.summary?.replace(/•/g, "").trim()}</div>
              <div className="note-actions" onClick={e => e.stopPropagation()}>
                <button className="btn btn-primary" style={{ width: "auto", fontSize: 13, padding: "8px 16px" }} onClick={() => onGenerateQuiz(n._id, n.title)}>⚡ Quiz</button>
                <button className="btn btn-danger" style={{ fontSize: 13, padding: "8px 14px" }} onClick={() => deleteNote(n._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Quiz Page ─────────────────────────────────────────────────────────────────
function QuizPage({ notes, pendingQuizNoteId, pendingQuizNoteTitle, notify }) {
  const [phase, setPhase] = useState(pendingQuizNoteId ? "generating" : "select");
  const [selectedNote, setSelectedNote] = useState(pendingQuizNoteId ? { _id: pendingQuizNoteId, title: pendingQuizNoteTitle } : null);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef();

  const submitQuizRef = useRef(null);

  const generateQuiz = async (noteId) => {
    setPhase("generating");
    try {
      const q = await apiFetch(`/quiz/generate/${noteId}`, { method: "POST" });
      setQuiz(q); setAnswers({}); setCurrent(0); setSubmitted(false); setPhase("active");
    } catch (e) { notify(e.message, "error"); setPhase("select"); }
  };

  const submitQuiz = async (auto = false) => {
    clearInterval(timerRef.current);
    setSubmitted(true);
    if (auto) notify("Time's up! Auto-submitting…", "error");
    try {
      const ans = quiz.questions.map((_, i) => answers[i] || "");
      const r = await apiFetch(`/quiz/submit/${quiz._id}`, { method: "POST", body: JSON.stringify({ answers: ans }) });
      setResult(r); setPhase("result");
    } catch (e) { notify(e.message, "error"); }
  };

  // Keep a stable ref to submitQuiz so the timer interval can call the latest version
  submitQuizRef.current = submitQuiz;

  // Run once on mount to kick off a pending quiz
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (pendingQuizNoteId && phase === "generating") generateQuiz(pendingQuizNoteId);
  }, []);

  useEffect(() => {
    if (phase === "active" && !submitted) {
      const totalSecs = (quiz?.questions?.length ?? 0) * 30;
      setTimeLeft(totalSecs);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); submitQuizRef.current(true); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  // submitted and quiz.questions.length are intentionally omitted —
  // we only want this to fire when phase transitions to "active"
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const mins = fmt2(Math.floor(timeLeft / 60));
  const secs = fmt2(timeLeft % 60);

  if (phase === "generating") return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1.5s ease infinite" }}>🤖</div>
        <div className="page-title">Generating your quiz…</div>
        <div className="page-sub">AI is crafting questions from your notes</div>
      </div>
    </div>
  );

  if (phase === "result" && result) {
    const pct = Math.round((result.score / result.totalQuestions) * 100);
    const emoji = pct === 100 ? "🏆" : pct >= 80 ? "🎉" : pct >= 50 ? "📚" : "💪";
    const msg = pct === 100 ? "Perfect Score!" : pct >= 80 ? "Excellent Work!" : pct >= 50 ? "Good Effort!" : "Keep Studying!";
    return (
      <div className="page">
        <div className="result-card">
          <div className="result-emoji">{emoji}</div>
          <div className="result-score">{pct}%</div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 800, margin: "8px 0" }}>{msg}</div>
          <div className="result-label">{result.score} out of {result.totalQuestions} correct</div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
            <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => { setPhase("select"); setSelectedNote(null); }}>Try Another Quiz</button>
            <button className="btn btn-ghost" onClick={() => { setPhase("active"); setCurrent(0); setSubmitted(true); }}>Review Answers</button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "active" && quiz) {
    const q = quiz.questions[current];
    const letters = ["A", "B", "C", "D"];
    return (
      <div className="page">
        <div className="quiz-wrapper">
          <div className="quiz-header">
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 800 }}>{selectedNote?.title || "Quiz"}</div>
              <div style={{ color: "var(--text3)", fontSize: 13, marginTop: 2 }}>Question {current + 1} of {quiz.questions.length}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div className="quiz-progress-wrap" style={{ minWidth: 120 }}>
                <div className="quiz-q">{current + 1}/{quiz.questions.length}</div>
                <div className="quiz-progress">
                  <div className="quiz-progress-fill" style={{ width: `${((current + 1) / quiz.questions.length) * 100}%` }} />
                </div>
              </div>
              {!submitted && <div className={`timer ${timeLeft <= 10 ? "urgent" : ""}`}>{mins}:{secs}</div>}
            </div>
          </div>

          <div className="question-card">
            <div className="question-text">{q.question}</div>
            {q.options.map((opt, i) => {
              let cls = "";
              if (submitted) {
                if (opt === q.correctAnswer) cls = "correct";
                else if (answers[current] === opt) cls = "wrong";
              } else if (answers[current] === opt) cls = "selected";
              return (
                <div key={i} className={`option ${cls}`} onClick={() => !submitted && setAnswers({ ...answers, [current]: opt })}>
                  <div className="opt-letter">{letters[i]}</div>
                  {opt}
                  {submitted && opt === q.correctAnswer && <span style={{ marginLeft: "auto", fontSize: 16 }}>✓</span>}
                  {submitted && answers[current] === opt && opt !== q.correctAnswer && <span style={{ marginLeft: "auto", fontSize: 16 }}>✕</span>}
                </div>
              );
            })}
          </div>

          <div className="quiz-nav">
            {current > 0 && <button className="btn btn-ghost" onClick={() => setCurrent(c => c - 1)}>← Prev</button>}
            {current < quiz.questions.length - 1
              ? <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setCurrent(c => c + 1)}>Next →</button>
              : !submitted
                ? <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => submitQuiz()}>Submit Quiz ✓</button>
                : <button className="btn btn-primary" style={{ width: "auto" }} onClick={() => setPhase("result")}>View Results →</button>
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-title">Take a Quiz</div>
      <div className="page-sub">AI-generated questions from your notes</div>
      {notes.length === 0 ? (
        <div className="empty"><div className="empty-icon">⚡</div><div className="empty-title">No notes yet</div><div>Upload notes to generate a quiz</div></div>
      ) : (
        <div className="notes-grid">
          {notes.map((n, i) => (
            <div key={n._id} className="note-card" style={{ animationDelay: `${i * 0.07}s`, cursor: "default" }}>
              <div className="note-title">{n.title}</div>
              <div className="note-meta"><span className="note-tag">📄 PDF</span><span>{timeAgo(n.createdAt)}</span></div>
              <div className="note-summary">{n.summary?.replace(/•/g, "").trim().slice(0, 100)}…</div>
              <div style={{ marginTop: 16 }}>
                <button className="btn btn-primary" style={{ width: "auto", fontSize: 13 }}
                  onClick={() => { setSelectedNote(n); generateQuiz(n._id); }}>
                  ⚡ Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── History Page ──────────────────────────────────────────────────────────────
function HistoryPage({ quizHistory }) {
  return (
    <div className="page">
      <div className="page-title">Quiz History</div>
      <div className="page-sub">Track your study progress over time</div>
      {quizHistory.length === 0 ? (
        <div className="empty"><div className="empty-icon">📊</div><div className="empty-title">No quizzes taken yet</div><div>Complete a quiz to see your history</div></div>
      ) : (
        <div className="history-list">
          {quizHistory.map((q, i) => {
            const pct = Math.round((q.score / q.totalQuestions) * 100);
            const cls = pct >= 80 ? "good" : pct >= 50 ? "ok" : "bad";
            const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "📚" : "💪";
            return (
              <div key={q._id} className="history-item" style={{ animationDelay: `${i * 0.06}s` }}>
                <div style={{ fontSize: 28 }}>{emoji}</div>
                <div className={`history-score ${cls}`}>{pct}%</div>
                <div className="score-bar-wrap">
                  <div style={{ fontWeight: 500, fontSize: 15 }}>{q.noteId?.title || "Untitled"}</div>
                  <div style={{ color: "var(--text3)", fontSize: 12, marginTop: 2 }}>
                    {q.score}/{q.totalQuestions} correct · {timeAgo(q.attemptedAt)}
                  </div>
                  <div className="score-bar" style={{ marginTop: 8 }}>
                    <div className="score-bar-fill" style={{ width: `${pct}%`, background: pct >= 80 ? "var(--green)" : pct >= 50 ? "var(--gold)" : "var(--red)" }} />
                  </div>
                </div>
                <div className={`badge ${cls === "good" ? "badge-green" : cls === "ok" ? "badge-gold" : "badge-accent"}`} style={{ flexShrink: 0 }}>
                  {pct === 100 ? "Perfect" : pct >= 80 ? "Excellent" : pct >= 50 ? "Good" : "Needs Work"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Module-level constant — not a dependency for any hook
const POMODORO_SECS = 25 * 60;

// ─── Focus Room Page ───────────────────────────────────────────────────────────
function FocusRoomPage({ notify }) {
  // ── Timer state ──
  const [timerMode, setTimerMode] = useState("pomodoro"); // pomodoro | countdown | stopwatch
  const [running, setRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [elapsed, setElapsed] = useState(0);          // stopwatch seconds
  const [pomoDone, setPomoDone] = useState(0);
  const [pomoTotal] = useState(4);
  // countdown custom inputs
  const [cdMins, setCdMins] = useState(25);
  const [cdSecs, setCdSecs] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // ── Tasks state ──
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");

  // ── PDF / Questions state ──
  const [file, setFile] = useState(null);
  const [drag, setDrag] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]); // [{question, options, correctAnswer}]
  const [qIndex, setQIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [qAnswers, setQAnswers] = useState({}); // { qIndex: chosen }
  const [sessionDone, setSessionDone] = useState(false);
  const fileRef = useRef();

  // ── Session summary ──
  const [sessionStats, setSessionStats] = useState(null);

  // ── Timer helpers ──
  const displaySecs = timerMode === "stopwatch" ? elapsed : timeLeft;
  const displayMins = fmt2(Math.floor(displaySecs / 60));
  const displaySecsFmt = fmt2(displaySecs % 60);
  const isUrgent = timerMode !== "stopwatch" && timeLeft <= 10 && running;

  const startTimer = () => {
    if (running) return;
    setRunning(true);
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      if (timerMode === "stopwatch") {
        setElapsed(e => e + 1);
      } else {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setRunning(false);
            handleTimerEnd();
            return 0;
          }
          return t - 1;
        });
      }
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(timerRef.current);
    setRunning(false);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setElapsed(0);
    if (timerMode === "pomodoro") setTimeLeft(POMODORO_SECS);
    else if (timerMode === "countdown") setTimeLeft(cdMins * 60 + Number(cdSecs));
    else setTimeLeft(0);
  };

  const handleTimerEnd = () => {
    if (timerMode === "pomodoro") {
      setPomoDone(d => {
        const next = d + 1;
        notify(next >= pomoTotal ? "🏆 All Pomodoros done! Great session!" : `✅ Pomodoro ${next} done! Take a break.`, "success");
        return next;
      });
    } else {
      notify("⏰ Time's up!", "success");
    }
  };

  // Refs so the mode-change effect always has latest values without re-running on every keystroke
  const cdMinsRef = useRef(cdMins);
  const cdSecsRef = useRef(cdSecs);
  useEffect(() => { cdMinsRef.current = cdMins; }, [cdMins]);
  useEffect(() => { cdSecsRef.current = cdSecs; }, [cdSecs]);

  // When mode changes, reset timer — only fires on timerMode change (intentional)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    pauseTimer();
    setElapsed(0);
    if (timerMode === "pomodoro") setTimeLeft(POMODORO_SECS);
    else if (timerMode === "countdown") setTimeLeft(cdMinsRef.current * 60 + Number(cdSecsRef.current));
    else setTimeLeft(0);
  }, [timerMode]);

  // ── Task helpers ──
  const addTask = () => {
    const t = taskInput.trim();
    if (!t) return;
    setTasks(ts => [...ts, { id: Date.now(), text: t, done: false }]);
    setTaskInput("");
  };

  const toggleTask = (id) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => setTasks(ts => ts.filter(t => t.id !== id));
  const doneTasks = tasks.filter(t => t.done).length;

  // ── PDF generate ──
  const generateQuestions = async () => {
    if (!file) return notify("Please upload a PDF first", "error");
    setGenerating(true);
    try {
      const fd = new FormData();
      fd.append("pdf", file);
      const res = await fetch(API_BASE + "/notes/upload-temp", {
        method: "POST",
        headers: { Authorization: `Bearer ${token()}` },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      // Expect data.questions: [{question, options, correctAnswer}]
      setQuestions(data.questions || []);
      setQIndex(0);
      setRevealed(false);
      setQAnswers({});
      notify("Questions generated!", "success");
    } catch (e) {
      notify(e.message || "Failed to generate questions", "error");
    } finally {
      setGenerating(false);
    }
  };

  const chooseAnswer = (opt) => {
    if (qAnswers[qIndex] !== undefined) return; // already answered
    setQAnswers(a => ({ ...a, [qIndex]: opt }));
    setRevealed(true);
  };

  const nextQuestion = () => {
    setRevealed(false);
    if (qIndex < questions.length - 1) {
      setQIndex(i => i + 1);
    } else {
      // session done
      const correct = questions.filter((q, i) => qAnswers[i] === q.correctAnswer).length;
      const studiedSecs = timerMode === "stopwatch" ? elapsed : (POMODORO_SECS - timeLeft);
      setSessionStats({
        correct,
        total: questions.length,
        tasks: doneTasks,
        totalTasks: tasks.length,
        time: studiedSecs,
      });
      setSessionDone(true);
    }
  };

  const prevQuestion = () => {
    if (qIndex > 0) { setQIndex(i => i - 1); setRevealed(qAnswers[qIndex - 1] !== undefined); }
  };

  const restartSession = () => {
    setQuestions([]); setQIndex(0); setRevealed(false); setQAnswers({});
    setSessionDone(false); setSessionStats(null); setFile(null);
    setTasks([]); resetTimer(); setPomoDone(0);
  };

  const currentQ = questions[qIndex];
  const correctCount = questions.filter((q, i) => qAnswers[i] === q.correctAnswer).length;

  return (
    <div className="page">
      <div className="page-title">Focus Room 🎯</div>
      <div className="page-sub">Set your timer, plan your tasks, and study from your PDF — all in one place</div>
      <div className="page-sub">Dont leave the page. Progress will be undone</div>

      {/* Session summary banner when all questions answered */}
      {sessionDone && sessionStats && (
        <div className="focus-summary-banner" style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 36 }}>🎉</div>
          <div className="fsb-stat">
            <div className="fsb-val" style={{ color: "var(--green)" }}>{Math.round((sessionStats.correct / sessionStats.total) * 100)}%</div>
            <div className="fsb-label">SCORE</div>
          </div>
          <div className="fsb-stat">
            <div className="fsb-val" style={{ color: "var(--accent3)" }}>{sessionStats.correct}/{sessionStats.total}</div>
            <div className="fsb-label">CORRECT</div>
          </div>
          <div className="fsb-stat">
            <div className="fsb-val" style={{ color: "var(--gold)" }}>{sessionStats.tasks}/{sessionStats.totalTasks}</div>
            <div className="fsb-label">TASKS DONE</div>
          </div>
          <div className="fsb-stat">
            <div className="fsb-val" style={{ color: "var(--pink)" }}>{fmt2(Math.floor(sessionStats.time / 60))}:{fmt2(sessionStats.time % 60)}</div>
            <div className="fsb-label">TIME</div>
          </div>
          <button className="btn btn-ghost" style={{ marginLeft: "auto" }} onClick={restartSession}>New Session</button>
        </div>
      )}

      <div className="focus-layout">
        {/* ── LEFT PANEL ── */}
        <div className="focus-left">

          {/* Timer Card */}
          <div className="focus-timer-card">
            <div className="focus-timer-mode">
              {[["pomodoro", "🍅 Pomodoro"], ["countdown", "⏳ Countdown"], ["stopwatch", "⏱ Stopwatch"]].map(([m, label]) => (
                <button key={m} className={`focus-mode-btn ${timerMode === m ? "active" : ""}`} onClick={() => setTimerMode(m)}>{label}</button>
              ))}
            </div>

            {/* Countdown custom time inputs (only when not running) */}
            {timerMode === "countdown" && !running && (
              <div className="countdown-inputs">
                <input className="time-input" type="number" min="0" max="99" value={cdMins}
                  onChange={e => { setCdMins(Number(e.target.value)); setTimeLeft(Number(e.target.value) * 60 + Number(cdSecs)); }} />
                <span className="time-sep">:</span>
                <input className="time-input" type="number" min="0" max="59" value={cdSecs}
                  onChange={e => { setCdSecs(Number(e.target.value)); setTimeLeft(cdMins * 60 + Number(e.target.value)); }} />
              </div>
            )}

            <div className={`focus-clock ${running ? "running" : ""} ${isUrgent ? "urgent" : ""}`}>
              {displayMins}:{displaySecsFmt}
            </div>
            <div className="focus-session-label">
              {timerMode === "pomodoro" ? `Session ${pomoDone + 1} of ${pomoTotal}` :
               timerMode === "countdown" ? "Custom Timer" : "Stopwatch"}
            </div>

            <div className="focus-timer-controls">
              {!running
                ? <button className="focus-ctrl-btn focus-ctrl-start" onClick={startTimer}>▶ Start</button>
                : <button className="focus-ctrl-btn focus-ctrl-pause" onClick={pauseTimer}>⏸ Pause</button>
              }
              <button className="focus-ctrl-btn focus-ctrl-reset" onClick={resetTimer}>↺ Reset</button>
            </div>

            {timerMode === "pomodoro" && (
              <div className="pomodoro-dots">
                {Array.from({ length: pomoTotal }).map((_, i) => (
                  <div key={i} className={`pomo-dot ${i < pomoDone ? "done" : i === pomoDone ? "current" : ""}`} />
                ))}
              </div>
            )}
          </div>

          {/* Tasks Card */}
          <div className="focus-tasks-card">
            <div className="tasks-header">
              <div className="tasks-title">📝 Tasks
                <span className="tasks-count">{doneTasks}/{tasks.length}</span>
              </div>
            </div>
            <div className="task-add-row">
              <input
                className="task-input"
                placeholder="Add a task for this session…"
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
              />
              <button className="task-add-btn" onClick={addTask}>+</button>
            </div>
            {tasks.length > 0 ? (
              <>
                <div className="task-list">
                  {tasks.map((t, i) => (
                    <div key={t.id} className={`task-item ${t.done ? "done" : ""}`} style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className={`task-check ${t.done ? "checked" : ""}`} onClick={() => toggleTask(t.id)} />
                      <span className="task-text">{t.text}</span>
                      <button className="task-del" onClick={() => deleteTask(t.id)}>✕</button>
                    </div>
                  ))}
                </div>
                {tasks.length > 0 && (
                  <div className="tasks-progress">
                    <div className="tasks-progress-label">{doneTasks === tasks.length && tasks.length > 0 ? "✦ All done!" : `${Math.round((doneTasks / tasks.length) * 100)}% complete`}</div>
                    <div className="tasks-progress-bar">
                      <div className="tasks-progress-fill" style={{ width: `${tasks.length ? (doneTasks / tasks.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text3)", fontSize: 13 }}>
                No tasks yet — add what you plan to study
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="focus-right">

          {/* PDF Upload Card */}
          <div className="focus-pdf-card">
            <div className="focus-pdf-header">📄 Upload PDF to Generate Questions</div>
            {!file ? (
              <div
                className={`focus-upload-mini ${drag ? "drag" : ""}`}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); setQuestions([]); }}
              >
                <div className="focus-upload-mini-icon">📂</div>
                <div className="focus-upload-mini-text">Drop your PDF here or click to browse</div>
                <div className="focus-upload-mini-sub">Max 10MB · PDF only</div>
              </div>
            ) : (
              <div className="focus-file-selected">
                <div className="focus-file-icon">📄</div>
                <div>
                  <div className="focus-file-name">{file.name}</div>
                  <div className="focus-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
                <button className="btn btn-danger" style={{ fontSize: 12, padding: "6px 12px", marginLeft: "auto" }}
                  onClick={() => { setFile(null); setQuestions([]); setQAnswers({}); setSessionDone(false); }}>Remove</button>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={e => { setFile(e.target.files[0]); setQuestions([]); }} />
            <button className="focus-gen-btn" onClick={generateQuestions} disabled={generating || !file}>
              {generating ? <><span className="spinner" /> Generating questions…</> : "✦ Generate Questions from PDF"}
            </button>
          </div>

          {/* Questions Card */}
          {questions.length > 0 && (
            <div className="focus-questions-card">
              <div className="fq-header">
                <div className="fq-title">🃏 Questions
                  <span className="fq-counter">{qIndex + 1} / {questions.length}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--text3)" }}>
                  {correctCount} correct so far
                </div>
              </div>

              {!sessionDone ? (
                <>
                  <div className={`fq-card ${revealed ? "revealed" : ""}`} onClick={() => !revealed && setRevealed(true)}>
                    {!revealed ? (
                      <>
                        <div className="fq-label">Question</div>
                        <div className="fq-text">{currentQ?.question}</div>
                        {currentQ?.options?.length > 0 ? (
                          <div className="fq-options-list" onClick={e => e.stopPropagation()}>
                            {currentQ.options.map((opt, i) => {
                              const chosen = qAnswers[qIndex];
                              let cls = "";
                              if (chosen !== undefined) {
                                if (opt === currentQ.correctAnswer) cls = "correct";
                                else if (opt === chosen) cls = "wrong";
                              }
                              return (
                                <div key={i} className={`fq-option ${cls}`} onClick={() => chooseAnswer(opt)}>
                                  {opt}
                                  {chosen !== undefined && opt === currentQ.correctAnswer && " ✓"}
                                  {chosen !== undefined && opt === chosen && opt !== currentQ.correctAnswer && " ✕"}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="fq-hint">Tap to reveal answer</div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="fq-label answer">Answer</div>
                        <div className="fq-answer-text">{currentQ?.correctAnswer}</div>
                      </>
                    )}
                  </div>

                  <div className="fq-nav">
                    <button className="fq-nav-btn" onClick={prevQuestion} disabled={qIndex === 0}>← Prev</button>
                    <div className="fq-dots">
                      {questions.map((_, i) => (
                        <div key={i} className={`fq-dot ${i === qIndex ? "active" : ""} ${qAnswers[i] !== undefined ? "answered" : ""}`}
                          onClick={() => { setQIndex(i); setRevealed(qAnswers[i] !== undefined); }} />
                      ))}
                    </div>
                    <button className="fq-nav-btn" onClick={nextQuestion}>
                      {qIndex === questions.length - 1 ? "Finish ✓" : "Next →"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="fq-score-mini">
                  <div className="fq-score-val">{Math.round((correctCount / questions.length) * 100)}%</div>
                  <div className="fq-score-label">{correctCount} of {questions.length} correct</div>
                  <button className="btn btn-primary" style={{ marginTop: 16, width: "auto" }}
                    onClick={() => { setQIndex(0); setQAnswers({}); setRevealed(false); setSessionDone(false); }}>
                    Retry Questions
                  </button>
                </div>
              )}
            </div>
          )}

          {questions.length === 0 && !generating && (
            <div className="empty" style={{ paddingTop: 48 }}>
              <div className="empty-icon">🎯</div>
              <div className="empty-title">Ready to focus?</div>
              <div>Upload a PDF above to generate practice questions, then start your timer and get studying!</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── App Shell ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")); } catch { return null; }
  });
  const [page, setPage] = useState("dashboard");
  const [notes, setNotes] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [notif, setNotif] = useState(null);
  const [pendingQuiz, setPendingQuiz] = useState(null);

  const notify = (msg, type = "success") => {
    setNotif({ msg, type, id: Date.now() });
    setTimeout(() => setNotif(null), 4000);
  };

  const fetchNotes = async () => {
    try { setNotes(await apiFetch("/notes")); } catch {}
  };
  const fetchHistory = async () => {
    try { setQuizHistory(await apiFetch("/quiz/history")); } catch {}
  };

  useEffect(() => {
    if (user) { fetchNotes(); fetchHistory(); }
  }, [user]);

  const handleGenerateQuiz = (noteId, noteTitle) => {
    setPendingQuiz({ noteId, noteTitle });
    setPage("quiz");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setNotes([]);
    setQuizHistory([]);
  };

  if (!user) return (
    <>
      <style>{styles}</style>
      <AuthPage onAuth={(u) => { setUser(u); }} />
    </>
  );

  const nav = [
    { id: "dashboard", icon: "◈", label: "Dashboard" },
    { id: "notes",     icon: "◉", label: "My Notes" },
    { id: "quiz",      icon: "⚡", label: "Take Quiz" },
    { id: "history",   icon: "◌", label: "History" },
    { id: "focus",     icon: "🎯", label: "Focus Room" },  // ← NEW
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-icon">✦</div>
            StudyAI
          </div>
          <nav className="nav">
            {nav.map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`}
                onClick={() => { setPendingQuiz(null); setPage(n.id); }}>
                <span className="nav-icon">{n.icon}</span>
                <span className="nav-label">{n.label}</span>
              </div>
            ))}
          </nav>
          <div className="user-section">
            <div className="user-card">
              <div className="avatar">{initials(user.name)}</div>
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <button className="logout-btn" onClick={logout} title="Sign out">⇥</button>
            </div>
          </div>
        </aside>

        <main className="main">
          {page === "dashboard" && <Dashboard notes={notes} quizHistory={quizHistory} />}
          {page === "notes"     && <NotesPage notes={notes} onRefresh={fetchNotes} onGenerateQuiz={handleGenerateQuiz} notify={notify} />}
          {page === "quiz"      && (
            <QuizPage
              key={pendingQuiz?.noteId}
              notes={notes}
              pendingQuizNoteId={pendingQuiz?.noteId}
              pendingQuizNoteTitle={pendingQuiz?.noteTitle}
              notify={notify}
            />
          )}
          {page === "history"   && <HistoryPage quizHistory={quizHistory} />}
          {page === "focus"     && <FocusRoomPage notify={notify} />}   {/* ← NEW */}
        </main>
      </div>

      {notif && <Notification key={notif.id} msg={notif.msg} type={notif.type} onClose={() => setNotif(null)} />}
    </>
  );
}