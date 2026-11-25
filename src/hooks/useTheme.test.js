import { renderHook, act } from '@testing-library/react'
import useTheme from './useTheme'

const accentVar = () => document.documentElement.style.getPropertyValue('--accent')

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.style.removeProperty('--accent')
  })

  it('memakai nilai default', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')
    expect(result.current.accent).toBe('blue')
    expect(result.current.accents).toContain('green')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(accentVar()).toBe('#2563eb')
  })

  it('membaca nilai tersimpan', () => {
    localStorage.setItem('theme', 'dark')
    localStorage.setItem('accent', 'rose')
    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(accentVar()).toBe('#e11d48')
  })

  it('toggleTheme bolak-balik', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('theme')).toBe('dark')
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
  })

  it('setAccent valid dan tidak dikenal', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.setAccent('green'))
    expect(accentVar()).toBe('#16a34a')
    act(() => result.current.setAccent('tidak-ada'))
    expect(accentVar()).toBe('#2563eb')
  })
})
