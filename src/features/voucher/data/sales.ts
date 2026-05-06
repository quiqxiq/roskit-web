import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { hotspotProfilesSeed } from '@/features/hotspot/profiles/data/data'

faker.seed(400)

export const voucherSaleSchema = z.object({
  id: z.number(),
  routerId: z.number(),
  soldAt: z.coerce.date(),
  username: z.string(),
  profileName: z.string(),
  price: z.number(),
  sellingPrice: z.number(),
  server: z.string(),
  ipAddress: z.string(),
  macAddress: z.string(),
  validity: z.string(),
  gencode: z.string(),
})
export type VoucherSale = z.infer<typeof voucherSaleSchema>

const SERVERS = ['HS-01', 'HS-02', 'HS-03']

function randomMac(): string {
  return Array.from({ length: 6 }, () =>
    faker.number
      .int({ min: 0, max: 255 })
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  ).join(':')
}

function generateSales(count: number): VoucherSale[] {
  const result: VoucherSale[] = []
  const now = new Date()
  const startMs = now.getTime() - 60 * 24 * 60 * 60 * 1000

  for (let i = 0; i < count; i++) {
    const profile = faker.helpers.arrayElement(hotspotProfilesSeed)
    const weight = Math.random() ** 2
    const offsetMs = (now.getTime() - startMs) * weight
    const soldAt = new Date(startMs + offsetMs)
    const username = `${faker.helpers.arrayElement(['vc', 'up'])}${faker.string.numeric(5)}`
    const gencode = `${soldAt.getTime()}`

    result.push({
      id: i + 1,
      routerId: 1,
      soldAt,
      username,
      profileName: profile.name,
      price: profile.price,
      sellingPrice: profile.sellingPrice,
      server: faker.helpers.arrayElement(SERVERS),
      ipAddress: faker.internet.ipv4(),
      macAddress: randomMac(),
      validity: profile.validity,
      gencode,
    })
  }

  return result.sort((a, b) => b.soldAt.getTime() - a.soldAt.getTime())
}

export const voucherSalesSeed: VoucherSale[] = generateSales(200)

export function filterTodaySales(
  sales: VoucherSale[],
  now: Date = new Date()
): VoucherSale[] {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return sales.filter((s) => s.soldAt >= start && s.soldAt < end)
}

export function filterMonthSales(
  sales: VoucherSale[],
  date: Date = new Date()
): VoucherSale[] {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 1)
  return sales.filter((s) => s.soldAt >= start && s.soldAt < end)
}

export function filterDaySales(
  sales: VoucherSale[],
  date: Date
): VoucherSale[] {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return sales.filter((s) => s.soldAt >= start && s.soldAt < end)
}

export function recentSales(sales: VoucherSale[], limit = 10): VoucherSale[] {
  return sales.slice(0, limit)
}

export function sumSelling(sales: VoucherSale[]): number {
  return sales.reduce((acc, s) => acc + s.sellingPrice, 0)
}

export function sumPrice(sales: VoucherSale[]): number {
  return sales.reduce((acc, s) => acc + s.price, 0)
}
