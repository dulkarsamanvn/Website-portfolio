import { ArrowRight, Bookmark, Check, Code2, Heart, ImagePlus, MessageSquare, Play, Server, ShieldCheck, Users } from 'lucide-react';

function WindowBar({ title }) {
  return (
    <div className="preview-window-bar">
      <span className="preview-window-dots"><i /><i /><i /></span>
      <span>{title}</span>
      <span className="preview-window-mark">↗</span>
    </div>
  );
}

function SyntaxVisual() {
  return (
    <>
      <div className="preview-backplate syntax-backplate" />
      <div className="preview-window syntax-window">
        <WindowBar title="syntax / workspace" />
        <div className="syntax-tabs"><span className="is-selected">challenge.py</span><span>Solutions</span><span>Discuss</span></div>
        <pre className="syntax-code"><span className="code-muted"># Find the connection.</span>{'\n'}<span className="code-purple">def</span>{' find_pair(numbers, target):\n    seen = {}\n    '}<span className="code-purple">for</span>{' i, number '}<span className="code-purple">in</span>{' enumerate(numbers):\n        '}<span className="code-purple">if</span>{' target - number '}<span className="code-purple">in</span>{' seen:\n            '}<span className="code-purple">return</span>{' [seen[target - number], i]\n        seen[number] = i'}</pre>
        <div className="syntax-toolbar"><span><span className="preview-status-dot" /> Python</span><span className="syntax-run"><Play size={10} fill="currentColor" /> Run code</span></div>
      </div>
      <div className="preview-float syntax-chat"><span className="preview-chip-icon"><MessageSquare size={17} /></span><span><strong>Better, together.</strong><small>Real-time conversations</small></span><span className="preview-chat-dot" /></div>
    </>
  );
}

function CacheScopeVisual() {
  return (
    <>
      <div className="preview-backplate cache-backplate" />
      <div className="preview-window cache-window">
        <WindowBar title="cachescope / terminal" />
        <div className="cache-terminal">
          <p><span className="cache-prompt">$</span> cachescope run app.py</p>
          <span className="cache-report-label">A CLOSER LOOK AT REPEATED WORK</span>
          <div className="cache-verdict"><span>CANDIDATE</span><small>Stable repeated results</small></div>
          <div className="cache-verdict"><span>MAYBE</span><small>Review captured state</small></div>
          <div className="cache-verdict"><span>SKIP</span><small>Too few useful repeats</small></div>
          <p className="cache-cursor"><span className="cache-prompt">$</span> <i /></p>
        </div>
      </div>
      <div className="preview-float cache-package"><span className="cache-package-mark">Py</span><span><strong>Small tool. Deeper insight.</strong><small>Published on PyPI · Alpha</small></span></div>
    </>
  );
}

function TetherVisual() {
  return (
    <>
      <div className="preview-backplate tether-backplate" />
      <div className="preview-window tether-window">
        <WindowBar title="tether / publishing" />
        <div className="tether-layout">
          <div className="tether-sidebar"><strong>t.</strong><span className="is-selected">My blogs</span><span>Saved</span><span>Write</span></div>
          <div className="tether-article"><span className="tether-article-kicker">A SPACE FOR YOUR IDEAS</span><h4>Words that<br />bring us closer.</h4><div className="tether-cover"><i /><i /></div><div className="preview-text-lines"><i /><i /><i /></div><div className="tether-article-actions"><Heart size={12} /><MessageSquare size={12} /><Bookmark size={12} /></div></div>
        </div>
      </div>
      <div className="preview-float tether-publish"><span className="preview-chip-icon"><Check size={16} /></span><span><strong>Create. Publish. Connect.</strong><small>Laravel + React</small></span></div>
    </>
  );
}

function PicturaVisual() {
  return (
    <>
      <div className="pictura-grid" />
      <div className="preview-window pictura-window"><WindowBar title="pictura / imagination to image" /><div className="pictura-art"><div className="pictura-halo" /><div className="pictura-orb" /><div className="pictura-ring" /><span>IMAGINE SOMETHING DIFFERENT.</span></div></div>
      <div className="preview-float pictura-prompt"><ImagePlus size={16} /><span>Describe your imagination…</span><span className="pictura-generate"><ArrowRight size={14} /></span></div>
    </>
  );
}

function LuxeVisual() {
  return (
    <>
      <div className="luxe-wordmark">LUXE<br /><span>TICKERS</span></div>
      <div className="luxe-watch">
        <svg viewBox="0 0 220 260" fill="none">
          <defs><linearGradient id="project-watch-steel" x1="55" y1="75" x2="166" y2="184" gradientUnits="userSpaceOnUse"><stop stopColor="#f8f8f4" /><stop offset=".26" stopColor="#aaaead" /><stop offset=".48" stopColor="#f2f3ee" /><stop offset=".74" stopColor="#747a7a" /><stop offset="1" stopColor="#d7dbd8" /></linearGradient><linearGradient id="project-watch-face" x1="80" y1="90" x2="150" y2="175" gradientUnits="userSpaceOnUse"><stop stopColor="#343b3b" /><stop offset="1" stopColor="#141919" /></linearGradient></defs>
          <rect x="83" y="3" width="54" height="254" rx="16" fill="#323939" /><path d="M90 6v62m40-62v62M90 192v62m40-62v62" stroke="#4b5352" strokeWidth="2" />
          <path d="m78 70 5-14h54l5 14M78 190l5 14h54l5-14" fill="url(#project-watch-steel)" /><rect x="170" y="121" width="10" height="18" rx="3" fill="url(#project-watch-steel)" />
          <circle cx="110" cy="130" r="62" fill="url(#project-watch-steel)" /><circle cx="110" cy="130" r="54" stroke="#e2e5df" strokeWidth="2" fill="url(#project-watch-face)" />
          {Array.from({ length: 12 }, (_, index) => <line key={index} x1="110" y1="82" x2="110" y2={index % 3 === 0 ? '91' : '87'} stroke="#cdd4cb" strokeWidth={index % 3 === 0 ? 2 : 1} transform={`rotate(${index * 30} 110 130)`} />)}
          <text x="110" y="112" textAnchor="middle" fill="#c5cdbf" fontSize="5.5" fontFamily="sans-serif" letterSpacing="1.7">AUTOMATIC</text><path d="m110 130-17-20m17 20 28-14" stroke="#e6eadd" strokeWidth="3" strokeLinecap="round" /><path d="m110 130-8 32" stroke="#b9b099" strokeWidth="1" /><circle cx="110" cy="130" r="3" fill="#e6eadd" />
        </svg>
      </div>
      <div className="preview-float luxe-product"><span className="luxe-product-rule" /><span><small>DETAILS MAKE THE DIFFERENCE</small><strong>A considered collection.</strong></span></div>
      <div className="luxe-preview-label">VARIANTS · CART · CHECKOUT</div>
    </>
  );
}

function HubSpotVisual() {
  return (
    <>
      <div className="integration-flow"><svg viewBox="0 0 400 220" preserveAspectRatio="none"><path d="M65 112H182V74H300V128" stroke="#c9b9ae" strokeWidth="1.5" strokeDasharray="4 5" fill="none" /><path d="M182 74v105h60" stroke="#c9b9ae" strokeWidth="1.5" strokeDasharray="4 5" fill="none" /><circle cx="182" cy="74" r="4" fill="#b3937c" /></svg></div>
      <div className="integration-node integration-react"><span><Code2 size={23} strokeWidth={1.4} /></span><strong>React</strong><small>Interface</small></div>
      <div className="integration-node integration-api"><span><Server size={23} strokeWidth={1.4} /></span><strong>FastAPI</strong><small>Connect & retrieve</small></div>
      <div className="integration-node integration-hubspot"><span><Users size={23} strokeWidth={1.4} /></span><strong>HubSpot</strong><small>Contacts</small></div>
      <div className="preview-float integration-auth"><ShieldCheck size={16} /><span>OAuth 2.0</span></div>
      <div className="integration-redis"><span className="preview-status-dot" /> Redis</div>
    </>
  );
}

export default function ProjectVisual({ type }) {
  switch (type) {
    case 'syntax': return <SyntaxVisual />;
    case 'cachescope': return <CacheScopeVisual />;
    case 'tether': return <TetherVisual />;
    case 'pictura': return <PicturaVisual />;
    case 'luxe': return <LuxeVisual />;
    case 'hubspot': return <HubSpotVisual />;
    default: return null;
  }
}
