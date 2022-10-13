import { StyleSheet, Text, View, TextInput, TextInputProps } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

interface TextInputLoginProps extends TextInputProps {
  setValue: (val: string) => void
}

export const TextInputLogin = (props: TextInputLoginProps) => {
  const { setValue, value = "", style, ...InputProps } = props

  const [input, setInput] = useState<string>(value)

  const timeOut = useRef<any>()

  useEffect(() => {

    return () => {
      clearTimeout(timeOut.current)
    }
  }, [])


  const onChangeHandle = (val: string) => {
    setInput(val)
    timeOut.current = setTimeout(() => {
      setValue(val)
    }, 500)
  }

  return (
    <TextInput
      value={input}
      onChangeText={onChangeHandle}
      style={[styles.container, style]}
      {...InputProps}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EEEEEE",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 18,
    color: "black"
  }
})