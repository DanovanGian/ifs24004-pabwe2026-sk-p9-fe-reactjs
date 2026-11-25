import { renderHook, act } from '@testing-library/react'
import useInput from './useInput'

describe('useInput', () => {
  it('nilai awal default kosong', () => {
    const { result } = renderHook(() => useInput())
    expect(result.current[0]).toBe('')
  })

  it('onChange, setValue, dan reset', () => {
    const { result } = renderHook(() => useInput('a'))
    expect(result.current[0]).toBe('a')

    act(() => result.current[1]({ target: { value: 'b' } }))
    expect(result.current[0]).toBe('b')

    act(() => result.current[2]('z'))
    expect(result.current[0]).toBe('z')

    act(() => result.current[3]())
    expect(result.current[0]).toBe('a')
  })
})
