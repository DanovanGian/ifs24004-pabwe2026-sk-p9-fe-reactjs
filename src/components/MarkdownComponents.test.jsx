import { render } from '@testing-library/react'
import MarkdownEditor from './MarkdownEditor'
import MarkdownViewer from './MarkdownViewer'

const instances = vi.hoisted(() => [])

vi.mock('@toast-ui/editor', () => {
  class FakeEditor {
    constructor(opts) {
      this.opts = opts
      this.destroyed = false
      instances.push(this)
    }
    getMarkdown() {
      return 'md-isi'
    }
    destroy() {
      this.destroyed = true
    }
    static factory(opts) {
      return new FakeEditor(opts)
    }
  }
  return { default: FakeEditor }
})

beforeEach(() => {
  instances.length = 0
})

describe('MarkdownEditor', () => {
  it('membuat editor, meneruskan perubahan, dan menghancurkannya', () => {
    const onChange = vi.fn()
    const { rerender, unmount } = render(
      <MarkdownEditor value="awal" dark={false} height="300px" onChange={onChange} />,
    )
    expect(instances[0].opts.initialValue).toBe('awal')
    expect(instances[0].opts.theme).toBe('light')

    instances[0].opts.events.change()
    expect(onChange).toHaveBeenCalledWith('md-isi')

    rerender(<MarkdownEditor value="awal" dark height="300px" onChange={onChange} />)
    expect(instances[0].destroyed).toBe(true)
    expect(instances[1].opts.theme).toBe('dark')

    unmount()
    expect(instances[1].destroyed).toBe(true)
  })
})

describe('MarkdownViewer', () => {
  it('membuat viewer dan membersihkannya', () => {
    const { rerender, unmount } = render(<MarkdownViewer content="# Halo" dark={false} />)
    expect(instances[0].opts.viewer).toBe(true)
    expect(instances[0].opts.initialValue).toBe('# Halo')
    expect(instances[0].opts.theme).toBe('light')

    rerender(<MarkdownViewer content="# Baru" dark />)
    expect(instances[0].destroyed).toBe(true)
    expect(instances[1].opts.theme).toBe('dark')

    unmount()
    expect(instances[1].destroyed).toBe(true)
  })
})
