import NextImage from 'next/image'
import type { DesktopPlatform } from '../types'

type AccountAvatarProps = {
  platform: DesktopPlatform
  className: string
  size: number
}

export function AccountAvatar({ className, size }: AccountAvatarProps) {
  return (
    <span className={`${className} account-avatar-image`} aria-label="Muhammad Ammar Asad account">
      <NextImage src="/ammar-avatar.png" width={size} height={size} alt="Photograph of Muhammad Ammar Asad" />
    </span>
  )
}
