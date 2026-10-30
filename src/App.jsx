import { useEffect, useRef } from 'react'
import Scene from './Scene.jsx'
import { projects, skills, github } from './projects.js'

function Card({ project, index }) {
  const ref = useRef(null)

  // Fade in when scrolled into view
  useEffect(() => {
    const el = ref.current
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.classList.add('in')
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // 3D tilt that follows the pointer
  const onMove = (e) => {
    const el = ref.current
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transitionDelay = '0ms'
    el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`
  }
  const onLeave = () => {
    ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      className="card"
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <h3>{project.title}</h3>
      <p>{project.text}</p>
      <div className="chips">
        {project.tags.map((t) => (
          <span className="chip" key={t}>{t}</span>
        ))}
      </div>
      {project.link && (
        <a href={project.link} target="_blank" rel="noopener noreferrer">
          View on GitHub →
        </a>
      )}
    </div>
  )
}

export default function App() {
  return (
    <>
      <Scene />
      <nav>
        <b>D.ANKRAH</b>
        <div>
          <a href="#projects">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      <main>
        <section id="hero">
          <div className="tag">IT Management graduate · Ghana</div>
          <h1>I build software<br />that people log in to.</h1>
          <p className="lead">
            Hi, I’m David Ankrah. I build web and mobile apps with Python, React and React Native,
            from helpdesk systems to alumni networks. Move your mouse and scroll to explore.
          </p>
          <div className="btns">
            <a className="btn primary" href="#projects">See my work</a>
            <a className="btn" href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
          <div className="hint">SCROLL ↓</div>
        </section>

        <section id="projects">
          <h2>Selected projects</h2>
          <div className="grid">
            {projects.map((p, i) => (
              <Card key={p.title} project={p} index={i} />
            ))}
          </div>
        </section>

        <section id="skills">
          <h2>Toolbox</h2>
          <div className="skills">
            {skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </section>

        <section id="contact">
          <h2>Let’s work together</h2>
          <p className="lead">I’m looking for opportunities to build useful software with a great team.</p>
          <div className="btns">
            <a className="btn primary" href={github} target="_blank" rel="noopener noreferrer">
              github.com/Ankrah3
            </a>
          </div>
        </section>
      </main>

      <footer>© {new Date().getFullYear()} David Ankrah</footer>
    </>
  )
}
