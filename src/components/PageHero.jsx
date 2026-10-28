export default function PageHero({ title, lede, children }) {
  return (
    <header className="page-head">
      <h1 className="page-title">{title}</h1>
      {lede && <p className="lede page-lede">{lede}</p>}
      {children}
    </header>
  )
}
