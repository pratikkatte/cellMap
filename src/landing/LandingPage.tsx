import { useEffect } from 'react'

const futureWorlds = [
  {
    className: 'bacillus',
    status: 'Next world',
    eyebrow: 'Survival by transformation',
    title: 'Bacillus subtilis',
    description: 'A thick-walled cell that can build a dormant spore inside itself when the world gets difficult.',
  },
  {
    className: 'phage',
    status: 'Planned',
    eyebrow: 'A virus becomes a process',
    title: 'Phage infection',
    description: 'Follow a bacteriophage as it finds a host, attaches, delivers its genome, and chooses what happens next.',
  },
  {
    className: 'minimal',
    status: 'On the horizon',
    eyebrow: 'The floor of living complexity',
    title: 'The minimal cell',
    description: 'Remove what life can spare and discover the smallest collection of systems that can still make a cell.',
  },
]

function CellMapMark() {
  return <span className="landing-brand-mark" aria-hidden="true"><i /><i /><i /></span>
}

function FutureVisual({ kind }: { kind: string }) {
  return <div className={`future-visual ${kind}`} aria-hidden="true">
    <div className="future-orbit" />
    {kind === 'bacillus' && <div className="future-bacillus"><i /><span /><b /><b /></div>}
    {kind === 'phage' && <div className="future-phage"><i /><span /><b /><b /><b /></div>}
    {kind === 'minimal' && <div className="future-minimal"><i /><i /><i /><span /></div>}
  </div>
}

export default function LandingPage() {
  useEffect(() => {
    document.title = 'CellMap — Understanding how life works'
    const page = document.querySelector<HTMLElement>('.landing-page')
    const sections = document.querySelectorAll<HTMLElement>('[data-landing-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'))
    }, { root: page, threshold: .12 })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <div className="landing-page">
    <header className="landing-nav">
      <a className="landing-brand" href="/" aria-label="CellMap home"><CellMapMark /><span><b>CellMap</b><small>Understanding life from the inside</small></span></a>
      <nav aria-label="Main navigation">
        <a href="#worlds">Worlds</a>
        <a href="#how-it-works">How it works</a>
        <a href="/vision">Our vision</a>
        <a className="landing-nav-cta" href="/explore/ecoli">Explore E. coli <span>↗</span></a>
      </nav>
    </header>

    <main>
      <section className="landing-hero">
        <div className="landing-hero-art" role="img" aria-label="A microscopic world of bacteria and bacteriophages" />
        <div className="landing-hero-grid" aria-hidden="true" />
        <div className="landing-hero-copy">
          <p className="landing-overline"><span /> Understanding how life works—from the inside</p>
          <h1>Life is not a diagram.<br /><em>It is a place.</em></h1>
          <p>Enter a cell. Move through its structures. Watch its machinery work. Change the conditions—and see how a living system answers.</p>
          <div className="landing-hero-actions">
            <a className="landing-button primary" href="#worlds">Choose a world <span>↓</span></a>
            <a className="landing-button secondary" href="/vision">Read the vision <span>↗</span></a>
          </div>
        </div>
        <div className="landing-signal" aria-hidden="true"><i /><span>Microscopic worlds<br />waiting to be entered</span></div>
      </section>

      <section className="world-library" id="worlds">
        <header className="landing-section-heading" data-landing-reveal>
          <div><p className="landing-eyebrow">Choose your world</p><h2>Begin with one cell.</h2></div>
          <p>Each world is more than a model. It is a place to explore structure, follow a process, and ask a biological question.</p>
        </header>

        <a className="live-world-card" href="/explore/ecoli" data-landing-reveal>
          <div className="live-world-copy">
            <div className="live-status"><i /> World 001 · Live now</div>
            <p className="landing-eyebrow">Gram-negative bacterium</p>
            <h2>Inside <i>Escherichia coli</i></h2>
            <p>Meet the cell envelope, chromosome, ribosomes, molecular motors, and the crowded chemistry that keeps one of biology’s best-known cells alive.</p>
            <div className="live-features">
              <span><b>13</b><small>structures</small></span>
              <span><b>5</b><small>experiments</small></span>
              <span><b>2</b><small>ways to explore</small></span>
            </div>
            <span className="enter-world">Enter the cell <i>↗</i></span>
          </div>
          <div className="live-world-visual" aria-hidden="true">
            <div className="ecoli-radar"><i /><i /><i /></div>
            <div className="ecoli-cell">
              <div className="ecoli-dna"><i /></div>
              {Array.from({ length: 12 }, (_, index) => <b key={index} />)}
              <span className="ecoli-membrane inner" /><span className="ecoli-membrane outer" />
            </div>
            <div className="ecoli-flagellum" />
            <div className="visual-label label-envelope"><i />Cell envelope</div>
            <div className="visual-label label-nucleoid"><i />Nucleoid</div>
            <div className="visual-label label-ribosome"><i />Ribosomes</div>
          </div>
        </a>

        <div className="future-heading" data-landing-reveal>
          <p className="landing-eyebrow">The atlas will grow</p>
          <h2>New worlds should teach new ways to be alive.</h2>
        </div>

        <div className="future-world-grid">
          {futureWorlds.map((world) => <article className="future-world-card" key={world.title} data-landing-reveal>
            <FutureVisual kind={world.className} />
            <div className="future-card-copy">
              <span className="future-status">{world.status}</span>
              <p>{world.eyebrow}</p>
              <h3>{world.title}</h3>
              <p>{world.description}</p>
            </div>
          </article>)}
        </div>
      </section>

      <section className="landing-how" id="how-it-works">
        <header data-landing-reveal><p className="landing-eyebrow">How CellMap works</p><h2>Look closer.<br />Then ask what happens.</h2></header>
        <div className="how-grid">
          <article data-landing-reveal><span>01</span><i className="how-icon orbit" /><h3>Explore structure</h3><p>Orbit the whole cell or cross the membrane and move through its interior.</p></article>
          <article data-landing-reveal><span>02</span><i className="how-icon process" /><h3>Follow a process</h3><p>Watch information move from DNA to RNA to protein inside the same crowded space.</p></article>
          <article data-landing-reveal><span>03</span><i className="how-icon perturb" /><h3>Change a condition</h3><p>Add an inducer, remove a gene, or introduce a drug and observe the biological response.</p></article>
        </div>
      </section>

      <section className="landing-vision-callout" data-landing-reveal>
        <div>
          <p className="landing-eyebrow">Where this is going</p>
          <h2>From one bacterium to a navigable universe of life.</h2>
        </div>
        <p>Bacteria that build spores. Viruses that make decisions. Cells that harvest sunlight. Eventually, human cells with specific stories—not one generic diagram.</p>
        <a className="landing-button secondary" href="/vision">Explore the full vision <span>↗</span></a>
      </section>
    </main>

    <footer className="landing-footer">
      <a className="landing-brand" href="/"><CellMapMark /><span><b>CellMap</b><small>Understanding how life works—from the inside.</small></span></a>
      <p>Scientific relationships are preserved; scale and motion are simplified for exploration.</p>
    </footer>
  </div>
}
