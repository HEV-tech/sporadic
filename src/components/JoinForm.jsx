import { useEffect, useRef, useState } from 'react'
import { CLUB, FORM } from '../data/content.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const emptyValues = { name: '', email: '', call: '', topic: FORM.topics[0] }

/**
 * Список «Что интересно»: своя раскрывашка вместо нативного select —
 * чтобы ширина совпадала с полем, а низ был скруглён, как в меню.
 */
function TopicSelect({ id, labelId, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [dir, setDir] = useState('down')
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)))
  const rootRef = useRef(null)
  const triggerRef = useRef(null)

  // Место внизу кончается — раскрываем вверх, зеркаля скругления.
  const place = () => {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return 'down'
    const needed = Math.min(260, options.length * 37 + 14)
    const below = window.innerHeight - rect.bottom
    return below < needed && rect.top > below ? 'up' : 'down'
  }

  useEffect(() => {
    if (!open) return undefined

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
    }
  }, [open])

  const choose = (index) => {
    setActive(index)
    onChange(options[index])
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!open) {
        setDir(place())
        setOpen(true)
        return
      }
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current + delta + options.length) % options.length)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      if (!open) return
      event.preventDefault()
      choose(active)
      return
    }

    if (event.key === 'Escape' && open) {
      event.preventDefault()
      setOpen(false)
    }
  }

  return (
    <div className="field-select" ref={rootRef} data-dir={open ? dir : undefined}>
      <button
        type="button"
        id={id}
        ref={triggerRef}
        className="field-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${labelId} ${id}`}
        onClick={() => {
          setActive(Math.max(0, options.indexOf(value)))
          setDir(place())
          setOpen((current) => !current)
        }}
        onKeyDown={onKeyDown}
      >
        <span>{value}</span>
        <svg className="field-chevron" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul className="field-menu" role="listbox" aria-labelledby={labelId}>
          {options.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={option === value}
              className={index === active ? 'is-active' : undefined}
              onMouseEnter={() => setActive(index)}
              onClick={() => choose(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function JoinForm() {
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [mailto, setMailto] = useState(null)
  const nameRef = useRef(null)
  const emailRef = useRef(null)

  const update = (field) => (event) => {
    const { value } = event.target
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const next = {}
    if (values.name.trim().length < 2) next.name = FORM.errors.name
    if (!EMAIL_RE.test(values.email.trim())) next.email = FORM.errors.email
    setErrors(next)

    if (Object.keys(next).length > 0) {
      setMailto(null)
      const target = next.name ? nameRef : emailRef
      target.current?.focus()
      return
    }

    const body = [
      `Имя: ${values.name.trim()}`,
      `Почта: ${values.email.trim()}`,
      `Позывной: ${values.call.trim() || 'нет'}`,
      `Направление: ${values.topic}`,
    ].join('\r\n')

    // Бэкенда нет: собираем письмо в почтовом клиенте, а не делаем вид, что отправили.
    setMailto(
      `mailto:${CLUB.email}?subject=${encodeURIComponent('Заявка в актив клуба')}` +
        `&body=${encodeURIComponent(body)}`,
    )
  }

  return (
    <div className="form-card">
      <h3>{FORM.title}</h3>
      <p className="note">{FORM.note}</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label htmlFor="name">{FORM.fields.name.label}</label>
          <input
            id="name"
            ref={nameRef}
            name="name"
            type="text"
            autoComplete="name"
            placeholder={FORM.fields.name.placeholder}
            value={values.name}
            onChange={update('name')}
            aria-invalid={Boolean(errors.name)}
            aria-describedby="name-err"
          />
          <p className="err" id="name-err" hidden={!errors.name}>
            {FORM.errors.name}
          </p>
        </div>

        <div className="field">
          <label htmlFor="email">{FORM.fields.email.label}</label>
          <input
            id="email"
            ref={emailRef}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={FORM.fields.email.placeholder}
            value={values.email}
            onChange={update('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="email-err"
          />
          <p className="err" id="email-err" hidden={!errors.email}>
            {FORM.errors.email}
          </p>
        </div>

        <div className="field">
          <label htmlFor="call">{FORM.fields.call.label}</label>
          <input
            id="call"
            name="call"
            type="text"
            autoComplete="off"
            placeholder={FORM.fields.call.placeholder}
            value={values.call}
            onChange={update('call')}
          />
        </div>

        <div className="field">
          <label htmlFor="topic" id="topic-label">
            {FORM.fields.topic.label}
          </label>
          <TopicSelect
            id="topic"
            labelId="topic-label"
            value={values.topic}
            options={FORM.topics}
            onChange={(topic) => setValues((prev) => ({ ...prev, topic }))}
          />
        </div>

        <button className="btn btn-primary" type="submit">
          {FORM.submit}
        </button>

        <div className="form-status" id="form-status" role="status" aria-live="polite" hidden={!mailto}>
          <b>{FORM.status.title}</b> {FORM.status.text}
          <div style={{ marginTop: '12px' }}>
            <a className="btn btn-ghost btn-sm" href={mailto ?? '#'}>
              {FORM.status.action}
            </a>
          </div>
        </div>
      </form>
    </div>
  )
}
