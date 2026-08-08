import NextImage from 'next/image'
import type { DesktopPlatform } from '../types'

type AccountAvatarProps = {
  platform: DesktopPlatform
  className: string
  size: number
}

export function AccountAvatar({ platform, className, size }: AccountAvatarProps) {
  if (platform === 'macos') {
    return (
      <span className={`${className} account-avatar-image`} aria-label="Muhammad Ammar Asad account">
        <NextImage src="/ammar-avatar.png" width={size} height={size} alt="Abstract developer profile avatar for Muhammad Ammar Asad" />
      </span>
    )
  }

  return <span className={className}>MA<i /></span>
}
