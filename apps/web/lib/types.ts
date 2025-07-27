import type { ComponentType, SVGProps } from "react"

export type ActionTagType = "risk" | "attention" | "opportunity" | "sponsored"

export interface Action {
  icon: ComponentType<any>
  iconBg: string
  iconColor: string
  title: string
  description: string
  impact?: string
  tag?: string
  tagType?: ActionTagType
  walletName: string
  chainName: string
  chainIcon: ComponentType<SVGProps<SVGSVGElement>>
  chainColor: string
  whyItMatters: string
  educationalTip: string
  buttonText?: string
  buttonVariant?: "primary" | "secondary"
  source?: string
  isPromotional?: boolean
  link?: string
}

export interface Category {
  name: string
  icon: ComponentType<{ className?: string }>
  count?: number
  selected?: boolean
}

export interface Wallet {
  name: string
  icon: ComponentType<{ className?: string }>
  address: string
  selected?: boolean
}
