import { useEffect, useRef } from 'react'
import Editor from '@toast-ui/editor'

export default function MarkdownEditor({ value, dark, height, onChange }) {
  const rootRef = useRef(null)
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    const editor = new Editor({
      el: rootRef.current,
      height,
      initialEditType: 'markdown',
      previewStyle: 'tab',
      initialValue: value,
      theme: dark ? 'dark' : 'light',
      events: {
        change: () => onChangeRef.current(editor.getMarkdown()),
      },
    })
    return () => editor.destroy()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark])

  return <div ref={rootRef} data-testid="markdown-editor" />
}
