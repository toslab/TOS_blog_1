import * as Headless from '@headlessui/react'
import NextLink, { type LinkProps } from 'next/link' // Next.js의 Link를 가져옵니다.
import React, { forwardRef } from 'react'

export const Link = forwardRef(function Link(
  // Button.tsx에서 사용하는 LinkProps와 호환되도록 props 타입을 정확히 맞춰주는 것이 중요합니다.
  // Catalyst Button.tsx의 Link 타입 정의를 참고하여 일치시키거나,
  // 간단하게는 NextLink의 props를 최대한 따르도록 합니다.
  props: LinkProps & Omit<React.ComponentPropsWithoutRef<'a'>, 'href'>, // href는 LinkProps에 이미 있으므로 Omit
  ref: React.ForwardedRef<HTMLAnchorElement>
) {
  return (
    <Headless.DataInteractive>
      <NextLink {...props} ref={ref} />
    </Headless.DataInteractive>
  )
})