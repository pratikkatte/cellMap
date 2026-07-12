import { useEffect } from 'react'

const worlds = [
  {
    number: '01',
    className: 'bacillus',
    name: 'Bacillus subtilis',
    kicker: 'Change the walls. Change the story.',
    title: 'A cell that can pack itself for the future.',
    body: 'When food runs out, Bacillus does something astonishing: it builds a smaller, tougher version of itself inside itself. We want you to watch the wall thicken, the forespore form, and a dormant spore emerge ready to wait out the hard years.',
    payoff: 'The big idea · survival by transformation',
  },
  {
    number: '02',
    className: 'caulobacter',
    name: 'Caulobacter',
    kicker: 'Give a cell a sense of time.',
    title: 'One division. Two very different futures.',
    body: 'One daughter swims away with a flagellum. The other stays behind on a stalk. Following that change turns a cell cycle from a circular diagram into a life story you can scrub through, pause, and enter at any moment.',
    payoff: 'The big idea · identity through time',
  },
  {
    number: '03',
    className: 'minimal',
    name: 'The minimal cell',
    kicker: 'Remove everything life can spare.',
    title: 'How little can a living cell get away with?',
    body: 'A minimal cell lets us ask the cleanest question in biology. Switch off one gene, one machine, one route for making energy—and see where life stops. Not as a quiz with a red X, but as a living system quietly losing a capability.',
    payoff: 'The big idea · what makes life sufficient',
  },
  {
    number: '04',
    className: 'cyano',
    name: 'A cyanobacterium',
    kicker: 'Let sunlight enter the map.',
    title: 'Watch light become chemistry.',
    body: 'Inside folded membranes, captured light moves electrons, pumps protons, makes chemical energy, and helps pull carbon from the air. This is our bridge from bacterial life toward chloroplasts, plants, and a planet transformed by oxygen.',
    payoff: 'The big idea · energy from a star',
  },
]

function WorldIllustration({ kind }: { kind: string }) {
  return <div className={`world-illustration ${kind}`} aria-hidden="true">
    <div className="world-halo" />
    {kind === 'bacillus' && <div className="bacillus-body"><i className="spore" /><i className="dna-loop" /><b /><b /><b /></div>}
    {kind === 'caulobacter' && <><div className="caulo-body"><i /></div><div className="caulo-stalk" /><div className="caulo-flagellum" /></>}
    {kind === 'minimal' && <div className="minimal-body"><i /><i /><i /><i /><span /></div>}
    {kind === 'cyano' && <div className="cyano-body"><i /><i /><i /><i /><span /><b /><b /></div>}
  </div>
}

export default function VisionPage() {
  useEffect(() => {
    document.title = 'The CellMap Vision — A living atlas of biology'
    const page = document.querySelector<HTMLElement>('.vision-page')
    const reveals = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible'))
    }, { threshold: .12, root: page })
    reveals.forEach((element) => observer.observe(element))

    const updateProgress = () => {
      if (!page) return
      const available = page.scrollHeight - page.clientHeight
      page.style.setProperty('--reading-progress', `${available > 0 ? page.scrollTop / available * 100 : 0}%`)
    }
    page?.addEventListener('scroll', updateProgress, { passive: true })
    updateProgress()
    return () => {
      observer.disconnect()
      page?.removeEventListener('scroll', updateProgress)
    }
  }, [])

  return <div className="vision-page">
    <div className="vision-reading-progress" aria-hidden="true"><i /></div>

    <header className="vision-nav">
      <a className="vision-brand" href="/" aria-label="CellMap home">
        <span className="vision-brand-mark"><i /><i /><i /></span>
        <span><b>CellMap</b><small>Understanding life from the inside</small></span>
      </a>
      <nav aria-label="Vision page navigation">
        <a href="#next-worlds">The next worlds</a>
        <a href="#roadmap">Roadmap</a>
        <a className="vision-nav-cta" href="/explore/ecoli">Explore E. coli <span>↗</span></a>
      </nav>
    </header>

    <main>
      <section className="vision-hero">
        <div className="vision-hero-image" role="img" aria-label="An illustrated journey from bacteria and bacteriophages toward the complexity of a human cell" />
        <div className="vision-hero-shade" />
        <div className="vision-dust" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} />)}</div>
        <div className="vision-hero-copy">
          <p className="vision-overline"><span /> The vision for CellMap</p>
          <h1>What if biology felt like a place you could visit?</h1>
          <p className="vision-deck">We started with one <i>E. coli</i> cell. But one cell is not the destination. It is the first door into a living, explorable universe.</p>
          <div className="vision-hero-actions">
            <a className="vision-button primary" href="#the-idea">Read the story <span>↓</span></a>
            <a className="vision-button quiet" href="/explore/ecoli">Enter the current cell <span>↗</span></a>
          </div>
        </div>
        <div className="vision-scroll-cue"><i /><span>Scroll into the microscopic world</span></div>
      </section>

      <article className="vision-article">
        <section className="vision-opening" id="the-idea" data-reveal>
          <div className="vision-section-label"><span>00</span><p>The idea</p></div>
          <div className="vision-opening-copy">
            <p className="vision-dropcap">Biology is usually handed to us as a diagram. A tidy cross-section. A list of labels. Useful, yes. But cells do not feel like lists.</p>
            <p>They are crowded, changing places. Messages are being copied. Machines are assembling. Walls are sensing the outside world. A cell can decide to swim, divide, hide, fight, cooperate—or wait a thousand years for better conditions.</p>
            <blockquote>CellMap is our attempt to make that invisible life feel navigable.</blockquote>
            <p>Not a perfect simulation of every atom. Not a prettier textbook plate. Something in between: a scientifically grounded world where you can move through structure, follow a process, change a condition, and watch biology answer back.</p>
          </div>
        </section>

        <section className="vision-origin" data-reveal>
          <div className="origin-copy">
            <p className="vision-eyebrow">Where we are now</p>
            <h2>We began with biology’s workshop bench.</h2>
            <p><i>Escherichia coli</i> is one of the most studied organisms on Earth. In CellMap, you can circle its envelope, slip inside, meet the chromosome and ribosomes, and watch a gene become a protein.</p>
            <p>You can also nudge the cell: add an inducer, change its history, remove a gene, expose it to a drug. That shift—from <em>looking</em> to <em>asking</em>—is the seed of the whole project.</p>
          </div>
          <div className="origin-window" aria-label="A stylized view of the current E. coli world">
            <div className="origin-orbit"><i /><i /><i /></div>
            <div className="origin-cell"><span className="origin-dna" /><b /><b /><b /><b /><b /></div>
            <div className="origin-caption"><span>LIVE WORLD · 001</span><b>E. coli</b><small>Structure, gene expression, perturbation</small></div>
          </div>
        </section>

        <section className="vision-principle" data-reveal>
          <p>But here is the important bit:</p>
          <h2>We are not building a zoo of differently shaped cells.</h2>
          <p>Every new organism should earn its place by teaching us a new way to be alive.</p>
        </section>

        <section className="worlds-section" id="next-worlds">
          <header className="vision-section-heading" data-reveal>
            <div className="vision-section-label"><span>01—04</span><p>The next worlds</p></div>
            <div><h2>Four cells. Four new ideas.</h2><p>The shape matters. The new biological verb matters more.</p></div>
          </header>

          <div className="world-list">
            {worlds.map((world, index) => <article className={`world-row ${index % 2 ? 'reverse' : ''}`} key={world.name} data-reveal>
              <WorldIllustration kind={world.className} />
              <div className="world-copy">
                <div className="world-meta"><span>{world.number}</span><p>{world.name}</p></div>
                <p className="world-kicker">{world.kicker}</p>
                <h3>{world.title}</h3>
                <p>{world.body}</p>
                <small>{world.payoff}</small>
              </div>
            </article>)}
          </div>
        </section>

        <section className="phage-feature" data-reveal>
          <img src="/images/cellmap-phage-infection.webp" alt="A T4-like bacteriophage attaching to and delivering DNA through the layered envelope of an E. coli cell" />
          <div className="phage-gradient" />
          <div className="phage-copy">
            <p className="vision-eyebrow">Then, let the viruses in</p>
            <h2>The strange little machines at the door.</h2>
            <p>A virus is not simply a smaller cell. Outside a host, it is a beautifully packed set of instructions. Inside a host, it becomes a process.</p>
            <p>That is why viruses belong in CellMap as relationships—not floating museum objects.</p>
          </div>
          <div className="phage-sequence" aria-label="Phage infection sequence">
            {['Find', 'Attach', 'Inject', 'Decide', 'Build', 'Exit'].map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b></div>)}
          </div>
        </section>

        <section className="virus-stories">
          <article data-reveal>
            <span className="virus-badge">T4</span>
            <p className="vision-eyebrow">A mechanical story</p>
            <h3>Land. Grip. Contract. Inject.</h3>
            <p>T4 gives us a spectacular first infection: tail fibers touch the bacterial surface, the baseplate locks, the sheath contracts, and viral DNA crosses the envelope. Later, the cell fills with newly assembled phages and opens.</p>
          </article>
          <article data-reveal>
            <span className="virus-badge lambda">λ</span>
            <p className="vision-eyebrow">A decision story</p>
            <h3>Reproduce now—or become a memory?</h3>
            <p>Lambda can destroy the cell immediately, or quietly stitch itself into the host chromosome. The user changes the conditions and watches a small genetic circuit choose between two futures.</p>
          </article>
          <article data-reveal>
            <span className="virus-badge ms2">MS2</span>
            <p className="vision-eyebrow">A minimal story</p>
            <h3>How does RNA build a shell around itself?</h3>
            <p>MS2 makes viral assembly understandable: a compact RNA genome, repeated coat proteins, and a beautifully economical icosahedral shell. A few parts, arranged with exquisite precision.</p>
          </article>
        </section>

        <section className="experience-section" data-reveal>
          <div className="vision-section-label"><span>05</span><p>What changes for the user</p></div>
          <div className="experience-heading">
            <h2>From a model viewer<br />to a place for asking “what if?”</h2>
          </div>
          <div className="experience-grid">
            <div><span>↔</span><h3>Compare</h3><p>Place two envelopes side by side and see why the same antibiotic meets a different barrier.</p></div>
            <div><span>◷</span><h3>Move through time</h3><p>Scrub from a swimming cell to a dividing cell, or from viral landing to viral escape.</p></div>
            <div><span>⌁</span><h3>Perturb</h3><p>Change a gene, nutrient, drug, light level, or infection dose—and watch the system respond.</p></div>
            <div><span>◎</span><h3>Change scale</h3><p>Travel from a molecular motor to a whole cell to a population making different decisions.</p></div>
          </div>
        </section>

        <section className="roadmap-section" id="roadmap">
          <header data-reveal>
            <p className="vision-eyebrow">A path we can actually build</p>
            <h2>One biological leap at a time.</h2>
          </header>
          <div className="roadmap-line" data-reveal>
            {[
              ['Now', 'E. coli', 'Build the reference world'],
              ['Next', 'B. subtilis', 'Change the envelope'],
              ['Then', 'T4 + Lambda', 'Let viruses become stories'],
              ['After', 'Caulobacter', 'Give the cell a timeline'],
              ['Further', 'Minimal + Cyano', 'Find life’s floor and its sunlight'],
            ].map(([time, title, detail], index) => <div className={index === 0 ? 'active' : ''} key={title}>
              <i><b>{index + 1}</b></i><span>{time}</span><h3>{title}</h3><p>{detail}</p>
            </div>)}
          </div>
        </section>

        <section className="human-horizon" data-reveal>
          <div className="human-cell" aria-hidden="true"><i /><i /><i /><span /><b /><b /></div>
          <div className="human-copy">
            <p className="vision-eyebrow">And then, humans</p>
            <h2>Not “the human cell.”<br />A human cell with a story.</h2>
            <p>There is no single human cell. A lung cell meets an airborne virus. A macrophage hunts bacteria. A neuron carries an electrical signal down an impossible distance.</p>
            <p>When CellMap reaches humans, we should arrive with the language already learned: membranes, decisions, energy, infection, time. Then complexity will not feel like a wall. It will feel like the next room.</p>
          </div>
        </section>

        <section className="vision-manifesto" data-reveal>
          <p className="vision-eyebrow">The north star</p>
          <h2>A living atlas where scale, time, and cause are all explorable.</h2>
          <div className="manifesto-words" aria-label="CellMap principles"><span>Enter</span><i /><span>Observe</span><i /><span>Change</span><i /><span>Understand</span></div>
          <p>Keep the wonder. Show the evidence. Be honest about what is measured, what is modeled, and what is drawn for clarity. Let a curious person arrive without specialist vocabulary—and leave with a better intuition for how life works.</p>
        </section>

        <section className="evidence-strip" data-reveal>
          <div><span>Grounded in real biology</span><p>The visual worlds stay approachable, while their genomes, structures, and regulatory stories remain traceable to public scientific resources.</p></div>
          <nav aria-label="Scientific resources">
            <a href="https://www.ncbi.nlm.nih.gov/bioproject/29889" target="_blank" rel="noreferrer">B. subtilis genome ↗</a>
            <a href="https://www.rcsb.org/structure/2BSG" target="_blank" rel="noreferrer">T4 structure ↗</a>
            <a href="https://www.rcsb.org/structure/2MS2" target="_blank" rel="noreferrer">MS2 structure ↗</a>
          </nav>
        </section>

        <section className="vision-closing" data-reveal>
          <p className="vision-eyebrow">The first door is already open</p>
          <h2>Start with one cell.<br />Keep going until biology feels like a world.</h2>
          <a className="vision-button primary" href="/explore/ecoli">Explore the E. coli cell <span>↗</span></a>
        </section>
      </article>
    </main>

    <footer className="vision-footer">
      <a className="vision-brand" href="/"><span className="vision-brand-mark"><i /><i /><i /></span><span><b>CellMap</b><small>Understanding how life works—from the inside.</small></span></a>
      <p>Vision article · 2026</p>
    </footer>
  </div>
}
