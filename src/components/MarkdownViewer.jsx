import { useEffect, useRef } from 'react'
import Editor from '@toast-ui/editor'

export default function MarkdownViewer({ content, dark }) {
  const rootRef = useRef(null)

  useEffect(() => {
    const viewer = Editor.factory({
      el: rootRef.current,
      viewer: true,
      initialValue: content,
      theme: dark ? 'dark' : 'light',
    })
    return () => viewer.destroy()
  }, [content, dark])

  return <div ref={rootRef} data-testid="markdown-viewer" />
}
